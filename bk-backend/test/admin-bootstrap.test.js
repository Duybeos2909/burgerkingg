import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import bcrypt from 'bcrypt';

const testDirectory = mkdtempSync(path.join(os.tmpdir(), 'bk-admin-bootstrap-'));
process.env.DB_PATH = path.join(testDirectory, 'test.sqlite');
process.env.ADMIN_EMAIL = 'bduy.nina@gmail.com';
process.env.JWT_SECRET = 'test-jwt-secret';

const { ensureAdminAccount } = await import('../db/ensure-admin-account.js');
const { default: db } = await import('../db/database.js');
const { register } = await import('../controllers/auth.controller.js');

after(() => {
  db.close();
  rmSync(testDirectory, { recursive: true, force: true });
});

test('does nothing when no bootstrap password is configured', async () => {
  delete process.env.ADMIN_BOOTSTRAP_PASSWORD;

  assert.equal(await ensureAdminAccount(), false);
  assert.equal(db.prepare('SELECT id FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL), undefined);
});

test('creates or resets the configured admin password from the environment', async () => {
  process.env.ADMIN_BOOTSTRAP_PASSWORD = 'temporary-test-password';
  assert.equal(await ensureAdminAccount(), true);

  let user = db.prepare('SELECT password FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL);
  assert.ok(await bcrypt.compare('temporary-test-password', user.password));

  process.env.ADMIN_BOOTSTRAP_PASSWORD = 'another-test-password';
  await ensureAdminAccount();
  user = db.prepare('SELECT password FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL);
  assert.ok(await bcrypt.compare('another-test-password', user.password));
});

test('prevents public registration of the configured admin email', async () => {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await register({
    body: {
      first_name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: 'temporary-test-password',
    },
  }, response);

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error, 'Admin account must be provisioned by the server');
});

test('rejects a bootstrap password shorter than the registration minimum', async () => {
  process.env.ADMIN_BOOTSTRAP_PASSWORD = 'short';

  await assert.rejects(ensureAdminAccount(), /at least 8 characters/);
});
