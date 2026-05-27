import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loginSuccess, logout } from '../slices/authSlice.js';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { token, refreshToken } = refreshResult.data.data;
      api.dispatch(
        loginSuccess({
          user: api.getState().auth.user,
          token,
          refreshToken,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const communicationApi = createApi({
  reducerPath: 'communicationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Announcements', 'Messages', 'Notifications'],
  endpoints: (builder) => ({
    // ========== Announcements ==========

    // POST /communication/announcements
    createAnnouncement: builder.mutation({
      query: (data) => ({
        url: '/communication/announcements',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Announcements'],
    }),

    // GET /communication/announcements
    getAnnouncements: builder.query({
      query: ({ page = 1, limit = 10, status = '' } = {}) => {
        let url = `/communication/announcements?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Announcements'],
    }),

    // PUT /communication/announcements/:id/publish
    publishAnnouncement: builder.mutation({
      query: (announcementId) => ({
        url: `/communication/announcements/${announcementId}/publish`,
        method: 'PUT',
      }),
      invalidatesTags: ['Announcements'],
    }),

    // DELETE /communication/announcements/:id
    deleteAnnouncement: builder.mutation({
      query: (announcementId) => ({
        url: `/communication/announcements/${announcementId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcements'],
    }),

    // ========== Messages ==========

    // POST /communication/messages
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/communication/messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Messages'],
    }),

    // GET /communication/messages
    getMessages: builder.query({
      query: ({ page = 1, limit = 20, type = '' } = {}) => {
        let url = `/communication/messages?page=${page}&limit=${limit}`;
        if (type) url += `&type=${type}`;
        return url;
      },
      providesTags: ['Messages'],
    }),

    // PUT /communication/messages/:id/read
    markMessageAsRead: builder.mutation({
      query: (messageId) => ({
        url: `/communication/messages/${messageId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Messages'],
    }),

    // DELETE /communication/messages/:id
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/communication/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages'],
    }),

    // ========== Notifications ==========

    // GET /communication/notifications
    getNotifications: builder.query({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/communication/notifications?page=${page}&limit=${limit}`,
      providesTags: ['Notifications'],
    }),

    // PUT /communication/notifications/:id/read
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/communication/notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    // ========== Statistics ==========

    // GET /communication/statistics
    getCommunicationStats: builder.query({
      query: () => '/communication/statistics',
    }),
  }),
});

export const {
  useCreateAnnouncementMutation,
  useGetAnnouncementsQuery,
  usePublishAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useSendMessageMutation,
  useGetMessagesQuery,
  useMarkMessageAsReadMutation,
  useDeleteMessageMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useGetCommunicationStatsQuery,
} = communicationApi;
