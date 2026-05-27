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

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Analytics', 'Report', 'Dashboard'],
  endpoints: (builder) => ({
    // ========== Reports ==========
    getReports: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/analytics?${query}`;
      },
      providesTags: ['Report'],
    }),
    
    getReportById: builder.query({
      query: (reportId) => `/analytics/${reportId}`,
      providesTags: (result, error, id) => [{ type: 'Report', id }],
    }),

    generateReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `/analytics/${id}/generate`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Report'],
    }),

    // ========== Generated Reports ==========
    getGeneratedReports: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/analytics/generated/list?${query}`;
      },
      providesTags: ['Report'],
    }),

    // ========== Dashboards ==========
    getDashboards: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/analytics/dashboards/list?${query}`;
      },
      providesTags: ['Dashboard'],
    }),

    getDashboardById: builder.query({
      query: (dashboardId) => `/analytics/dashboards/${dashboardId}`,
      providesTags: (result, error, id) => [{ type: 'Dashboard', id }],
    }),

    // ========== Metrics ==========
    getMetrics: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/analytics/metrics/list?${query}`;
      },
      providesTags: ['Analytics'],
    }),

    // ========== System Overview (Custom Aggregation Endpoint) ==========
    getSystemAnalytics: builder.query({
      query: () => `/analytics/overview`,
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGenerateReportMutation,
  useGetGeneratedReportsQuery,
  useGetDashboardsQuery,
  useGetDashboardByIdQuery,
  useGetMetricsQuery,
  useGetSystemAnalyticsQuery,
} = analyticsApi;
