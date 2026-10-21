import '../config.js';
import bcrypt from 'bcrypt';
import db from './database.js';

const menuItems = [
  { name: 'Whopper', category: 'Burgers', price: 5.49, calories: 660, description: 'Flame-grilled beef, fresh tomatoes, crisp lettuce, creamy mayo', is_featured: 1, rating: 4.8 },
  { name: 'Double Whopper', category: 'Burgers', price: 7.29, calories: 900, description: 'Two flame-grilled patties, all the fixings, unstoppable', is_featured: 1, rating: 4.9 },
  { name: 'Whopper Jr.', category: 'Burgers', price: 3.99, calories: 310, description: 'All the Whopper flavour, junior size', is_featured: 0, rating: 4.6 },
  { name: 'Crispy Chicken Sandwich', category: 'Chicken', price: 5.99, calories: 490, description: 'Crispy hand-breaded fillet, pickles, mayo on a brioche bun', is_featured: 1, rating: 4.7 },
  { name: 'Spicy Crispy Chicken', category: 'Chicken', price: 6.49, calories: 510, description: 'Extra heat, extra crunch — for the brave', is_featured: 0, rating: 4.6 },
  { name: 'Chicken Royal', category: 'Chicken', price: 6.29, calories: 470, description: 'Crispy chicken, rich mayo, shredded lettuce', is_featured: 0, rating: 4.5 },
  { name: 'BK Veggie Burger', category: 'Vegetarian', price: 5.29, calories: 390, description: 'Garden-fresh plant patty with all the classics', is_featured: 0, rating: 4.4 },
  { name: 'Onion Rings', category: 'Sides', price: 2.99, calories: 320, description: 'Golden, crispy, stacked high', is_featured: 0, rating: 4.7 },
  { name: 'Large Fries', category: 'Sides', price: 2.49, calories: 430, description: 'Salted golden perfection', is_featured: 0, rating: 4.8 },
  { name: 'Chocolate Shake', category: 'Drinks', price: 4.29, calories: 580, description: 'Thick, creamy, and non-negotiable', is_featured: 0, rating: 4.6 },
  { name: 'Frozen Coke', category: 'Drinks', price: 1.99, calories: 140, description: 'Icy, refreshing, iconic', is_featured: 0, rating: 4.5 },
  { name: 'Whopper Combo', category: 'Combos', price: 9.49, calories: 1090, description: 'Whopper + Fries + Drink — the classic trio', is_featured: 1, rating: 4.9 },
  { name: 'Chicken Royale Combo', category: 'Combos', price: 9.99, calories: 900, description: 'Chicken Royal + Fries + Drink', is_featured: 0, rating: 4.6 },
  { name: 'Chocolate Brownie', category: 'Desserts', price: 2.49, calories: 310, description: 'Warm, fudgy, dangerously good', is_featured: 0, rating: 4.7 },
];

const deals = [
  { title: 'Double Down Deal', description: 'Grab two Whoppers and two large fries at a killer value while the timer lasts.', offer: '2 Whoppers + 2 Large Fries for $12', tag: '🔥 Flash Sale', expires_hours: 6, is_app_only: 0, promo_code: 'DOUBLE12' },
  { title: 'Loyalty Bonus', description: 'Members stack triple points on every eligible order this weekend.', offer: 'Earn 3x points on all orders this weekend', tag: '👑 Members', expires_hours: 48, is_app_only: 0, promo_code: null },
  { title: 'Free Fries Friday', description: 'Any burger unlocks a free large fries add-on for the day.', offer: 'Free Large Fries with any burger purchase', tag: '🍟 Weekly', expires_hours: 24, is_app_only: 0, promo_code: 'FREEFRIES' },
  { title: 'App Exclusive', description: 'First app order gets an instant 20% discount.', offer: '20% off your first app order', tag: '📱 App Only', expires_hours: 72, is_app_only: 1, promo_code: 'APP20' },
  { title: 'Combo King', description: 'Treat any combo like a crown-value special.', offer: 'Any combo for $7.99 all day', tag: '🍔 Value', expires_hours: 12, is_app_only: 0, promo_code: 'COMBO799' },
];

const stores = [
  { name: 'BK Times Square', address: '1560 Broadway', city: 'New York', postcode: 'NY 10036', lat: 40.758, lng: -73.986, phone: '(212) 555-1001', hours: 'Open · Closes 2AM', is_open_now: 1, features: ['Drive-Thru', 'Delivery'] },
  { name: 'BK Midtown', address: '350 5th Ave', city: 'New York', postcode: 'NY 10118', lat: 40.748, lng: -73.986, phone: '(212) 555-1002', hours: 'Open · Closes 12AM', is_open_now: 1, features: ['Dine-In', 'Delivery'] },
  { name: 'BK Brooklyn', address: '490 Flatbush Ave', city: 'Brooklyn', postcode: 'NY 11225', lat: 40.660, lng: -73.960, phone: '(718) 555-1003', hours: 'Open 24hrs', is_open_now: 1, features: ['Drive-Thru', '24H'] },
  { name: 'BK Queens', address: '82-01 Queens Blvd', city: 'Queens', postcode: 'NY 11373', lat: 40.736, lng: -73.879, phone: '(718) 555-1004', hours: 'Open · Closes 11PM', is_open_now: 1, features: ['Drive-Thru', 'Dine-In'] },
  { name: 'BK Jersey City', address: '30 Journal Sq', city: 'Jersey City', postcode: 'NJ 07306', lat: 40.732, lng: -74.063, phone: '(201) 555-1005', hours: 'Open · Closes 1AM', is_open_now: 1, features: ['Delivery', 'Dine-In'] },
];

function resetTables() {
  db.exec(`
    DELETE FROM redemptions;
    DELETE FROM carts;
    DELETE FROM orders;
    DELETE FROM stores;
    DELETE FROM deals;
    DELETE FROM menu_items;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);
}

function seedMenu() {
  const stmt = db.prepare(`
    INSERT INTO menu_items (name, category, price, description, calories, rating, image_url, is_available, is_featured)
    VALUES (@name, @category, @price, @description, @calories, @rating, @image_url, @is_available, @is_featured)
  `);
  const insertMany = db.transaction((items) => {
    for (const item of items) {
      stmt.run({ ...item, image_url: null, is_available: 1 });
    }
  });
  insertMany(menuItems);
}

function seedDeals() {
  const stmt = db.prepare(`
    INSERT INTO deals (title, description, offer, tag, expires_at, is_app_only, is_active, promo_code)
    VALUES (@title, @description, @offer, @tag, @expires_at, @is_app_only, @is_active, @promo_code)
  `);
  const now = Date.now();
  const insertMany = db.transaction((items) => {
    for (const deal of items) {
      const expires_at = new Date(now + deal.expires_hours * 60 * 60 * 1000).toISOString();
      stmt.run({ ...deal, expires_at, is_active: 1 });
    }
  });
  insertMany(deals);
}

function seedStores() {
  const stmt = db.prepare(`
    INSERT INTO stores (name, address, city, postcode, lat, lng, phone, hours, is_open_now, features)
    VALUES (@name, @address, @city, @postcode, @lat, @lng, @phone, @hours, @is_open_now, @features)
  `);
  const insertMany = db.transaction((items) => {
    for (const store of items) {
      stmt.run({ ...store, features: JSON.stringify(store.features) });
    }
  });
  insertMany(stores);
}

async function seedUsers() {
  const password = await bcrypt.hash('Admin123!', 10);
  const customerPassword = await bcrypt.hash('Customer123!', 10);
  const stmt = db.prepare(`
    INSERT INTO users (first_name, email, password, dob, postcode, points, tier)
    VALUES (@first_name, @email, @password, @dob, @postcode, @points, @tier)
  `);
  stmt.run({
    first_name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@bk.com',
    password,
    dob: '1990-01-01',
    postcode: 'NY 10001',
    points: 1800,
    tier: 'Whopper King',
  });
  stmt.run({
    first_name: 'Jake',
    email: 'jake@example.com',
    password: customerPassword,
    dob: '1995-04-20',
    postcode: 'NY 10001',
    points: 340,
    tier: 'Grillmaster',
  });
}

async function main() {
  resetTables();
  seedMenu();
  seedDeals();
  seedStores();
  await seedUsers();
  console.log('🔥 BK database seeded successfully');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
