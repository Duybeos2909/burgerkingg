import bcrypt from 'bcrypt';
import db from './database.js';

export async function ensureAdminAccount() {
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!password) return false;
  if (password.length < 8) {
    throw new Error('ADMIN_BOOTSTRAP_PASSWORD must be at least 8 characters.');
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@bk.com').trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  db.prepare(`
    INSERT INTO users (first_name, email, password, points, tier)
    VALUES ('Admin', ?, ?, 0, 'Grillmaster')
    ON CONFLICT(email) DO UPDATE SET password = excluded.password
  `).run(email, passwordHash);

  console.warn(`Admin password bootstrapped for ${email}; the configured password is reapplied on every start until ADMIN_BOOTSTRAP_PASSWORD is removed.`);
  return true;
}
