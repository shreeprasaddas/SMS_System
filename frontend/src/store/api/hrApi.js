import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hrApi = createApi({
  reducerPath: 'hrApi',
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
  tagTypes: ['Staff', 'Leave', 'Payroll'],
  endpoints: (builder) => ({
    // Staff Endpoints
    getStaff: builder.query({
      query: (params) => ({
        url: '/hr/staff',
        params,
      }),
      providesTags: ['Staff'],
    }),
    getStaffById: builder.query({
      query: (id) => `/hr/staff/${id}`,
      providesTags: (result, error, id) => [{ type: 'Staff', id }],
    }),
    registerStaff: builder.mutation({
      query: (data) => ({
        url: '/hr/staff',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Staff'],
    }),
    updateStaff: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/hr/staff/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Staff'],
    }),
    
    // Leave Endpoints
    getLeaveApplications: builder.query({
      query: (params) => ({
        url: '/leaves/applications',
        params,
      }),
      providesTags: ['Leave'],
    }),
    applyForLeave: builder.mutation({
      query: (data) => ({
        url: '/leaves/applications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Leave'],
    }),
    approveLeave: builder.mutation({
      query: ({ applicationId, ...data }) => ({
        url: `/leaves/applications/${applicationId}/approve`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Leave'],
    }),
    rejectLeave: builder.mutation({
      query: ({ applicationId, ...data }) => ({
        url: `/leaves/applications/${applicationId}/reject`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Leave'],
    }),

    // Payroll Endpoints
    getPayrollRecords: builder.query({
      query: (params) => ({
        url: '/hr/payroll',
        params,
      }),
      providesTags: ['Payroll'],
    }),
    processPayroll: builder.mutation({
      query: (data) => ({
        url: '/hr/payroll',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payroll'],
    }),
    approvePayroll: builder.mutation({
      query: ({ payrollId, ...data }) => ({
        url: `/hr/payroll/${payrollId}/approve`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Payroll'],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useGetStaffByIdQuery,
  useRegisterStaffMutation,
  useUpdateStaffMutation,
  useGetLeaveApplicationsQuery,
  useApplyForLeaveMutation,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useGetPayrollRecordsQuery,
  useProcessPayrollMutation,
  useApprovePayrollMutation,
} = hrApi;
