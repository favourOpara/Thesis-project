import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  console.log("CartContext - User from Auth:", user);

  const userId = user?.email
    ? user.email.replace(/[^a-zA-Z0-9]/g, "_")
    : "guest"; // ✅ Keep "guest" as default

  console.log("CartContext - Cart Key:", `cart_${userId}`);

  // ✅ Load cart directly from localStorage on first render
  const getInitialCart = () => {
    try {
      const storedCart = localStorage.getItem(`cart_${userId}`);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
      return [];
    }
  };

  const [cartItems, setCartItems] = useState(getInitialCart); // ✅ Initialize directly from localStorage

  useEffect(() => {
    // ✅ Reload the correct cart when userId changes
    try {
      const storedCart = localStorage.getItem(`cart_${userId}`);
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
      console.log(`CartContext - Loaded cart for ${userId}:`, storedCart);
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
      setCartItems([]);
    }
  }, [userId]); // ✅ Runs every time userId changes

  useEffect(() => {
    // ✅ Save cart to localStorage when cartItems change
    try {
      if (userId) {
        console.log("Saving cart for:", userId);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cartItems, userId]);

  useEffect(() => {
    // ✅ Sync cart across tabs/windows
    const handleStorageChange = (event) => {
      if (event.key === `cart_${userId}`) {
        setCartItems(JSON.parse(event.newValue) || []);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userId]);

  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      return existingItem
        ? prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
