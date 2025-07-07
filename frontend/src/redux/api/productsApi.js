// src/redux/api/productsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "inspiring-spontaneity-production.up.railway.app/api/" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (searchQuery = "") => {
        const searchParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
        return `products/${searchParam}`;
      },
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
