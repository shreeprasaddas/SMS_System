import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery,
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
