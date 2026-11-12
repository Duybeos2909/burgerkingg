export function parseJSON(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function titleCase(text = '') {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

export function normalizeCategoryKey(category = '') {
  return String(category).trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export function formatTime(seconds) {
  const remaining = Math.max(0, Number(seconds || 0));
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const secs = Math.floor(remaining % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getVisualForItem(item) {
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
