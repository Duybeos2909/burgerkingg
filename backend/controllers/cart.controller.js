import db from '../db/database.js';

function getMenuItem(menuItemId) {
  return db.prepare(`
    SELECT id, name, price, is_available
    FROM menu_items WHERE id = ?
  `).get(menuItemId);
}

function ensureCart(userId) {
  let cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(userId);
  if (!cart) {
    db.prepare('INSERT INTO carts (user_id, items) VALUES (?, ?)').run(userId, '[]');
    cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(userId);
  }
  return cart;
}

function parseItems(cartRow) {
  return JSON.parse(cartRow?.items || '[]');
}

function serializeCart(userId, items) {
  db.prepare(`
    UPDATE carts SET items = ?, updated_at = datetime('now') WHERE user_id = ?
  `).run(JSON.stringify(items), userId);
}

function buildCartResponse(items) {
  const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2));
  const item_count = items.reduce((sum, item) => sum + item.qty, 0);
  return { items, subtotal, item_count };
}

export function getCart(req, res) {
  const cart = ensureCart(req.user.id);
  res.json(buildCartResponse(parseItems(cart)));
}

export function addToCart(req, res) {
  const { menu_item_id, qty } = req.body;
  const item = getMenuItem(menu_item_id);

  if (!item || !item.is_available) {
    return res.status(404).json({ error: 'Menu item not found or unavailable' });
  }

  const cart = ensureCart(req.user.id);
  const items = parseItems(cart);
  const existing = items.find((entry) => entry.menu_item_id === menu_item_id);

  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ menu_item_id, name: item.name, price: item.price, qty });
  }

  serializeCart(req.user.id, items);
  res.json(buildCartResponse(items));
}

export function updateCart(req, res) {
  const { menu_item_id, qty } = req.body;
  const cart = ensureCart(req.user.id);
  let items = parseItems(cart);
  const index = items.findIndex((entry) => entry.menu_item_id === menu_item_id);

  if (index === -1) {
    return res.status(404).json({ error: 'Cart item not found' });
  }

  if (qty === 0) {
    items.splice(index, 1);
  } else {
    const dbItem = getMenuItem(menu_item_id);
    if (!dbItem || !dbItem.is_available) {
      return res.status(404).json({ error: 'Menu item not found or unavailable' });
    }
    items[index] = { ...items[index], name: dbItem.name, price: dbItem.price, qty };
  }

  serializeCart(req.user.id, items);
  res.json(buildCartResponse(items));
}

export function clearCart(req, res) {
  ensureCart(req.user.id);
  serializeCart(req.user.id, []);
  res.json({ success: true });
}
