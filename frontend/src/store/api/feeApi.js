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
  tagTypes: ['Fees', 'Fee', 'FeeStructure', 'Payments'],
  endpoints: (builder) => ({
    // ========== Fee Structures ==========

    // GET /fees/structures
    getFeeStructures: builder.query({
      query: ({ page = 1, limit = 10, status = '' } = {}) => {
        let url = `/fees/structures?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['FeeStructure'],
    }),

    // POST /fees/structures
    createFeeStructure: builder.mutation({
      query: (data) => ({
        url: '/fees/structures',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FeeStructure'],
    }),

    // PATCH /fees/structures/:id/approve
    approveFeeStructure: builder.mutation({
      query: (feeStructureId) => ({
        url: `/fees/structures/${feeStructureId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['FeeStructure'],
    }),

    // ========== Student Fees ==========

    // GET /fees/students
    getStudentFees: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '', classId = '', studentId = '' } = {}) => {
        let url = `/fees/students?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (status) url += `&status=${status}`;
        if (classId) url += `&classId=${classId}`;
        if (studentId) url += `&studentId=${studentId}`;
        return url;
      },
      providesTags: ['Fees'],
    }),

    // GET /fees/students/:studentFeeId
    getStudentFeeById: builder.query({
      query: (studentFeeId) => `/fees/students/${studentFeeId}`,
      providesTags: (result, error, id) => [{ type: 'Fee', id }],
    }),

    // POST /fees/allocate
    allocateFeesToStudents: builder.mutation({
      query: (data) => ({
        url: '/fees/allocate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Fees'],
    }),

    // POST /fees/students/:id/concession
    applyConcession: builder.mutation({
      query: ({ studentFeeId, ...data }) => ({
        url: `/fees/students/${studentFeeId}/concession`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Fees'],
    }),

    // POST /fees/students/:id/exempt
    exemptFromFees: builder.mutation({
      query: ({ studentFeeId, ...data }) => ({
        url: `/fees/students/${studentFeeId}/exempt`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Fees'],
    }),

    // POST /fees/students/:id/reminder
    sendFeeReminder: builder.mutation({
      query: (studentFeeId) => ({
        url: `/fees/students/${studentFeeId}/reminder`,
        method: 'POST',
      }),
      invalidatesTags: ['Fees'],
    }),

    // ========== Fee Reports ==========

    // GET /fees/report
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

    // ========== Legacy compat endpoints ==========
    // These map old endpoint names to new ones for backward compat

    getFees: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, search = '', status = '', classId = '' } = params;
        let url = `/fees/students?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (status) url += `&status=${status}`;
        if (classId) url += `&classId=${classId}`;
        return url;
      },
      providesTags: ['Fees'],
    }),

    getFeeById: builder.query({
      query: (feeId) => `/fees/students/${feeId}`,
      providesTags: (result, error, feeId) => [{ type: 'Fee', id: feeId }],
    }),
  }),
});

export const {
  useGetFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useApproveFeeStructureMutation,
  useGetStudentFeesQuery,
  useGetStudentFeeByIdQuery,
  useAllocateFeesToStudentsMutation,
  useApplyConcessionMutation,
  useExemptFromFeesMutation,
  useSendFeeReminderMutation,
  useGetFeeReportQuery,
  useGetFeesQuery,
  useGetFeeByIdQuery,
} = feeApi;
