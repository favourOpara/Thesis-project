import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  console.log("CartContext - User from Auth:", user);

  // Use email (sanitized) as unique identifier for cart, or "guest" if not logged in.
  const userId = user?.email
    ? user.email.replace(/[^a-zA-Z0-9]/g, "_")
    : "guest";

  console.log("CartContext - Cart Key:", `cart_${userId}`);
  const CART_STORAGE_KEY = `cart_${userId}`;

  // Function to load cart from localStorage
  const loadCart = () => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  };

  // Initial state: if user is not logged in, load from localStorage;
  // if logged in, we will fetch from backend.
  const [cartItems, setCartItems] = useState(user?.token ? [] : loadCart());

  // If user is logged in, fetch updated cart from backend.
  const fetchUpdatedCart = async () => {
    if (!user || !user.token) return;
    try {
      const response = await axios.get("inspiring-spontaneity-production.up.railway.app/api/check-cart-items/", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("Fetched updated cart from backend:", response.data);
      setCartItems(response.data);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching updated cart:", error);
    }
  };

  // On mount or when user changes, if logged in, fetch updated cart.
  useEffect(() => {
    if (user?.token) {
      setCartItems([]); 
      fetchUpdatedCart();
    } else {
      setCartItems(loadCart());
    }
  }, [user, userId]);

  // Sync localStorage whenever cartItems change.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems, CART_STORAGE_KEY]);

  // Listen for localStorage changes in other tabs/windows.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === CART_STORAGE_KEY) {
        setCartItems(JSON.parse(event.newValue) || []);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [CART_STORAGE_KEY]);

  // Add product to cart; when adding from ProductCard, we don't update quantity.
  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      // If already in cart, do nothing (quantity updates happen in CartPage)
      return existingItem ? prevCart : [...prevCart, { ...product, quantity: 1 }];
    });
    // After updating local state, if logged in, update from backend.
    if (user?.token) {
      fetchUpdatedCart();
    }
  };

  // Update item quantity (for use in CartPage)
  const updateCartItemQuantity = (productId, change) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
    if (user?.token) {
      fetchUpdatedCart();
    }
  };

  // Remove an item from the cart.
  const removeFromCart = (productId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));
    if (user?.token) {
      fetchUpdatedCart();
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
