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

// Product view history (detailed)
export function addProductToHistory(product) {
  if (!hasCookieConsent() || !product || !product.id) return;
  let history = JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY) || "[]");

  // Remove if already in history to avoid duplicates
  history = history.filter((item) => item.id !== product.id);

  // Add current product at the start
  history.unshift({
    id: product.id,
    name: product.name,
    category: product.category,
    sub_category: product.sub_category,
    main_image_url: product.main_image_url,
    visited_at: new Date().toISOString(),
  });

  // Limit to last 20 viewed
  if (history.length > HISTORY_LIMIT) history = history.slice(0, HISTORY_LIMIT);

  localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(history));
}

export function getProductHistory() {
  if (!hasCookieConsent()) return [];
  return JSON.parse(localStorage.getItem(VIEWED_PRODUCTS_KEY) || "[]");
}
