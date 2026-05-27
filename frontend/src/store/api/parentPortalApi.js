import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const parentPortalApi = createApi({
  reducerPath: 'parentPortalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ParentDashboard'],
  endpoints: (builder) => ({
    getParentDashboard: builder.query({
      query: () => '/parent-portal/dashboard',
      providesTags: ['ParentDashboard'],
    }),
    getChildren: builder.query({
      query: () => '/parent-portal/children',
      providesTags: ['ParentDashboard'],
    }),
  }),
});

export const {
  useGetParentDashboardQuery,
  useGetChildrenQuery
} = parentPortalApi;
