import bcrypt from 'bcrypt';
import db from './database.js';

const DEMO_EMAIL = 'jake@example.com';
const DEMO_PASSWORD = 'Customer123!';

export async function ensureDemoCustomer() {
  const existing = db.prepare('SELECT id, password FROM users WHERE email = ?').get(DEMO_EMAIL);
  if (existing && await bcrypt.compare(DEMO_PASSWORD, existing.password)) return;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  if (existing) {
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(passwordHash, existing.id);
    return;
  }

  db.prepare(`
    INSERT OR IGNORE INTO users (first_name, email, password, dob, postcode, points, tier)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('Jake', DEMO_EMAIL, passwordHash, '1995-04-20', 'NY 10001', 340, 'Grillmaster');
}
