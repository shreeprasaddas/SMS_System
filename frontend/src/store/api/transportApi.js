import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transportApi = createApi({
  reducerPath: 'transportApi',
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
  tagTypes: ['Vehicle', 'Route', 'Allocation'],
  endpoints: (builder) => ({
    // Vehicles
    getVehicles: builder.query({
      query: (params) => ({
        url: '/transport/vehicles', // Assuming standard REST paths based on standard backend routes
        params,
      }),
      providesTags: ['Vehicle'],
    }),
    
    // Transport Overview (assuming a stats endpoint)
    getTransportStats: builder.query({
      query: () => '/transport/statistics',
      providesTags: ['Vehicle', 'Route'],
    }),
    
    // Routes
    getRoutes: builder.query({
      query: (params) => ({
        url: '/transport/routes',
        params,
      }),
      providesTags: ['Route'],
    }),
    getRouteById: builder.query({
      query: (id) => `/transport/routes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Route', id }],
    }),
    createRoute: builder.mutation({
      query: (data) => ({
        url: '/transport/routes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Route'],
    }),
    updateRoute: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport/routes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Route'],
    }),
    deleteRoute: builder.mutation({
      query: (id) => ({
        url: `/transport/routes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Route'],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetTransportStatsQuery,
  useGetRoutesQuery,
  useGetRouteByIdQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation
} = transportApi;
