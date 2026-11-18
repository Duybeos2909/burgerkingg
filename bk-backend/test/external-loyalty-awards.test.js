import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const testDirectory = mkdtempSync(path.join(os.tmpdir(), 'bk-loyalty-awards-'));
process.env.DB_PATH = path.join(testDirectory, 'test.sqlite');
process.env.ADMIN_EMAIL = 'admin@example.com';

const { default: db } = await import('../db/database.js');
const { syncExternalOrderPayment } = await import('../controllers/rewards.controller.js');

after(() => {
  db.close();
  rmSync(testDirectory, { recursive: true, force: true });
});

function seedUser(email, points = 0) {
  db.prepare(`
    INSERT INTO users (first_name, email, password, points, tier)
    VALUES ('Test', ?, 'not-used', ?, 'Grillmaster')
  `).run(email, points);
}

function syncPayment({ orderId, paid, email = 'member@example.com', totalCents = 2500 }) {
  let responseBody;
  const response = {
    json(body) {
      responseBody = body;
      return this;
    },
    status() {
      return this;
    },
  };
  syncExternalOrderPayment({
    body: {
      external_order_id: orderId,
      customer_email: email.toUpperCase(),
      total_cents: totalCents,
      paid,
    },
  }, response);
  return responseBody;
}

test('awards once when admin confirms payment and revokes when confirmation is undone', () => {
  seedUser('member@example.com');

  const firstConfirmation = syncPayment({ orderId: 'BK-20261118-A001', paid: true });
  assert.equal(firstConfirmation.points_earned, 250);
  assert.equal(db.prepare("SELECT points FROM users WHERE email = 'member@example.com'").get().points, 250);

  syncPayment({ orderId: 'BK-20261118-A001', paid: true });
  assert.equal(db.prepare("SELECT points FROM users WHERE email = 'member@example.com'").get().points, 250);

  syncPayment({ orderId: 'BK-20261118-A001', paid: false });
  assert.equal(db.prepare("SELECT points FROM users WHERE email = 'member@example.com'").get().points, 0);
  assert.equal(db.prepare('SELECT is_active FROM external_loyalty_awards WHERE external_order_id = ?').get('BK-20261118-A001').is_active, 0);
});

test('uses the customer tier multiplier at confirmation time', () => {
  seedUser('tiered@example.com', 500);

  const result = syncPayment({ orderId: 'BK-20261118-A002', paid: true, email: 'tiered@example.com' });
  assert.equal(result.points_earned, 300);
  assert.equal(db.prepare("SELECT points FROM users WHERE email = 'tiered@example.com'").get().points, 800);
});

test('does not award points when the customer email has no registered account', () => {
  seedUser('another@example.com');
  const response = {
    json(body) {
      this.body = body;
      return this;
    },
  };
  syncExternalOrderPayment({
    body: {
      external_order_id: 'BK-20261118-A003',
      customer_email: 'unregistered@example.com',
      total_cents: 2500,
      paid: true,
    },
  }, response);
  assert.equal(response.body.reason, 'user_not_found');
});
