import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const GUEST_KEY = "abatrades_guest_cart";

/* ── auth header helper ── */
const authHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ── guest cart helpers (localStorage) ── */
const loadGuest = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY)) || []; }
  catch { return []; }
};
const saveGuest = (items) => localStorage.setItem(GUEST_KEY, JSON.stringify(items));
const clearGuest = () => localStorage.removeItem(GUEST_KEY);

const guestCartShape = (items) => ({
  items,
  total: items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0).toFixed(2),
  item_count: items.reduce((s, i) => s + i.quantity, 0),
});

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]       = useState({ items: [], total: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);
  const prevUser = useRef(null);

  /* ── Fetch server cart (authenticated) ── */
  const fetchCart = useCallback(async () => {
    if (!user) {
      // Restore guest cart from localStorage
      setCart(guestCartShape(loadGuest()));
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE}/api/cart/`, {
        withCredentials: true,
        headers: authHeaders(),
      });
      setCart(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* ── On mount and user change ── */
  useEffect(() => {
    const wasGuest = prevUser.current === null;
    const isNowAuth = user !== null;

    if (wasGuest && isNowAuth) {
      // Just logged in — merge guest items then fetch
      mergeGuestCart().then(fetchCart);
    } else {
      fetchCart();
    }
    prevUser.current = user;
  }, [user]); // eslint-disable-line

  /* ── Merge localStorage guest items into server cart ── */
  const mergeGuestCart = async () => {
    const items = loadGuest();
    if (!items.length) return;
    try {
      for (const item of items) {
        await axios.post(
          `${BASE}/api/cart/add/`,
          { product_id: item.product, quantity: item.quantity },
          { withCredentials: true, headers: authHeaders() }
        );
      }
    } catch {
      // partial merge is fine
    } finally {
      clearGuest();
    }
  };

  /* ── addToCart ──
       productData is required for guest users (the full product object from API).
       For authenticated users it is ignored — the server already has the product. */
  const addToCart = async (productId, quantity = 1, productData = null) => {
    if (!user) {
      // Guest: store in localStorage
      const items = loadGuest();
      const idx = items.findIndex(i => i.product === productId);
      const maxQty = productData?.quantity ?? 99;
      if (idx >= 0) {
        items[idx].quantity = Math.min(items[idx].quantity + quantity, maxQty);
      } else {
        items.push({
          id: `guest_${productId}`,
          product: productId,
          product_name: productData?.name ?? "Product",
          price: productData?.price ?? "0",
          main_image_url: productData?.main_image_url ?? null,
          shop_name: productData?.shop_name ?? null,
          shop_slug: productData?.shop_slug ?? null,
          quantity,
          max_qty: maxQty,
          in_stock: maxQty > 0,
          subtotal: (parseFloat(productData?.price ?? 0) * quantity).toFixed(2),
        });
      }
      saveGuest(items);
      // Recompute subtotals after qty change
      const refreshed = items.map(i => ({
        ...i,
        subtotal: (parseFloat(i.price) * i.quantity).toFixed(2),
      }));
      saveGuest(refreshed);
      setCart(guestCartShape(refreshed));
      return true;
    }

    // Authenticated
    const { data } = await axios.post(
      `${BASE}/api/cart/add/`,
      { product_id: productId, quantity },
      { withCredentials: true, headers: authHeaders() }
    );
    setCart(data);
    return true;
  };

  /* ── updateItem ── */
  const updateItem = async (itemId, quantity) => {
    if (!user) {
      const items = loadGuest().map(i => {
        if (i.id !== itemId) return i;
        const newQty = Math.max(1, Math.min(quantity, i.max_qty));
        return { ...i, quantity: newQty, subtotal: (parseFloat(i.price) * newQty).toFixed(2) };
      });
      saveGuest(items);
      setCart(guestCartShape(items));
      return;
    }
    const { data } = await axios.patch(
      `${BASE}/api/cart/${itemId}/update/`,
      { quantity },
      { withCredentials: true, headers: authHeaders() }
    );
    setCart(data);
  };

  /* ── removeItem ── */
  const removeItem = async (itemId) => {
    if (!user) {
      const items = loadGuest().filter(i => i.id !== itemId);
      saveGuest(items);
      setCart(guestCartShape(items));
      return;
    }
    const { data } = await axios.delete(
      `${BASE}/api/cart/${itemId}/remove/`,
      { withCredentials: true, headers: authHeaders() }
    );
    setCart(data);
  };

  /* ── clearCart ── */
  const clearCart = async () => {
    if (!user) {
      clearGuest();
      setCart(guestCartShape([]));
      return;
    }
    const { data } = await axios.delete(`${BASE}/api/cart/clear/`, {
      withCredentials: true,
      headers: authHeaders(),
    });
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
