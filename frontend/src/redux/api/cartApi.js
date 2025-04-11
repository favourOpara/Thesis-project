import { createApi } from "@reduxjs/toolkit/query/react";

// Get cart items from localStorage
const getCartFromLocalStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

// Store cart items in localStorage
const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: () => ({ data: getCartFromLocalStorage() }), // Return local storage directly (no API call)
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // Get cart items (from localStorage)
    getCartItems: builder.query({
      query: () => getCartFromLocalStorage(),
      providesTags: ["Cart"],
    }),
    // Add to cart (store in localStorage)
    addToCart: builder.mutation({
      query: (product) => {
        const existingCart = getCartFromLocalStorage();
        // Check if product already exists in the cart
        const existingItemIndex = existingCart.findIndex((item) => item.id === product.id);
        
        if (existingItemIndex !== -1) {
          // If item exists, update quantity
          existingCart[existingItemIndex].quantity += 1;
        } else {
          // If item doesn't exist, add it to the cart with quantity 1
          existingCart.push({ ...product, quantity: 1 });
        }
        
        saveCartToLocalStorage(existingCart); // Save updated cart to localStorage
        return { data: existingCart }; // Return updated cart
      },
      invalidatesTags: ["Cart"],
    }),
    // Update cart item quantity (store in localStorage)
    updateCartItemQuantity: builder.mutation({
      query: ({ productId, quantity }) => {
        const existingCart = getCartFromLocalStorage();
        const updatedCart = existingCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        saveCartToLocalStorage(updatedCart); // Save updated cart to localStorage
        return { data: updatedCart }; // Return updated cart
      },
      invalidatesTags: ["Cart"],
    }),
    // Remove item from cart (store in localStorage)
    removeFromCart: builder.mutation({
      query: (productId) => {
        const existingCart = getCartFromLocalStorage();
        const updatedCart = existingCart.filter((item) => item.id !== productId);
        saveCartToLocalStorage(updatedCart); // Save updated cart to localStorage
        return { data: updatedCart }; // Return updated cart
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveFromCartMutation,
} = cartApi;
