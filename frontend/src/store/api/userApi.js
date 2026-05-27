import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => '/users/me',
      providesTags: ['Profile'],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/users/me/password',
        method: 'PUT',
        body: data,
      }),
    }),
    updateNotificationPreferences: builder.mutation({
      query: (data) => ({
        url: '/users/me/notifications',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useUpdateNotificationPreferencesMutation,
} = userApi;
