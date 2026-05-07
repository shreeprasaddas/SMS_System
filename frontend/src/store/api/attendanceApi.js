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
    getAttendance: builder.query({
      query: ({ page = 1, limit = 10, classId = '', date = '', status = '' } = {}) => {
        let url = `/attendance?page=${page}&limit=${limit}`;
        if (classId) url += `&classId=${classId}`;
        if (date) url += `&date=${date}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Attendance'],
    }),

    markAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: '/attendance/mark',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance', 'AttendanceRecord'],
    }),

    getStudentAttendance: builder.query({
      query: ({ studentId, startDate = '', endDate = '' } = {}) => {
        let url = `/attendance/student/${studentId}`;
        if (startDate || endDate) {
          url += '?';
          if (startDate) url += `startDate=${startDate}`;
          if (startDate && endDate) url += '&';
          if (endDate) url += `endDate=${endDate}`;
        }
        return url;
      },
      providesTags: (result, error, { studentId }) => [
        { type: 'AttendanceRecord', id: studentId },
      ],
    }),

    getClassAttendance: builder.query({
      query: ({ classId, date }) => `/attendance/class/${classId}?date=${date}`,
      providesTags: (result, error, { classId }) => [
        { type: 'Attendance', id: classId },
      ],
    }),

    getAttendanceReport: builder.query({
      query: ({ classId = '', startDate = '', endDate = '' } = {}) => {
        let url = '/attendance/report';
        const params = [];
        if (classId) params.push(`classId=${classId}`);
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        return url;
      },
      providesTags: ['Attendance'],
    }),

    getAttendanceStats: builder.query({
      query: ({ classId = '', studentId = '' } = {}) => {
        let url = '/attendance/stats';
        const params = [];
        if (classId) params.push(`classId=${classId}`);
        if (studentId) params.push(`studentId=${studentId}`);
        if (params.length > 0) url += '?' + params.join('&');
        return url;
      },
      providesTags: ['Attendance'],
    }),

    updateAttendance: builder.mutation({
      query: ({ attendanceId, ...updates }) => ({
        url: `/attendance/${attendanceId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Attendance', 'AttendanceRecord'],
    }),

    deleteAttendance: builder.mutation({
      query: (attendanceId) => ({
        url: `/attendance/${attendanceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
  useGetStudentAttendanceQuery,
  useGetClassAttendanceQuery,
  useGetAttendanceReportQuery,
  useGetAttendanceStatsQuery,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApi;
