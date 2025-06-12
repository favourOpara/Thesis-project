import { configureStore } from '@reduxjs/toolkit';
import { cartApi } from './api/cartApi';
import { authApi } from './api/authApi'; // Import authApi
import { productsApi } from './api/productsApi';

export const store = configureStore({
  reducer: {
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartApi.middleware, authApi.middleware, productsApi.middleware), // Add authApi middleware
});
