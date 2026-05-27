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

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Attendance', 'AttendanceRecord'],
  endpoints: (builder) => ({
    // ========== Student Attendance ==========

    // POST /attendance/students - Mark single attendance
    markStudentAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: '/attendance/students',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance', 'AttendanceRecord'],
    }),

    // POST /attendance/students/bulk - Mark bulk attendance
    markBulkAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: '/attendance/students/bulk',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance', 'AttendanceRecord'],
    }),

    // GET /attendance/students - Get student attendance records
    getStudentAttendance: builder.query({
      query: ({ page = 1, limit = 10, classId = '', date = '', studentId = '' } = {}) => {
        let url = `/attendance/students?page=${page}&limit=${limit}`;
        if (classId) url += `&classId=${classId}`;
        if (date) url += `&date=${date}`;
        if (studentId) url += `&studentId=${studentId}`;
        return url;
      },
      providesTags: ['Attendance'],
    }),

    // GET /attendance/students/:studentId/percentage
    getStudentAttendancePercentage: builder.query({
      query: (studentId) => `/attendance/students/${studentId}/percentage`,
      providesTags: (result, error, studentId) => [
        { type: 'AttendanceRecord', id: studentId },
      ],
    }),

    // GET /attendance/class-report
    getClassAttendanceReport: builder.query({
      query: ({ classId = '', month = '', year = '' } = {}) => {
        let url = '/attendance/class-report';
        const params = [];
        if (classId) params.push(`classId=${classId}`);
        if (month) params.push(`month=${month}`);
        if (year) params.push(`year=${year}`);
        if (params.length > 0) url += '?' + params.join('&');
        return url;
      },
      providesTags: ['Attendance'],
    }),

    // GET /attendance/summary
    getAttendanceSummary: builder.query({
      query: ({ classId = '' } = {}) => {
        let url = '/attendance/summary';
        if (classId) url += `?classId=${classId}`;
        return url;
      },
      providesTags: ['Attendance'],
    }),

    // ========== Holidays ==========

    // GET /attendance/holidays
    getHolidays: builder.query({
      query: () => '/attendance/holidays',
      providesTags: ['Attendance'],
    }),

    // POST /attendance/holidays
    addHoliday: builder.mutation({
      query: (data) => ({
        url: '/attendance/holidays',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // ========== Legacy compat ==========

    // Legacy: GET /attendance (maps to /attendance/students)
    getAttendance: builder.query({
      query: ({ page = 1, limit = 10, classId = '', date = '', status = '' } = {}) => {
        let url = `/attendance/students?page=${page}&limit=${limit}`;
        if (classId) url += `&classId=${classId}`;
        if (date) url += `&date=${date}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Attendance'],
    }),

    // Legacy: POST /attendance/mark (maps to /attendance/students)
    markAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: '/attendance/students',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance', 'AttendanceRecord'],
    }),

    // Legacy: GET /attendance/report (maps to /attendance/class-report)
    getAttendanceReport: builder.query({
      query: ({ classId = '', startDate = '', endDate = '' } = {}) => {
        let url = '/attendance/class-report';
        const params = [];
        if (classId) params.push(`classId=${classId}`);
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        return url;
      },
      providesTags: ['Attendance'],
    }),

    // Legacy: GET /attendance/stats (maps to /attendance/summary)
    getAttendanceStats: builder.query({
      query: ({ classId = '', studentId = '' } = {}) => {
        let url = '/attendance/summary';
        const params = [];
        if (classId) params.push(`classId=${classId}`);
        if (studentId) params.push(`studentId=${studentId}`);
        if (params.length > 0) url += '?' + params.join('&');
        return url;
      },
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useMarkStudentAttendanceMutation,
  useMarkBulkAttendanceMutation,
  useGetStudentAttendanceQuery,
  useGetStudentAttendancePercentageQuery,
  useGetClassAttendanceReportQuery,
  useGetAttendanceSummaryQuery,
  useGetHolidaysQuery,
  useAddHolidayMutation,
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
  useGetAttendanceReportQuery,
  useGetAttendanceStatsQuery,
} = attendanceApi;
