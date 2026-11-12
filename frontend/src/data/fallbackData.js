export const FALLBACK_MENU = [
  { id: 1, name: 'Whopper', category: 'Burgers', price: 5.49, rating: 4.8, description: 'Flame-grilled beef, fresh tomatoes, crisp lettuce, creamy mayo', is_featured: true },
  { id: 2, name: 'Double Whopper', category: 'Burgers', price: 7.29, rating: 4.9, description: 'Two flame-grilled patties, all the fixings, unstoppable', is_featured: true },
  { id: 4, name: 'Crispy Chicken Sandwich', category: 'Chicken', price: 5.99, rating: 4.7, description: 'Crispy hand-breaded fillet, pickles, mayo on a brioche bun', is_featured: true },
  { id: 5, name: 'Spicy Crispy Chicken', category: 'Chicken', price: 6.49, rating: 4.6, description: 'Extra heat, extra crunch — for the brave', is_featured: false },
  { id: 7, name: 'BK Veggie Burger', category: 'Vegetarian', price: 5.29, rating: 4.4, description: 'Garden-fresh plant patty with all the classics', is_featured: false },
  { id: 8, name: 'Onion Rings', category: 'Sides', price: 2.99, rating: 4.7, description: 'Golden, crispy, stacked high', is_featured: false },
  { id: 9, name: 'Large Fries', category: 'Sides', price: 2.49, rating: 4.8, description: 'Salted golden perfection', is_featured: false },
  { id: 10, name: 'Chocolate Shake', category: 'Drinks', price: 4.29, rating: 4.6, description: 'Thick, creamy, and non-negotiable', is_featured: false },
  { id: 11, name: 'Frozen Coke', category: 'Drinks', price: 1.99, rating: 4.5, description: 'Icy, refreshing, iconic', is_featured: false },
  { id: 12, name: 'Whopper Combo', category: 'Combos', price: 9.49, rating: 4.9, description: 'Whopper + Fries + Drink — the classic trio', is_featured: true },
  { id: 14, name: 'Chocolate Brownie', category: 'Desserts', price: 2.49, rating: 4.7, description: 'Warm, fudgy, dangerously good', is_featured: false }
];

export const FALLBACK_DEALS = [
  { id: 1, title: 'Double Down Deal', offer: '2 Whoppers + 2 Large Fries for $12', tag: '🔥 Flash Sale', promo_code: 'DOUBLE12', seconds_remaining: 6 * 3600, is_app_only: false },
  { id: 2, title: 'Loyalty Bonus', offer: 'Earn 3x points on all orders this weekend', tag: '👑 Members', promo_code: null, seconds_remaining: 48 * 3600, is_app_only: false },
  { id: 3, title: 'Free Fries Friday', offer: 'Free Large Fries with any burger purchase', tag: '🍟 Weekly', promo_code: 'FREEFRIES', seconds_remaining: 24 * 3600, is_app_only: false },
  { id: 4, title: 'App Exclusive', offer: '20% off your first app order', tag: '📱 App Only', promo_code: 'APP20', seconds_remaining: 72 * 3600, is_app_only: true },
  { id: 5, title: 'Combo King', offer: 'Any combo for $7.99 all day', tag: '🍔 Value', promo_code: 'COMBO799', seconds_remaining: 12 * 3600, is_app_only: false }
];

export const FALLBACK_STORES = [
  { id: 1, name: 'BK Times Square', address: '1560 Broadway', city: 'New York', postcode: 'NY 10036', phone: '(212) 555-1001', hours: 'Open · Closes 2AM', is_open_now: true, features: ['Drive-Thru', 'Delivery'], distance_miles: 0.3 },
  { id: 2, name: 'BK Midtown', address: '350 5th Ave', city: 'New York', postcode: 'NY 10118', phone: '(212) 555-1002', hours: 'Open · Closes 12AM', is_open_now: true, features: ['Dine-In', 'Delivery'], distance_miles: 0.8 },
  { id: 3, name: 'BK Brooklyn', address: '490 Flatbush Ave', city: 'Brooklyn', postcode: 'NY 11225', phone: '(718) 555-1003', hours: 'Open 24hrs', is_open_now: true, features: ['Drive-Thru', '24H'], distance_miles: 2.1 },
  { id: 4, name: 'BK Queens', address: '82-01 Queens Blvd', city: 'Queens', postcode: 'NY 11373', phone: '(718) 555-1004', hours: 'Open · Closes 11PM', is_open_now: true, features: ['Drive-Thru', 'Dine-In'], distance_miles: 3.4 },
  { id: 5, name: 'BK Jersey City', address: '30 Journal Sq', city: 'Jersey City', postcode: 'NJ 07306', phone: '(201) 555-1005', hours: 'Open · Closes 1AM', is_open_now: true, features: ['Delivery', 'Dine-In'], distance_miles: 4.2 }
];

export const STORAGE_KEYS = {
  token: 'bk_token',
  user: 'bk_user',
  guestCart: 'bk_guest_cart',
  selectedStoreId: 'bk_selected_store_id',
  promoCode: 'bk_promo_code'
};
