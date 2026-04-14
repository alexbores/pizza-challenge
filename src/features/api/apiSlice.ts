import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), 
  endpoints: (builder) => ({
    getMenu: builder.query<any, void>({
      query: () => 'data/pizzas.json', 
    }),
  }),
});


export const { useGetMenuQuery } = apiSlice;
