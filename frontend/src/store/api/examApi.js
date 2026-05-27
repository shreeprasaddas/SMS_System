import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loginSuccess, logout } from '../slices/authSlice.js';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
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

export const examApi = createApi({
  reducerPath: 'examApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Exams', 'ExamTypes', 'Allocations'],
  endpoints: (builder) => ({
    // ==================== EXAM TYPES ====================
    getExamTypes: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/exams/types${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['ExamTypes'],
    }),

    createExamType: builder.mutation({
      query: (data) => ({
        url: '/exams/types',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ExamTypes'],
    }),

    // ==================== EXAM SCHEDULES ====================
    getExams: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/exams${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Exams'],
    }),

    getExamById: builder.query({
      query: (id) => `/exams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Exams', id }],
    }),

    createExam: builder.mutation({
      query: (data) => ({
        url: '/exams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exams'],
    }),

    updateExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/exams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Exams'],
    }),

    deleteExam: builder.mutation({
      query: (id) => ({
        url: `/exams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exams'],
    }),

    // ==================== SEAT ALLOCATIONS ====================
    allocateSeats: builder.mutation({
      query: (data) => ({
        url: '/exams/allocations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Allocations'],
    }),

    getSeatAllocations: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/exams/allocations${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Allocations'],
    }),

    // ==================== EXAM EXECUTION & RESULTS ====================
    publishExamResults: builder.mutation({
      query: (examId) => ({
        url: `/exams/${examId}/publish`,
        method: 'PUT',
      }),
      invalidatesTags: ['Exams'],
    }),

    startExam: builder.mutation({
      query: (id) => ({
        url: `/exams/${id}/start`,
        method: 'PUT',
      }),
      invalidatesTags: ['Exams'],
    }),

    endExam: builder.mutation({
      query: (id) => ({
        url: `/exams/${id}/end`,
        method: 'PUT',
      }),
      invalidatesTags: ['Exams'],
    }),

    getExamStatistics: builder.query({
      query: (id) => `/exams/${id}/statistics`,
      providesTags: ['Exams'],
    }),

    generateHallTicket: builder.query({
      query: ({ examId, studentId }) => `/exams/${examId}/students/${studentId}/hall-ticket`,
    }),

    // ==================== LEGACY COMPAT ====================
    patchExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/exams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Exams'],
    }),

    getExamsByClass: builder.query({
      query: (classId) => `/exams?class=${classId}`,
      providesTags: ['Exams'],
    }),

    getExamsBySubject: builder.query({
      query: (subjectId) => `/exams?subject=${subjectId}`, // Best effort mapping
      providesTags: ['Exams'],
    }),

    getExamSchedule: builder.query({
      query: (params) => `/exams?${new URLSearchParams(params).toString()}`, // Maps to getExams
      providesTags: ['Exams'],
    }),

    getExamReport: builder.query({
      query: (examId) => `/exams/${examId}/statistics`, // Maps to statistics
      providesTags: ['Exams'],
    }),
  }),
});

export const {
  useGetExamTypesQuery,
  useCreateExamTypeMutation,
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useAllocateSeatsMutation,
  useGetSeatAllocationsQuery,
  usePublishExamResultsMutation,
  useStartExamMutation,
  useEndExamMutation,
  useGetExamStatisticsQuery,
  useGenerateHallTicketQuery,
  // Legacy compat
  usePatchExamMutation,
  useGetExamsByClassQuery,
  useGetExamsBySubjectQuery,
  useGetExamScheduleQuery,
  useGetExamReportQuery,
} = examApi;
