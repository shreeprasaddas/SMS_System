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

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Payment', 'Payments'],
  endpoints: (builder) => ({
    // POST /payments - Record payment
    recordPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payments', 'Payment'],
    }),

    // GET /payments - List payments
    getPayments: builder.query({
      query: ({ page = 1, limit = 10, status = '', method = '', studentId = '' } = {}) => {
        let url = `/payments?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (method) url += `&method=${method}`;
        if (studentId) url += `&studentId=${studentId}`;
        return url;
      },
      providesTags: ['Payments'],
    }),

    // GET /payments/:id - Get payment by ID
    getPaymentById: builder.query({
      query: (paymentId) => `/payments/${paymentId}`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),

    // PATCH /payments/:id/status - Update payment status
    updatePaymentStatus: builder.mutation({
      query: ({ paymentId, ...data }) => ({
        url: `/payments/${paymentId}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Payments'],
    }),

    // PATCH /payments/:id/approve - Approve payment
    approvePayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Payments'],
    }),

    // PATCH /payments/:id/reject - Reject payment
    rejectPayment: builder.mutation({
      query: ({ paymentId, ...data }) => ({
        url: `/payments/${paymentId}/reject`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Payments'],
    }),

    // POST /payments/:id/refund - Initiate refund
    initiateRefund: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/refund`,
        method: 'POST',
      }),
      invalidatesTags: ['Payments'],
    }),

    // GET /payments/report
    getPaymentReport: builder.query({
      query: (params = {}) => ({
        url: '/payments/report',
        params,
      }),
      providesTags: ['Payments'],
    }),

    // GET /payments/analytics
    getPaymentAnalytics: builder.query({
      query: () => '/payments/analytics',
      providesTags: ['Payments'],
    }),

    // GET /payments/pending-approvals
    getPendingApprovals: builder.query({
      query: () => '/payments/pending-approvals',
      providesTags: ['Payments'],
    }),
  }),
});

export const {
  useRecordPaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentStatusMutation,
  useApprovePaymentMutation,
  useRejectPaymentMutation,
  useInitiateRefundMutation,
  useGetPaymentReportQuery,
  useGetPaymentAnalyticsQuery,
  useGetPendingApprovalsQuery,
} = paymentApi;
