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

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Attendance Reports
    getAttendanceReport: builder.query({
      query: (filters) => ({
        url: '/reports/attendance',
        method: 'GET',
        params: filters,
      }),
    }),

    getAttendanceTrendReport: builder.query({
      query: (filters) => ({
        url: '/reports/attendance/trend',
        method: 'GET',
        params: filters,
      }),
    }),

    // Performance Reports
    getPerformanceReport: builder.query({
      query: (filters) => ({
        url: '/reports/performance',
        method: 'GET',
        params: filters,
      }),
    }),

    getStudentPerformanceReport: builder.query({
      query: (studentId) => ({
        url: `/reports/performance/student/${studentId}`,
        method: 'GET',
      }),
    }),

    getClassPerformanceReport: builder.query({
      query: (classId) => ({
        url: `/reports/performance/class/${classId}`,
        method: 'GET',
      }),
    }),

    // Finance Reports
    getFinanceReport: builder.query({
      query: (filters) => ({
        url: '/reports/finance',
        method: 'GET',
        params: filters,
      }),
    }),

    getFeeCollectionReport: builder.query({
      query: (filters) => ({
        url: '/reports/finance/fees',
        method: 'GET',
        params: filters,
      }),
    }),

    getExpenseReport: builder.query({
      query: (filters) => ({
        url: '/reports/finance/expenses',
        method: 'GET',
        params: filters,
      }),
    }),

    getFinancialSummary: builder.query({
      query: () => ({
        url: '/reports/finance/summary',
        method: 'GET',
      }),
    }),

    // Comprehensive Reports
    getSchoolReport: builder.query({
      query: (filters) => ({
        url: '/reports/school',
        method: 'GET',
        params: filters,
      }),
    }),

    // Export Reports
    exportReportPDF: builder.query({
      query: ({ reportType, filters }) => ({
        url: `/reports/export/pdf/${reportType}`,
        method: 'GET',
        params: filters,
      }),
    }),
  }),
});

export const {
  useGetAttendanceReportQuery,
  useGetAttendanceTrendReportQuery,
  useGetPerformanceReportQuery,
  useGetStudentPerformanceReportQuery,
  useGetClassPerformanceReportQuery,
  useGetFinanceReportQuery,
  useGetFeeCollectionReportQuery,
  useGetExpenseReportQuery,
  useGetFinancialSummaryQuery,
  useGetSchoolReportQuery,
  useExportReportPDFQuery,
} = reportApi;
