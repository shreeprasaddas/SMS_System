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

export const gradeApi = createApi({
  reducerPath: 'gradeApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Grade', 'Grades'],
  endpoints: (builder) => ({
    // POST /grades - Create grade
    createGrade: builder.mutation({
      query: (data) => ({
        url: '/grades',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Grade', 'Grades'],
    }),

    // GET /grades - Get grades with filters
    getGrades: builder.query({
      query: (params = {}) => {
        const cleanParams = {};
        Object.entries(params).forEach(([key, value]) => {
          if (value !== '' && value !== undefined && value !== null) {
            cleanParams[key] = value;
          }
        });
        const queryString = new URLSearchParams(cleanParams).toString();
        return `/grades${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Grades'],
    }),

    // GET /grades/:gradeId
    getGradeById: builder.query({
      query: (gradeId) => `/grades/${gradeId}`,
      providesTags: (result, error, id) => [{ type: 'Grade', id }],
    }),

    // PATCH /grades/finalize
    finalizeGrades: builder.mutation({
      query: (data) => ({
        url: '/grades/finalize',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Grades'],
    }),

    // PATCH /grades/publish
    publishGrades: builder.mutation({
      query: (data) => ({
        url: '/grades/publish',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Grades'],
    }),

    // POST /grades/:gradeId/contest
    contestGrade: builder.mutation({
      query: ({ gradeId, ...data }) => ({
        url: `/grades/${gradeId}/contest`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Grades'],
    }),

    // PATCH /grades/:gradeId/resolve
    resolveGradeContest: builder.mutation({
      query: ({ gradeId, ...data }) => ({
        url: `/grades/${gradeId}/resolve`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Grades'],
    }),

    // GET /grades/class-stats
    getClassGradeStats: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/grades/class-stats${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Grades'],
    }),

    // GET /grades/subject-performance
    getSubjectPerformance: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/grades/subject-performance${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Grades'],
    }),

    // Legacy compat
    getStudentGrades: builder.query({
      query: (studentId) => `/grades?studentId=${studentId}`,
      providesTags: ['Grades'],
    }),

    getClassGrades: builder.query({
      query: (classId) => `/grades?classId=${classId}`,
      providesTags: ['Grades'],
    }),

    getGradeReport: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/grades/class-stats?${queryString}`;
      },
      providesTags: ['Grades'],
    }),

    getGradeStats: builder.query({
      query: (classId) => `/grades/class-stats?classId=${classId}`,
      providesTags: ['Grades'],
    }),

    // Legacy: DELETE /grades/:gradeId
    deleteGrade: builder.mutation({
      query: (gradeId) => ({
        url: `/grades/${gradeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Grades', 'Grade'],
    }),

    // Legacy: POST /grades/mark-bulk
    markBulkGrades: builder.mutation({
      query: (data) => ({
        url: '/grades/mark-bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Grades'],
    }),
  }),
});

export const {
  useCreateGradeMutation,
  useGetGradesQuery,
  useGetGradeByIdQuery,
  useFinalizeGradesMutation,
  usePublishGradesMutation,
  useContestGradeMutation,
  useResolveGradeContestMutation,
  useGetClassGradeStatsQuery,
  useGetSubjectPerformanceQuery,
  useGetStudentGradesQuery,
  useGetClassGradesQuery,
  useGetGradeReportQuery,
  useGetGradeStatsQuery,
  useDeleteGradeMutation,
  useMarkBulkGradesMutation,
} = gradeApi;
