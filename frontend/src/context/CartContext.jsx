import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  console.log("CartContext - User from Auth:", user);

  const userId = user?.email
    ? user.email.replace(/[^a-zA-Z0-9]/g, "_")
    : "guest"; // Assign a unique key for guests & logged-in users

  console.log("CartContext - Cart Key:", `cart_${userId}`);

  // Function to load cart from localStorage
  const loadCart = () => {
    try {
      const storedCart = localStorage.getItem(`cart_${userId}`);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
      return [];
    }
  };

  const [cartItems, setCartItems] = useState(loadCart); // Load from localStorage on first render

  useEffect(() => {
    // Load correct cart whenever userId changes
    setCartItems(loadCart());
  }, [userId]);

  useEffect(() => {
    // Save cart to localStorage whenever cartItems change
    try {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cartItems, userId]);

  useEffect(() => {
    // Sync cart across multiple tabs
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
        ? prevCart // Prevent quantity from increasing when adding from ProductCard.jsx
        : [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (productId, change) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(item.quantity + change, 1) } // Prevents quantity < 1
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
