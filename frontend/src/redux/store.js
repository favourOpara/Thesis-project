import { configureStore } from '@reduxjs/toolkit';
import { cartApi } from './api/cartApi';
import { authApi } from './api/authApi'; // Import authApi

export const store = configureStore({
  reducer: {
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer, // Add authApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartApi.middleware, authApi.middleware), // Add authApi middleware
});
