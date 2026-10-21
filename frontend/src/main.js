import './styles.css';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace(/\/$/, '');
    const API_LABEL = API_BASE;
    const FALLBACK_MENU = [
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

    const FALLBACK_DEALS = [
      { id: 1, title: 'Double Down Deal', offer: '2 Whoppers + 2 Large Fries for $12', tag: '🔥 Flash Sale', promo_code: 'DOUBLE12', seconds_remaining: 6 * 3600, is_app_only: false },
      { id: 2, title: 'Loyalty Bonus', offer: 'Earn 3x points on all orders this weekend', tag: '👑 Members', promo_code: null, seconds_remaining: 48 * 3600, is_app_only: false },
      { id: 3, title: 'Free Fries Friday', offer: 'Free Large Fries with any burger purchase', tag: '🍟 Weekly', promo_code: 'FREEFRIES', seconds_remaining: 24 * 3600, is_app_only: false },
      { id: 4, title: 'App Exclusive', offer: '20% off your first app order', tag: '📱 App Only', promo_code: 'APP20', seconds_remaining: 72 * 3600, is_app_only: true },
      { id: 5, title: 'Combo King', offer: 'Any combo for $7.99 all day', tag: '🍔 Value', promo_code: 'COMBO799', seconds_remaining: 12 * 3600, is_app_only: false }
    ];

    const FALLBACK_STORES = [
      { id: 1, name: 'BK Times Square', address: '1560 Broadway', city: 'New York', postcode: 'NY 10036', phone: '(212) 555-1001', hours: 'Open · Closes 2AM', is_open_now: true, features: ['Drive-Thru', 'Delivery'], distance_miles: 0.3 },
      { id: 2, name: 'BK Midtown', address: '350 5th Ave', city: 'New York', postcode: 'NY 10118', phone: '(212) 555-1002', hours: 'Open · Closes 12AM', is_open_now: true, features: ['Dine-In', 'Delivery'], distance_miles: 0.8 },
      { id: 3, name: 'BK Brooklyn', address: '490 Flatbush Ave', city: 'Brooklyn', postcode: 'NY 11225', phone: '(718) 555-1003', hours: 'Open 24hrs', is_open_now: true, features: ['Drive-Thru', '24H'], distance_miles: 2.1 },
      { id: 4, name: 'BK Queens', address: '82-01 Queens Blvd', city: 'Queens', postcode: 'NY 11373', phone: '(718) 555-1004', hours: 'Open · Closes 11PM', is_open_now: true, features: ['Drive-Thru', 'Dine-In'], distance_miles: 3.4 },
      { id: 5, name: 'BK Jersey City', address: '30 Journal Sq', city: 'Jersey City', postcode: 'NJ 07306', phone: '(201) 555-1005', hours: 'Open · Closes 1AM', is_open_now: true, features: ['Delivery', 'Dine-In'], distance_miles: 4.2 }
    ];

    const STORAGE_KEYS = {
      token: 'bk_token',
      user: 'bk_user',
      guestCart: 'bk_guest_cart',
      selectedStoreId: 'bk_selected_store_id',
      promoCode: 'bk_promo_code'
    };

    let menuItems = [];
    let filteredMenuItems = [];
    let deals = [];
    let stores = [];
    let cart = [];
    let activeMenuCategory = 'all';
    let activeStoreFilter = 'all';
    let selectedStoreId = Number(localStorage.getItem(STORAGE_KEYS.selectedStoreId)) || null;
    let activePromoCode = localStorage.getItem(STORAGE_KEYS.promoCode) || '';
    let authToken = localStorage.getItem(STORAGE_KEYS.token) || '';
    let currentUser = parseJSON(localStorage.getItem(STORAGE_KEYS.user), null);
    let countdownIntervals = [];
    let apiHealthy = false;

    const menuGrid = document.getElementById('menu-grid');
    const dealsGrid = document.getElementById('deals-grid');
    const storeList = document.getElementById('store-list');
    const heroTimer = document.getElementById('hero-timer');
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartSidebar = document.getElementById('cart-sidebar');
    const backdrop = document.getElementById('backdrop');
    const promoCodeInput = document.getElementById('promo-code-input');
    const selectedStoreLabel = document.getElementById('selected-store-label');
    const cartModeLabel = document.getElementById('cart-mode-label');
    const cartPointsLabel = document.getElementById('cart-points-label');
    const rewardsForm = document.getElementById('rewards-form');
    const rewardsSuccess = document.getElementById('rewards-success');
    const rewardsProfile = document.getElementById('rewards-profile');
    const formError = document.getElementById('form-error');
    const apiBanner = document.getElementById('api-banner');
    const authBtn = document.getElementById('auth-btn');
    const userBadge = document.getElementById('user-badge');
    const userBadgeText = document.getElementById('user-badge-text');
    const storeSearchInput = document.getElementById('store-search');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const authModal = document.getElementById('auth-modal');
    const checkoutBtn = document.getElementById('checkout-btn');

    function parseJSON(value, fallback) {
      try {
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    }

    function escapeHtml(text = '') {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function titleCase(text = '') {
      return String(text).charAt(0).toUpperCase() + String(text).slice(1);
    }

    function normalizeCategoryKey(category = '') {
      return String(category).trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
    }

    function formatCurrency(value) {
      return `$${Number(value || 0).toFixed(2)}`;
    }

    function formatTime(seconds) {
      const remaining = Math.max(0, Number(seconds || 0));
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = Math.floor(remaining % 60);
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    function getVisualForItem(item) {
      const category = normalizeCategoryKey(item.category);
      const lowerName = (item.name || '').toLowerCase();

      if (lowerName.includes('veggie') || category === 'vegetarian') {
        return { emoji: '🥬', color: 'linear-gradient(135deg,#4F8A10,#9ED15D)' };
      }
      if (category === 'burgers') {
        return item.is_featured
          ? { emoji: '🍔', color: 'linear-gradient(135deg,#C8102E,#F25C54)' }
          : { emoji: '🍔', color: 'linear-gradient(135deg,#7A0E1F,#C8102E)' };
      }
      if (category === 'chicken') {
        return lowerName.includes('spicy')
          ? { emoji: '🌶️', color: 'linear-gradient(135deg,#D64D00,#F25C54)' }
          : { emoji: '🍗', color: 'linear-gradient(135deg,#F2A623,#F5C45C)' };
      }
      if (category === 'sides') {
        return lowerName.includes('onion')
          ? { emoji: '🧅', color: 'linear-gradient(135deg,#AD7C3A,#E0B36A)' }
          : { emoji: '🍟', color: 'linear-gradient(135deg,#F2A623,#FFD86B)' };
      }
      if (category === 'drinks') {
        return lowerName.includes('shake')
          ? { emoji: '🥤', color: 'linear-gradient(135deg,#5B2C23,#9A5E48)' }
          : { emoji: '🥶', color: 'linear-gradient(135deg,#2563EB,#60A5FA)' };
      }
      if (category === 'desserts') {
        return { emoji: '🍫', color: 'linear-gradient(135deg,#3E2723,#795548)' };
      }
      if (category === 'combos') {
        return { emoji: '👑', color: 'linear-gradient(135deg,#C8102E,#F2A623)' };
      }

      return { emoji: '🍔', color: 'linear-gradient(135deg,#C8102E,#F2A623)' };
    }

    async function apiFetch(path, options = {}) {
      const headers = { ...(options.headers || {}) };
      if (!headers['Content-Type'] && options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.error || data.message || 'Request failed';
        const error = new Error(message);
        error.status = response.status;
        error.payload = data;
        throw error;
      }

      return data;
    }

    function setApiBanner(message, healthy = false) {
      apiHealthy = healthy;
      apiBanner.innerHTML = `<strong>API:</strong> ${escapeHtml(message)}`;
      apiBanner.style.borderColor = healthy ? 'rgba(51,178,73,.2)' : 'rgba(255,255,255,.1)';
    }

    async function bootstrap() {
      promoCodeInput.value = activePromoCode;

      try {
        const [menuRes, dealsRes, storesRes] = await Promise.all([
          apiFetch('/menu'),
          apiFetch('/deals'),
          apiFetch('/stores')
        ]);

        menuItems = Array.isArray(menuRes.items) ? menuRes.items : FALLBACK_MENU;
        deals = Array.isArray(dealsRes.deals) ? dealsRes.deals : FALLBACK_DEALS;
        stores = Array.isArray(storesRes.stores) ? storesRes.stores : FALLBACK_STORES;
        setApiBanner(`Connected to ${API_LABEL}`, true);
      } catch (error) {
        console.warn('API bootstrap failed. Using fallback data.', error);
        menuItems = FALLBACK_MENU;
        deals = FALLBACK_DEALS;
        stores = FALLBACK_STORES;
        setApiBanner('Backend not reachable. Showing fallback demo data.', false);
      }

      if (!selectedStoreId && stores.length) {
        selectedStoreId = stores[0].id;
      }

      renderMenu();
      renderDeals();
      renderStores();
      updateSelectedStoreUI();
      updateCartMeta();
      setHeroCountdownFromDeals();

      if (authToken) {
        try {
          await Promise.all([loadMe(), loadCartFromServer(), loadRewardsProfile()]);
        } catch (error) {
          console.warn('Session restore failed:', error);
          logout(false);
        }
      } else {
        restoreGuestCart();
      }

      updateAuthUI();
      updateCartUI();
      observeAnimated();
    }

    function setHeroCountdownFromDeals() {
      const topDeal = deals.find((deal) => Number(deal.seconds_remaining) > 0) || deals[0];
      if (!topDeal) return;
      const banner = document.querySelector('.hero-banner span:first-child');
      if (banner) {
        banner.textContent = `🔥 LIMITED TIME: ${topDeal.offer}${topDeal.promo_code ? ` — Code ${topDeal.promo_code}` : ''}`;
      }
      startSingleCountdown(heroTimer, Number(topDeal.seconds_remaining || 0));
    }

    function clearCountdowns() {
      countdownIntervals.forEach((interval) => clearInterval(interval));
      countdownIntervals = [];
    }

    function startSingleCountdown(element, secondsRemaining) {
      if (!element) return;
      let remaining = Math.max(0, Number(secondsRemaining || 0));
      element.textContent = formatTime(remaining);
      const interval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          element.textContent = 'EXPIRED';
          clearInterval(interval);
          return;
        }
        element.textContent = formatTime(remaining);
      }, 1000);
      countdownIntervals.push(interval);
    }

    function renderMenu() {
      const filtered = activeMenuCategory === 'all'
        ? menuItems
        : menuItems.filter((item) => normalizeCategoryKey(item.category) === activeMenuCategory);

      filteredMenuItems = filtered;

      menuGrid.innerHTML = filtered.map((item) => {
        const visual = getVisualForItem(item);
        return `
          <article class="menu-card" data-category="${escapeHtml(normalizeCategoryKey(item.category))}">
            <div class="menu-media" style="background:${visual.color}" aria-hidden="true">${visual.emoji}</div>
            <div class="menu-body">
              <span class="badge">${escapeHtml(titleCase(String(item.category).trim()))}</span>
              <h3 class="menu-name">${escapeHtml(item.name)}</h3>
              <p class="menu-desc">${escapeHtml(item.description || 'Flame-grilled and made fresh.')}</p>
              <div class="menu-meta">
                <span class="price">${formatCurrency(item.price)}</span>
                <span class="rating">⭐ ${Number(item.rating || 4.6).toFixed(1)}</span>
                <button class="add-btn" data-add-menu-id="${item.id}">Add to bag +</button>
              </div>
            </div>
          </article>
        `;
      }).join('');

      observeAnimated();
    }

    function renderDeals() {
      clearCountdowns();
      dealsGrid.innerHTML = deals.map((deal) => `
        <article class="deal-card animate-on-scroll">
          <div class="deal-tag">${escapeHtml(deal.tag || 'Limited Time')}</div>
          <div class="eyebrow">${deal.is_app_only ? 'App Exclusive' : 'Limited Time'}</div>
          <h3>${escapeHtml(deal.title || deal.name || 'Hot Deal')}</h3>
          <p>${escapeHtml(deal.offer || deal.description || 'Fresh offer available now.')}</p>
          <div class="deal-meta">
            <div class="timer" id="deal-timer-${deal.id}">${formatTime(deal.seconds_remaining)}</div>
            ${deal.promo_code ? `<div class="deal-code">Code: ${escapeHtml(deal.promo_code)}</div>` : ''}
            <button type="button" class="btn btn--primary deal-apply-btn" data-promo="${escapeHtml(deal.promo_code || '')}">
              ${deal.promo_code ? 'Apply Code →' : 'See Deal →'}
            </button>
          </div>
        </article>
      `).join('');

      deals.forEach((deal) => {
        const el = document.getElementById(`deal-timer-${deal.id}`);
        startSingleCountdown(el, Number(deal.seconds_remaining || 0));
      });

      observeAnimated();
    }

    function renderStores() {
      const query = storeSearchInput.value.trim().toLowerCase();
      let filtered = stores.filter((store) => {
        const searchBlob = `${store.name} ${store.address} ${store.city} ${store.postcode}`.toLowerCase();
        const matchesSearch = !query || searchBlob.includes(query);
        const matchesFilter =
          activeStoreFilter === 'all'
            ? true
            : activeStoreFilter === 'Open Now'
              ? Boolean(store.is_open_now)
              : Array.isArray(store.features) && store.features.includes(activeStoreFilter);
        return matchesSearch && matchesFilter;
      });

      if (!filtered.length) {
        storeList.innerHTML = `
          <div class="store-card">
            <h3>No stores found</h3>
            <p>Try another city, postcode, or filter.</p>
          </div>
        `;
        return;
      }

      storeList.innerHTML = filtered.map((store) => {
        const isSelected = Number(store.id) === Number(selectedStoreId);
        const address = [store.address, store.city, store.postcode].filter(Boolean).join(', ');
        return `
          <article class="store-card">
            <div class="store-top">
              <div>
                <h3>${escapeHtml(store.name)}</h3>
                <p>${escapeHtml(address)}</p>
              </div>
              <div class="distance">${store.distance_miles != null ? `${Number(store.distance_miles).toFixed(1)} mi` : 'Nearby'}</div>
            </div>
            <div class="hours">${escapeHtml(store.hours || (store.is_open_now ? 'Open now' : 'Closed'))}</div>
            <div class="feature-tags">
              ${(store.features || []).map((feature) => `<span class="feature-tag">${escapeHtml(feature)}</span>`).join('')}
            </div>
            <div class="store-action-row">
              <button type="button" class="btn btn--primary select-store-btn" data-store-id="${store.id}">
                ${isSelected ? 'Selected for Pickup ✓' : 'Use for Pickup →'}
              </button>
              ${isSelected ? `<div class="selected-store-pill">📍 Current pickup store</div>` : ''}
            </div>
          </article>
        `;
      }).join('');

      observeAnimated();
    }

    function restoreGuestCart() {
      cart = parseJSON(localStorage.getItem(STORAGE_KEYS.guestCart), []) || [];
    }

    async function loadCartFromServer() {
      const data = await apiFetch('/cart');
      cart = Array.isArray(data.items) ? data.items : [];
      return cart;
    }

    function saveGuestCart() {
      localStorage.setItem(STORAGE_KEYS.guestCart, JSON.stringify(cart));
    }

    function getCartCount() {
      return cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    }

    function updateCartUI() {
      cartCountElement.textContent = String(getCartCount());

      if (!cart.length) {
        cartItemsElement.innerHTML = `
          <div class="cart-empty" id="cart-empty">
            <p style="font-size:2rem;margin:0 0 10px;">🍔</p>
            <p style="margin:0;">Your bag is empty. Add something flame-grilled.</p>
          </div>
        `;
        cartTotalElement.textContent = '$0.00';
        return;
      }

      cartItemsElement.innerHTML = cart.map((item) => `
        <div class="cart-item">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${formatCurrency(item.price)} each</small>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:800;">${formatCurrency(Number(item.price) * Number(item.qty))}</div>
            <div class="cart-qty">
              <button class="qty-btn" data-change-qty="${item.menu_item_id}" data-delta="-1" aria-label="Decrease quantity">−</button>
              <span>x${item.qty}</span>
              <button class="qty-btn" data-change-qty="${item.menu_item_id}" data-delta="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      `).join('');

      const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
      cartTotalElement.textContent = formatCurrency(total);
    }

    async function addToCart(menuItemId) {
      const item = menuItems.find((entry) => Number(entry.id) === Number(menuItemId));
      if (!item) return;

      try {
        if (authToken) {
          const data = await apiFetch('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ menu_item_id: Number(menuItemId), qty: 1 })
          });
          cart = data.items || [];
        } else {
          const existing = cart.find((entry) => Number(entry.menu_item_id) === Number(menuItemId));
          if (existing) {
            existing.qty += 1;
          } else {
            cart.push({
              menu_item_id: Number(item.id),
              name: item.name,
              price: Number(item.price),
              qty: 1
            });
          }
          saveGuestCart();
        }

        updateCartUI();
        openCart();
      } catch (error) {
        alert(error.message || 'Could not add item to cart.');
      }
    }

    async function changeQty(menuItemId, delta) {
      try {
        if (authToken) {
          const existing = cart.find((entry) => Number(entry.menu_item_id) === Number(menuItemId));
          if (!existing) return;
          const nextQty = Number(existing.qty) + Number(delta);
          const data = await apiFetch('/cart/update', {
            method: 'PATCH',
            body: JSON.stringify({ menu_item_id: Number(menuItemId), qty: Math.max(0, nextQty) })
          });
          cart = data.items || [];
        } else {
          const item = cart.find((entry) => Number(entry.menu_item_id) === Number(menuItemId));
          if (!item) return;
          item.qty += Number(delta);
          if (item.qty <= 0) {
            cart = cart.filter((entry) => Number(entry.menu_item_id) !== Number(menuItemId));
          }
          saveGuestCart();
        }

        updateCartUI();
      } catch (error) {
        alert(error.message || 'Could not update cart.');
      }
    }

    function openCart() {
      cartSidebar.classList.add('open');
      cartSidebar.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeCart() {
      cartSidebar.classList.remove('open');
      cartSidebar.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('show');
      document.body.style.overflow = '';
    }

    function updateSelectedStoreUI() {
      const store = stores.find((entry) => Number(entry.id) === Number(selectedStoreId));
      if (store) {
        selectedStoreLabel.textContent = `📍 Pickup store: ${store.name}`;
        localStorage.setItem(STORAGE_KEYS.selectedStoreId, String(store.id));
      } else {
        selectedStoreLabel.textContent = '📍 Pickup store: choose a store below';
      }
    }

    function updateCartMeta() {
      if (currentUser) {
        cartModeLabel.textContent = `Signed in as ${currentUser.first_name}`;
        cartPointsLabel.textContent = `${currentUser.tier || 'Grillmaster'} · ${currentUser.points || 0} pts`;
      } else {
        cartModeLabel.textContent = 'Guest checkout';
        cartPointsLabel.textContent = 'Sign in to earn points';
      }
    }

    function setPromoCode(code) {
      activePromoCode = String(code || '').trim().toUpperCase();
      promoCodeInput.value = activePromoCode;
      if (activePromoCode) {
        localStorage.setItem(STORAGE_KEYS.promoCode, activePromoCode);
      } else {
        localStorage.removeItem(STORAGE_KEYS.promoCode);
      }
    }

    function updateAuthUI() {
      const isLoggedIn = Boolean(authToken && currentUser);
      userBadge.classList.toggle('hidden', !isLoggedIn);
      if (isLoggedIn) {
        authBtn.textContent = 'LOG OUT';
        userBadgeText.textContent = `${currentUser.first_name} · ${currentUser.tier || 'Member'}`;
      } else {
        authBtn.textContent = 'SIGN IN';
      }
      updateCartMeta();
    }

    function saveAuthSession(token, user) {
      authToken = token;
      currentUser = user;
      localStorage.setItem(STORAGE_KEYS.token, token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      updateAuthUI();
    }

    async function loadMe() {
      const data = await apiFetch('/auth/me');
      currentUser = data.user;
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(currentUser));
      updateAuthUI();
      return data.user;
    }

    async function loadRewardsProfile() {
      if (!authToken) return;
      const [profile, catalogue] = await Promise.all([
        apiFetch('/rewards/profile'),
        apiFetch('/rewards/catalogue')
      ]);

      rewardsProfile.style.display = 'block';
      rewardsForm.style.display = 'none';
      rewardsSuccess.style.display = 'block';
      rewardsSuccess.textContent = `🎉 Signed in as ${profile.user.first_name}. You are currently ${profile.user.tier}.`;

      rewardsProfile.innerHTML = `
        <div class="profile-top">
          <div>
            <div class="mini-muted">BK Rewards Member</div>
            <strong>${escapeHtml(profile.user.first_name)} · ${escapeHtml(profile.user.tier)}</strong>
            <div class="profile-points">${profile.user.points} pts</div>
          </div>
          <div class="selected-store-pill">Next tier: ${escapeHtml(profile.user.next_tier || 'Top tier reached')}</div>
        </div>
        <div class="mini-muted">
          ${profile.user.next_tier ? `${profile.user.points_to_next_tier} pts to ${profile.user.next_tier}.` : 'You are already at the highest tier.'}
        </div>
        <div class="reward-list">
          ${(catalogue.rewards || []).slice(0, 4).map((reward) => `
            <div class="reward-item">
              <div>
                <strong>${escapeHtml(reward.name)}</strong>
                <div class="mini-muted">${escapeHtml(reward.description)}</div>
              </div>
              <div>${reward.points_cost} pts</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function logout(callApi = true) {
      if (callApi && authToken) {
        apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
      }

      authToken = '';
      currentUser = null;
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
      rewardsProfile.style.display = 'none';
      rewardsSuccess.style.display = 'none';
      rewardsForm.style.display = 'block';
      updateAuthUI();
      restoreGuestCart();
      updateCartUI();
      setApiBanner(apiHealthy ? `Connected to ${API_LABEL}` : 'Backend not reachable. Showing fallback demo data.', apiHealthy);
    }

    async function handleRegister(event) {
      event.preventDefault();
      formError.style.display = 'none';

      const payload = {
        first_name: document.getElementById('firstName').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim(),
        dob: document.getElementById('dob').value,
        postcode: document.getElementById('postcode').value.trim(),
        marketing_emails: document.getElementById('offers').checked
      };

      if (!payload.first_name || !payload.email || !payload.password || !payload.dob || !payload.postcode) {
        return showError(formError, 'Please complete all required fields.');
      }

      if (payload.password.length < 8) {
        return showError(formError, 'Password must be at least 8 characters long.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        return showError(formError, 'Please enter a valid email address.');
      }

      try {
        const data = await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        saveAuthSession(data.token, data.user);
        rewardsForm.reset();
        await Promise.all([loadCartFromServer(), loadRewardsProfile()]);
        updateCartUI();
        setApiBanner(`Connected to ${API_LABEL} · account created`, true);
      } catch (error) {
        showError(formError, error.message || 'Could not create account.');
      }
    }

    function showError(element, message) {
      element.style.display = 'block';
      element.textContent = message;
    }

    function openAuthModal() {
      loginError.style.display = 'none';
      authModal.style.display = 'flex';
      authModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => document.getElementById('login-email').focus(), 20);
    }

    function closeAuthModal() {
      authModal.style.display = 'none';
      authModal.setAttribute('aria-hidden', 'true');
      if (!cartSidebar.classList.contains('open')) document.body.style.overflow = '';
    }

    async function handleLogin(event) {
      event.preventDefault();
      loginError.style.display = 'none';

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      if (!email || !password) {
        return showError(loginError, 'Please enter your email and password.');
      }

      try {
        const data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });

        saveAuthSession(data.token, data.user);
        closeAuthModal();
        await Promise.all([loadCartFromServer(), loadRewardsProfile()]);
        updateCartUI();
        setApiBanner(`Connected to ${API_LABEL} · signed in`, true);
      } catch (error) {
        showError(loginError, error.message || 'Could not sign in.');
      }
    }

    async function handleCheckout() {
      if (!cart.length) {
        alert('Your bag is empty.');
        return;
      }

      const storeId = selectedStoreId || (stores[0] ? stores[0].id : null);
      if (!storeId) {
        alert('Please select a pickup store first.');
        return;
      }

      const promoCode = promoCodeInput.value.trim().toUpperCase();
      setPromoCode(promoCode);

      let guestEmail = '';
      if (!authToken) {
        guestEmail = window.prompt('Enter your email for guest checkout:');
        if (!guestEmail) return;
      }

      const payload = {
        items: cart.map((item) => ({
          menu_item_id: Number(item.menu_item_id),
          qty: Number(item.qty)
        })),
        order_type: 'pickup',
        store_id: Number(storeId),
        promo_code: promoCode || '',
        guest_email: authToken ? '' : guestEmail.trim()
      };

      try {
        const data = await apiFetch('/orders', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        if (authToken) {
          await Promise.all([loadCartFromServer(), loadMe(), loadRewardsProfile()]);
        } else {
          cart = [];
          saveGuestCart();
        }

        updateCartUI();
        closeCart();

        const order = data.order || {};
        alert(`Order placed! #${order.id}\nTotal: ${formatCurrency(order.total)}\nETA: ${order.estimated_ready || '15–20 mins'}`);
      } catch (error) {
        alert(error.message || 'Could not place order.');
      }
    }

    async function handleUseLocation() {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported in this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await apiFetch(`/stores/nearby?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}&radius_miles=25`);
          if (Array.isArray(data.stores) && data.stores.length) {
            stores = data.stores;
            selectedStoreId = stores[0].id;
            renderStores();
            updateSelectedStoreUI();
            alert(`Found ${data.count} nearby stores. Closest: ${stores[0].name}`);
          } else {
            alert('No nearby stores found for your location.');
          }
        } catch (error) {
          alert(error.message || 'Could not find nearby stores.');
        }
      }, () => {
        alert('Location access was denied.');
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    function observeAnimated() {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    }

    document.querySelectorAll('.filter-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const active = document.querySelector('#menu-filters .filter-pill.active');
        if (active) active.classList.remove('active');
        pill.classList.add('active');
        activeMenuCategory = pill.dataset.category;
        renderMenu();
      });
    });

    document.querySelectorAll('.store-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const active = document.querySelector('#store-filters .store-pill.active');
        if (active) active.classList.remove('active');
        pill.classList.add('active');
        activeStoreFilter = pill.dataset.storefilter;
        renderStores();
      });
    });

    menuGrid.addEventListener('click', (event) => {
      const button = event.target.closest('[data-add-menu-id]');
      if (!button) return;
      addToCart(Number(button.dataset.addMenuId));
    });

    cartItemsElement.addEventListener('click', (event) => {
      const button = event.target.closest('[data-change-qty]');
      if (!button) return;
      changeQty(Number(button.dataset.changeQty), Number(button.dataset.delta));
    });

    dealsGrid.addEventListener('click', (event) => {
      const button = event.target.closest('.deal-apply-btn');
      if (!button) return;
      const code = button.dataset.promo || '';
      if (code) {
        setPromoCode(code);
        openCart();
        alert(`Promo code ${code} applied to your cart.`);
      } else {
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
      }
    });

    storeList.addEventListener('click', (event) => {
      const button = event.target.closest('.select-store-btn');
      if (!button) return;
      selectedStoreId = Number(button.dataset.storeId);
      updateSelectedStoreUI();
      renderStores();
      document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    });

    promoCodeInput.addEventListener('input', () => {
      setPromoCode(promoCodeInput.value);
    });

    storeSearchInput.addEventListener('input', renderStores);
    document.getElementById('use-location').addEventListener('click', handleUseLocation);

    document.getElementById('cart-toggle').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    backdrop.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', handleCheckout);

    authBtn.addEventListener('click', () => {
      if (authToken) {
        logout();
      } else {
        openAuthModal();
      }
    });

    document.getElementById('open-login').addEventListener('click', openAuthModal);
    document.getElementById('close-auth-modal').addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (event) => {
      if (event.target === authModal) closeAuthModal();
    });
    loginForm.addEventListener('submit', handleLogin);
    rewardsForm.addEventListener('submit', handleRegister);

    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const expanded = mobileNav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', String(expanded));
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    const exitModal = document.getElementById('exit-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const grabDealBtn = document.getElementById('grab-deal');

    document.addEventListener('mouseleave', (event) => {
      if (event.clientY < 0 && !sessionStorage.getItem('exitShown')) {
        exitModal.style.display = 'flex';
        exitModal.setAttribute('aria-hidden', 'false');
        sessionStorage.setItem('exitShown', '1');
        document.body.style.overflow = 'hidden';
      }
    });

    function closeModal() {
      exitModal.style.display = 'none';
      exitModal.setAttribute('aria-hidden', 'true');
      if (!cartSidebar.classList.contains('open') && authModal.style.display !== 'flex') document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    grabDealBtn.addEventListener('click', () => {
      setPromoCode('APP20');
      openCart();
      closeModal();
    });
    exitModal.addEventListener('click', (event) => {
      if (event.target === exitModal) closeModal();
    });

    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    const flameField = document.getElementById('flame-field');
    for (let i = 0; i < 12; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'flame-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = `${Math.random() * 22}%`;
      particle.style.animationDelay = `${Math.random() * 4}s`;
      particle.style.animationDuration = `${3 + Math.random() * 3}s`;
      particle.style.width = `${4 + Math.random() * 6}px`;
      particle.style.height = particle.style.width;
      flameField.appendChild(particle);
    }

    bootstrap();
