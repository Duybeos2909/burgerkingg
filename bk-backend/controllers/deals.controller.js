import db from '../db/database.js';

function nowIso() {
  return new Date().toISOString();
}

function normalizeDeal(row) {
  return {
    ...row,
    is_app_only: Boolean(row.is_app_only),
    is_active: Boolean(row.is_active),
    seconds_remaining: Math.max(0, Math.floor((new Date(row.expires_at).getTime() - Date.now()) / 1000)),
  };
}

export function calculateDiscount(promoCode, subtotal) {
  const code = promoCode?.trim().toUpperCase();
  if (!code || subtotal <= 0) return 0;

  switch (code) {
    case 'FREEFRIES':
      return Math.min(2.49, subtotal);
    case 'APP20':
      return Number((subtotal * 0.2).toFixed(2));
    case 'COMBO799':
      return subtotal > 7.99 ? Number((subtotal - 7.99).toFixed(2)) : 0;
    case 'DOUBLE12':
      return subtotal > 12 ? Number((subtotal - 12).toFixed(2)) : 0;
    default:
      return 0;
  }
}

function getActiveDealByCode(promoCode) {
  return db.prepare(`
    SELECT * FROM deals
    WHERE promo_code = ? AND is_active = 1 AND expires_at > ?
  `).get(promoCode.trim().toUpperCase(), nowIso());
}

export function getDeals(req, res) {
  const conditions = ['is_active = 1', 'expires_at > ?'];
  const params = [nowIso()];

  if (req.query.app_only === 'true') {
    conditions.push('is_app_only = 1');
  }

  const deals = db.prepare(`
    SELECT * FROM deals
    WHERE ${conditions.join(' AND ')}
    ORDER BY expires_at ASC
  `).all(...params).map(normalizeDeal);

  res.json({ success: true, deals });
}

export function validateDeal(req, res) {
  const { promo_code, subtotal } = req.body;
  const deal = getActiveDealByCode(promo_code);

  if (!deal) {
    return res.json({ valid: false, message: 'This promo code has expired or does not exist.' });
  }

  const discount = calculateDiscount(promo_code, Number(subtotal || 0));
  res.json({
    valid: true,
    deal: { title: deal.title, offer: deal.offer },
    discount,
    new_total: Number(Math.max(0, Number(subtotal) - discount).toFixed(2)),
  });
}
