import db from '../db/database.js';

function normalizeItem(row) {
  return {
    ...row,
    is_featured: Boolean(row.is_featured),
    is_available: Boolean(row.is_available),
  };
}

export function getMenu(req, res) {
  const { category, featured, search } = req.query;
  const conditions = ['is_available = 1'];
  const params = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (featured === 'true') {
    conditions.push('is_featured = 1');
  }

  if (search) {
    conditions.push('(name LIKE ? OR description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const sql = `
    SELECT id, name, category, price, description, calories, rating, image_url, is_featured, is_available
    FROM menu_items
    WHERE ${conditions.join(' AND ')}
    ORDER BY is_featured DESC, name ASC
  `;

  const items = db.prepare(sql).all(...params).map(normalizeItem);
  res.json({ success: true, count: items.length, items });
}

export function getMenuItem(req, res) {
  const item = db.prepare(`
    SELECT id, name, category, price, description, calories, rating, image_url, is_featured, is_available
    FROM menu_items WHERE id = ?
  `).get(req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  res.json({ success: true, item: normalizeItem(item) });
}

export function getCategories(req, res) {
  const rows = db.prepare('SELECT DISTINCT category FROM menu_items ORDER BY category ASC').all();
  res.json({ categories: rows.map((row) => row.category) });
}
