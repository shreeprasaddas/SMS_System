import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hostelApi = createApi({
  reducerPath: 'hostelApi',
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
  tagTypes: ['Hostel', 'Room', 'Allocation'],
  endpoints: (builder) => ({
    // Hostels
    getHostels: builder.query({
      query: (params) => ({
        url: '/hostels',
        params,
      }),
      providesTags: ['Hostel'],
    }),
    createHostel: builder.mutation({
      query: (data) => ({
        url: '/hostels',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hostel'],
    }),
    
    // Rooms
    getRooms: builder.query({
      query: (params) => ({
        url: '/hostels/rooms/list',
        params,
      }),
      providesTags: ['Room'],
    }),
    addRoom: builder.mutation({
      query: (data) => ({
        url: '/hostels/rooms/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Room', 'Hostel'],
    }),

    // Allocations
    getAllocations: builder.query({
      query: (params) => ({
        url: '/hostels/allocations/list',
        params,
      }),
      providesTags: ['Allocation'],
    }),
    allocateStudent: builder.mutation({
      query: (data) => ({
        url: '/hostels/allocations/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Allocation', 'Room'],
    }),

    // Dashboard
    getHostelStats: builder.query({
      query: () => '/hostels/dashboard/statistics',
      providesTags: ['Hostel', 'Room', 'Allocation'],
    })
  }),
});

export const {
  useGetHostelsQuery,
  useCreateHostelMutation,
  useGetRoomsQuery,
  useAddRoomMutation,
  useGetAllocationsQuery,
  useAllocateStudentMutation,
  useGetHostelStatsQuery
} = hostelApi;
