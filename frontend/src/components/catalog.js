import { escapeHtml, formatCurrency, formatTime, getVisualForItem, normalizeCategoryKey, titleCase } from '../utils/format.js';

export function createCatalogComponents({ menuGrid, dealsGrid, storeList, storeSearchInput, getState, observeAnimated, startSingleCountdown }) {
  const i18n = window.BK_I18N;

  function renderMenu() {
    const { menuItems, activeMenuCategory } = getState();
    const filtered = activeMenuCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => normalizeCategoryKey(item.category) === activeMenuCategory);

    menuGrid.innerHTML = filtered.map((item) => {
      const visual = getVisualForItem(item);
      const localized = i18n.localizeMenuItem(item);
      return `
        <article class="menu-card" data-category="${escapeHtml(normalizeCategoryKey(item.category))}">
          <div class="menu-media" style="background:${visual.color}" aria-hidden="true">${visual.emoji}</div>
          <div class="menu-body">
            <span class="badge">${escapeHtml(localized.category || titleCase(String(item.category).trim()))}</span>
            <h3 class="menu-name">${escapeHtml(item.name)}</h3>
            <p class="menu-desc">${escapeHtml(localized.description || 'Flame-grilled and made fresh.')}</p>
            <div class="menu-meta">
              <span class="price">${formatCurrency(item.price)}</span>
              <span class="rating">⭐ ${Number(item.rating || 4.6).toFixed(1)}</span>
              <button class="add-btn" data-add-menu-id="${item.id}">${escapeHtml(i18n.t('cart.add'))}</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    observeAnimated();
  }

  function renderDeals() {
    const { deals, clearCountdowns } = getState();
    clearCountdowns();
    dealsGrid.innerHTML = deals.map((deal) => {
      const localized = i18n.localizeDeal(deal);
      return `
      <article class="deal-card animate-on-scroll">
        <div class="deal-tag">${escapeHtml(localized.tag || i18n.t('deals.limited'))}</div>
        <div class="eyebrow">${escapeHtml(deal.is_app_only ? i18n.t('deals.app') : i18n.t('deals.limited'))}</div>
        <h3>${escapeHtml(localized.title || deal.title || deal.name || 'Hot Deal')}</h3>
        <p>${escapeHtml(localized.offer || deal.offer || deal.description || 'Fresh offer available now.')}</p>
        <div class="deal-meta">
          <div class="timer" id="deal-timer-${deal.id}">${formatTime(deal.seconds_remaining)}</div>
          ${deal.promo_code ? `<div class="deal-code">Code: ${escapeHtml(deal.promo_code)}</div>` : ''}
          <button type="button" class="btn btn--primary deal-apply-btn" data-promo="${escapeHtml(deal.promo_code || '')}">
            ${escapeHtml(i18n.t(deal.promo_code ? 'deals.apply' : 'deals.see'))}
          </button>
        </div>
      </article>
    `;
    }).join('');

    deals.forEach((deal) => {
      startSingleCountdown(document.getElementById(`deal-timer-${deal.id}`), Number(deal.seconds_remaining || 0));
    });

    observeAnimated();
  }

  function renderStores() {
    const { stores, activeStoreFilter, selectedStoreId } = getState();
    const query = storeSearchInput.value.trim().toLowerCase();
    const filtered = stores.filter((store) => {
      const searchBlob = `${store.name} ${store.address} ${store.city} ${store.postcode}`.toLowerCase();
      const matchesSearch = !query || searchBlob.includes(query);
      const matchesFilter = activeStoreFilter === 'all'
        ? true
        : activeStoreFilter === 'Open Now'
          ? Boolean(store.is_open_now)
          : Array.isArray(store.features) && store.features.includes(activeStoreFilter);
      return matchesSearch && matchesFilter;
    });

    if (!filtered.length) {
      storeList.innerHTML = `
        <div class="store-card">
          <h3>${escapeHtml(i18n.t('stores.none'))}</h3>
          <p>${escapeHtml(i18n.t('stores.tryAgain'))}</p>
        </div>
      `;
      return;
    }

    storeList.innerHTML = filtered.map((store) => {
      const isSelected = Number(store.id) === Number(selectedStoreId);
      const address = [store.address, store.city, store.postcode].filter(Boolean).join(', ');
      const hours = i18n.localizeHours(store.hours || (store.is_open_now ? 'Open now' : 'Closed'));
      return `
        <article class="store-card">
          <div class="store-top">
            <div>
              <h3>${escapeHtml(store.name)}</h3>
              <p>${escapeHtml(address)}</p>
            </div>
            <div class="distance">${store.distance_miles != null ? `${Number(store.distance_miles).toFixed(1)} mi` : escapeHtml(i18n.t('stores.nearby'))}</div>
          </div>
          <div class="hours">${escapeHtml(hours)}</div>
          <div class="feature-tags">
            ${(store.features || []).map((feature) => `<span class="feature-tag">${escapeHtml(i18n.localizeFeature(feature))}</span>`).join('')}
          </div>
          <div class="store-action-row">
            <button type="button" class="btn btn--primary select-store-btn" data-store-id="${store.id}">
              ${escapeHtml(i18n.t(isSelected ? 'stores.selected' : 'stores.order'))}
            </button>
            ${isSelected ? `<div class="selected-store-pill">${escapeHtml(i18n.t('feature.pickupStore'))}</div>` : ''}
          </div>
        </article>
      `;
    }).join('');

    observeAnimated();
  }

  return { renderMenu, renderDeals, renderStores };
}
