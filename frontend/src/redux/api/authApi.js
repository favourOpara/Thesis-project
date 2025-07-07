import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL for your Django API
const baseUrl = 'inspiring-spontaneity-production.up.railway.app/api/';

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
