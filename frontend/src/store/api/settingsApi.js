import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
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
  tagTypes: ['Settings', 'SchoolProfile'],
  endpoints: (builder) => ({
    getSystemSettings: builder.query({
      query: () => '/system/settings',
      providesTags: ['Settings'],
    }),
    updateSystemSettings: builder.mutation({
      query: (data) => ({
        url: '/system/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    getSchoolProfile: builder.query({
      query: () => '/system/school-profile',
      providesTags: ['SchoolProfile'],
    }),
    updateSchoolProfile: builder.mutation({
      query: (data) => ({
        url: '/system/school-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SchoolProfile'],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetSchoolProfileQuery,
  useUpdateSchoolProfileMutation,
} = settingsApi;
