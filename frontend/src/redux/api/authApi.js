import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL for your Django API - use environment variable or default to production
const baseUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/`;

// Create the API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'signin/',
        method: 'POST',
        body: credentials, // { username, password }
      }),
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: 'refresh/', // Ensure you have a refresh endpoint in your backend
        method: 'POST',
        body: { refresh: refreshToken },
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
