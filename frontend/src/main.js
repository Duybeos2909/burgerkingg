import './styles.css';
import './styles/forms.css';
import './styles/responsive.css';
import '../../i18n.js';
import { createCatalogComponents } from './components/catalog.js';
import { initializeNavigation } from './components/navigation.js';
import { FALLBACK_DEALS, FALLBACK_MENU, FALLBACK_STORES, STORAGE_KEYS } from './data/fallbackData.js';
import { createAuthForms } from './forms/authForms.js';
import { API_LABEL, createApiClient } from './services/api.js';
import { escapeHtml, formatCurrency, formatTime, parseJSON } from './utils/format.js';

    let menuItems = [];
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

    const apiFetch = createApiClient(() => authToken);
    const i18n = window.BK_I18N;

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
        const localizedDeal = i18n.localizeDeal(topDeal);
        const prefix = i18n.getLanguage() === 'vi' ? '🔥 ƯU ĐÃI CÓ HẠN: ' : '🔥 LIMITED TIME: ';
        banner.textContent = `${prefix}${localizedDeal.offer}${topDeal.promo_code ? ` — Code ${topDeal.promo_code}` : ''}`;
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
            <p style="margin:0;">${i18n.t('cart.empty')}</p>
          </div>
        `;
        cartTotalElement.textContent = '$0.00';
        return;
      }

      cartItemsElement.innerHTML = cart.map((item) => `
        <div class="cart-item">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${formatCurrency(item.price)} ${i18n.t('cart.each')}</small>
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
        selectedStoreLabel.textContent = `${i18n.t('feature.pickupStore')}: ${store.name}`;
        localStorage.setItem(STORAGE_KEYS.selectedStoreId, String(store.id));
      } else {
        selectedStoreLabel.textContent = i18n.t('feature.selectedStore');
      }
    }

    function updateCartMeta() {
      if (currentUser) {
        cartModeLabel.textContent = `${i18n.getLanguage() === 'vi' ? 'Đã đăng nhập với tên' : 'Signed in as'} ${currentUser.first_name}`;
        cartPointsLabel.textContent = `${currentUser.tier || 'Grillmaster'} · ${currentUser.points || 0} pts`;
      } else {
        cartModeLabel.textContent = i18n.t('feature.guestCheckout');
        cartPointsLabel.textContent = i18n.t('feature.signInPoints');
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
        authBtn.textContent = i18n.t('auth.logout');
        userBadgeText.textContent = `${currentUser.first_name} · ${currentUser.tier || 'Member'}`;
      } else {
        authBtn.textContent = i18n.t('nav.signIn');
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

    const { renderMenu, renderDeals, renderStores } = createCatalogComponents({
      menuGrid,
      dealsGrid,
      storeList,
      storeSearchInput,
      getState: () => ({
        menuItems,
        deals,
        stores,
        activeMenuCategory,
        activeStoreFilter,
        selectedStoreId,
        clearCountdowns
      }),
      observeAnimated,
      startSingleCountdown
    });

    const authForms = createAuthForms({
      apiFetch,
      saveAuthSession,
      loginForm,
      rewardsForm,
      loginError,
      formError,
      authModal,
      cartSidebar,
      loginEmail: document.getElementById('login-email'),
      loginPassword: document.getElementById('login-password'),
      onAuthenticated: async (status) => {
        await Promise.all([loadCartFromServer(), loadRewardsProfile()]);
        updateCartUI();
        setApiBanner(`Connected to ${API_LABEL} · ${status}`, true);
      }
    });
    authForms.bind();

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
        authForms.openAuthModal();
      }
    });

    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    initializeNavigation({ hamburger, mobileNav });

    document.addEventListener('bk-language-change', () => {
      renderMenu();
      renderDeals();
      renderStores();
      updateSelectedStoreUI();
      updateCartMeta();
      updateCartUI();
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
