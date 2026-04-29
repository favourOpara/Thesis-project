// /src/utils/localHistory.js

const LOCAL_PRODUCT_KEY = "recent_product_ids";
const LOCAL_CATEGORY_KEY = "recent_category_ids";
const VIEWED_PRODUCTS_KEY = "viewed_products";
const HISTORY_LIMIT = 20;

// Helper: Check for cookie consent
function hasCookieConsent() {
  return localStorage.getItem("cookie_consent_accepted") === "true";
}

// Generic history for products/categories
export function addToRecentHistory(type, id) {
  if (!hasCookieConsent()) return;
  let key = type === "product" ? LOCAL_PRODUCT_KEY : LOCAL_CATEGORY_KEY;
  let items = JSON.parse(localStorage.getItem(key) || "[]");
  items = items.filter(x => x !== id);
  items.unshift(id);
  if (items.length > HISTORY_LIMIT) items = items.slice(0, HISTORY_LIMIT);
  localStorage.setItem(key, JSON.stringify(items));
}

export function getRecentHistory(type) {
  if (!hasCookieConsent()) return [];
  let key = type === "product" ? LOCAL_PRODUCT_KEY : LOCAL_CATEGORY_KEY;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// Product view history (detailed, with frequency tracking)
export function addProductToHistory(product) {
  if (!hasCookieConsent() || !product || !product.id) return;
  let history = JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY) || "[]");

  const existing = history.find((item) => item.id === product.id);
  if (existing) {
    // Increment visit count and update timestamp
    existing.visit_count = (existing.visit_count || 1) + 1;
    existing.visited_at = new Date().toISOString();
    // Move to front
    history = [existing, ...history.filter((item) => item.id !== product.id)];
  } else {
    history.unshift({
      id: product.id,
      name: product.name,
      category: product.category,
      sub_category: product.sub_category,
      main_image_url: product.main_image_url,
      visited_at: new Date().toISOString(),
      visit_count: 1,
    });
  }

  // Limit to last 20 viewed
  if (history.length > HISTORY_LIMIT) history = history.slice(0, HISTORY_LIMIT);

  localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(history));
}

export function getProductHistory() {
  if (!hasCookieConsent()) return [];
  return JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY) || "[]");
}

// Returns categories sorted by total visit frequency
export function getTopVisitedCategories(limit = 5) {
  const history = getProductHistory();
  const freq = {};
  history.forEach(({ category, sub_category, visit_count = 1 }) => {
    if (category) freq[category] = (freq[category] || 0) + visit_count;
    if (sub_category) freq[sub_category] = (freq[sub_category] || 0) + visit_count;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([cat]) => cat.toLowerCase());
}

// Returns IDs of products already seen (to exclude from recommendations)
export function getViewedProductIds() {
  const history = getProductHistory();
  return new Set(history.map(p => p.id));
}
