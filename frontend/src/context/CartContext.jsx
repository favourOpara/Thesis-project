import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]       = useState({ items: [], total: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0, item_count: 0 }); return; }
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE}/api/cart/`, { withCredentials: true });
      setCart(data);
    } catch {
      // silently fail — user is browsing
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return false;
    const { data } = await axios.post(
      `${BASE}/api/cart/add/`,
      { product_id: productId, quantity },
      { withCredentials: true }
    );
    setCart(data);
    return true;
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await axios.patch(
      `${BASE}/api/cart/${itemId}/update/`,
      { quantity },
      { withCredentials: true }
    );
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await axios.delete(
      `${BASE}/api/cart/${itemId}/remove/`,
      { withCredentials: true }
    );
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await axios.delete(`${BASE}/api/cart/clear/`, { withCredentials: true });
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
