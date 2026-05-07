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

export const feeApi = createApi({
  reducerPath: 'feeApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Fees', 'Fee', 'Payments'],
  endpoints: (builder) => ({
    getFees: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '', classId = '' } = {}) => {
        let url = `/fees?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (status) url += `&status=${status}`;
        if (classId) url += `&classId=${classId}`;
        return url;
      },
      providesTags: ['Fees'],
    }),

    getFeeById: builder.query({
      query: (feeId) => `/fees/${feeId}`,
      providesTags: (result, error, feeId) => [{ type: 'Fee', id: feeId }],
    }),

    createFee: builder.mutation({
      query: (feeData) => ({
        url: '/fees',
        method: 'POST',
        body: feeData,
      }),
      invalidatesTags: ['Fees'],
    }),

    updateFee: builder.mutation({
      query: ({ feeId, ...updates }) => ({
        url: `/fees/${feeId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { feeId }) => [
        { type: 'Fee', id: feeId },
        'Fees',
      ],
    }),

    patchFee: builder.mutation({
      query: ({ feeId, ...updates }) => ({
        url: `/fees/${feeId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { feeId }) => [
        { type: 'Fee', id: feeId },
        'Fees',
      ],
    }),

    deleteFee: builder.mutation({
      query: (feeId) => ({
        url: `/fees/${feeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fees'],
    }),

    recordPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/fees/payment/record',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Fees', 'Payments'],
    }),

    getFeeReport: builder.query({
      query: ({ startDate = '', endDate = '', classId = '', status = '' } = {}) => {
        let url = '/fees/report';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (classId) params.push(`classId=${classId}`);
        if (status) params.push(`status=${status}`);
        if (params.length > 0) url += '?' + params.join('&');
        return url;
      },
      providesTags: ['Fees'],
    }),

    getStudentFees: builder.query({
      query: (studentId) => `/fees/student/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'Fee', id: studentId }],
    }),

    getFeeStats: builder.query({
      query: () => '/fees/stats',
      providesTags: ['Fees'],
    }),
  }),
});

export const {
  useGetFeesQuery,
  useGetFeeByIdQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  usePatchFeeMutation,
  useDeleteFeeMutation,
  useRecordPaymentMutation,
  useGetFeeReportQuery,
  useGetStudentFeesQuery,
  useGetFeeStatsQuery,
} = feeApi;
