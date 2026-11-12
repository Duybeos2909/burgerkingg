import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const testDirectory = mkdtempSync(path.join(os.tmpdir(), 'bk-demo-catalog-'));
process.env.DB_PATH = path.join(testDirectory, 'test.sqlite');

const { ensureDemoCatalog } = await import('../db/seed.js');
const { default: db } = await import('../db/database.js');

after(() => {
  db.close();
  rmSync(testDirectory, { recursive: true, force: true });
});

function getCatalogCounts() {
  return {
    menu: db.prepare('SELECT COUNT(*) AS count FROM menu_items').get().count,
    deals: db.prepare('SELECT COUNT(*) AS count FROM deals').get().count,
    stores: db.prepare('SELECT COUNT(*) AS count FROM stores').get().count,
  };
}

test('seeds missing catalog tables without duplicating or overwriting existing data', () => {
  assert.deepEqual(getCatalogCounts(), { menu: 0, deals: 0, stores: 0 });

  ensureDemoCatalog();
  assert.deepEqual(getCatalogCounts(), { menu: 14, deals: 5, stores: 5 });

  db.prepare("UPDATE menu_items SET price = 6.99 WHERE name = 'Whopper'").run();
  db.prepare('DELETE FROM deals').run();
  ensureDemoCatalog();

  assert.deepEqual(getCatalogCounts(), { menu: 14, deals: 5, stores: 5 });
  assert.equal(db.prepare("SELECT price FROM menu_items WHERE name = 'Whopper'").get().price, 6.99);
});
