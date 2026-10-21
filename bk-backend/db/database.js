import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { resolveBackendPath } from '../config.js';

const absoluteDbPath = resolveBackendPath(process.env.DB_PATH, './data/bk.db');
fs.mkdirSync(path.dirname(absoluteDbPath), { recursive: true });

const db = new Database(absoluteDbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    dob        TEXT,
    postcode   TEXT,
    points     INTEGER NOT NULL DEFAULT 0,
    tier       TEXT    NOT NULL DEFAULT 'Grillmaster',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    category     TEXT    NOT NULL,
    price        REAL    NOT NULL,
    description  TEXT,
    calories     INTEGER,
    rating       REAL    DEFAULT 4.5,
    image_url    TEXT,
    is_available INTEGER NOT NULL DEFAULT 1,
    is_featured  INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS deals (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    description  TEXT    NOT NULL,
    offer        TEXT    NOT NULL,
    tag          TEXT,
    expires_at   TEXT    NOT NULL,
    is_app_only  INTEGER NOT NULL DEFAULT 0,
    is_active    INTEGER NOT NULL DEFAULT 1,
    promo_code   TEXT
  );

  CREATE TABLE IF NOT EXISTS stores (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    address     TEXT    NOT NULL,
    city        TEXT    NOT NULL,
    postcode    TEXT,
    lat         REAL,
    lng         REAL,
    phone       TEXT,
    hours       TEXT    NOT NULL,
    is_open_now INTEGER NOT NULL DEFAULT 1,
    features    TEXT    NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS orders (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER REFERENCES users(id),
    guest_email   TEXT,
    items         TEXT    NOT NULL,
    subtotal      REAL    NOT NULL,
    total         REAL    NOT NULL,
    status        TEXT    NOT NULL DEFAULT 'pending',
    order_type    TEXT    NOT NULL DEFAULT 'pickup',
    store_id      INTEGER REFERENCES stores(id),
    promo_code    TEXT,
    discount      REAL    DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS carts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL UNIQUE REFERENCES users(id),
    items      TEXT    NOT NULL DEFAULT '[]',
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS redemptions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    reward      TEXT    NOT NULL,
    points_used INTEGER NOT NULL,
    redeemed_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
