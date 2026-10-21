import db from '../db/database.js';
import { calculateDiscount } from './deals.controller.js';

const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

function getTierForPoints(points) {
  if (points >= 1500) return { tier: 'Whopper King', multiplier: 15 };
  if (points >= 500) return { tier: 'Flame Boss', multiplier: 12 };
  return { tier: 'Grillmaster', multiplier: 10 };
}

function parseOrder(order) {
  return {
    ...order,
    items: JSON.parse(order.items || '[]'),
  };
}

function getActiveDealByCode(promoCode) {
  if (!promoCode) return null;
  return db.prepare(`
    SELECT * FROM deals
    WHERE promo_code = ? AND is_active = 1 AND expires_at > ?
  `).get(promoCode.trim().toUpperCase(), new Date().toISOString());
}

function recalculateUserTier(userId, newPoints) {
  const tierInfo = getTierForPoints(newPoints);
  db.prepare('UPDATE users SET points = ?, tier = ? WHERE id = ?').run(newPoints, tierInfo.tier, userId);
  return tierInfo;
}

function getValidatedItems(inputItems) {
  const stmt = db.prepare('SELECT id, name, price, is_available FROM menu_items WHERE id = ?');
  const items = [];

  for (const requested of inputItems) {
    const menuItem = stmt.get(requested.menu_item_id);
    if (!menuItem || !menuItem.is_available) {
      const error = new Error(`Menu item ${requested.menu_item_id} not found or unavailable`);
      error.status = 400;
      throw error;
    }
    items.push({
      menu_item_id: menuItem.id,
      name: menuItem.name,
      price: Number(menuItem.price),
      qty: requested.qty,
    });
  }

  return items;
}

function estimateReady(orderType) {
  return orderType === 'delivery' ? '25–35 mins' : '15–20 mins';
}

export function createOrder(req, res) {
  const { items: inputItems, order_type, store_id, promo_code, guest_email } = req.body;
  const store = db.prepare('SELECT id FROM stores WHERE id = ?').get(store_id);
  if (!store) {
    return res.status(400).json({ error: 'Store not found' });
  }

  if (!req.user?.id && !guest_email) {
    return res.status(400).json({ error: 'guest_email is required for guest checkout' });
  }

  const items = getValidatedItems(inputItems);
  const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2));

  let discount = 0;
  let normalizedPromoCode = null;
  if (promo_code) {
    const activeDeal = getActiveDealByCode(promo_code);
    if (!activeDeal) {
      return res.status(400).json({ error: 'Promo code is invalid or expired' });
    }
    normalizedPromoCode = promo_code.trim().toUpperCase();
    discount = calculateDiscount(normalizedPromoCode, subtotal);
  }

  const total = Number(Math.max(0, subtotal - discount).toFixed(2));

  let pointsEarned = 0;
  if (req.user?.id) {
    const user = db.prepare('SELECT id, points FROM users WHERE id = ?').get(req.user.id);
    const tierInfo = getTierForPoints(user.points);
    pointsEarned = Math.floor(total * tierInfo.multiplier);
  }

  const insert = db.prepare(`
    INSERT INTO orders (user_id, guest_email, items, subtotal, total, status, order_type, store_id, promo_code, discount, points_earned)
    VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    req.user?.id || null,
    req.user?.id ? null : guest_email || null,
    JSON.stringify(items),
    subtotal,
    total,
    order_type,
    store_id,
    normalizedPromoCode,
    discount,
    pointsEarned,
  );

  if (req.user?.id) {
    const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
    recalculateUserTier(req.user.id, user.points + pointsEarned);

    db.prepare(`
      UPDATE carts SET items = '[]', updated_at = datetime('now') WHERE user_id = ?
    `).run(req.user.id);
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    success: true,
    order: {
      ...parseOrder(order),
      estimated_ready: estimateReady(order_type),
    },
  });
}

export function getOrders(req, res) {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY datetime(created_at) DESC, id DESC').all(req.user.id);
  res.json({ success: true, count: orders.length, orders: orders.map(parseOrder) });
}

export function getOrderById(req, res) {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ success: true, order: parseOrder(order) });
}

export function updateOrderStatus(req, res) {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Order not found' });
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json({ success: true, order: parseOrder(updated) });
}
