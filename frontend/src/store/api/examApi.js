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

export const examApi = createApi({
  reducerPath: 'examApi',
  baseQuery,
  tagTypes: ['Exams'],
  endpoints: (builder) => ({
    // Get all exams
    getExams: builder.query({
      query: (params) => ({
        url: '/exams',
        method: 'GET',
        params,
      }),
      providesTags: ['Exams'],
    }),

    // Get exam by ID
    getExamById: builder.query({
      query: (id) => ({
        url: `/exams/${id}`,
        method: 'GET',
      }),
      providesTags: ['Exams'],
    }),

    // Create exam
    createExam: builder.mutation({
      query: (data) => ({
        url: '/exams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exams'],
    }),

    // Update exam
    updateExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/exams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Exams'],
    }),

    // Patch exam
    patchExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/exams/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Exams'],
    }),

    // Delete exam
    deleteExam: builder.mutation({
      query: (id) => ({
        url: `/exams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exams'],
    }),

    // Get exams by class
    getExamsByClass: builder.query({
      query: (classId) => ({
        url: `/exams/class/${classId}`,
        method: 'GET',
      }),
      providesTags: ['Exams'],
    }),

    // Get exams by subject
    getExamsBySubject: builder.query({
      query: (subjectId) => ({
        url: `/exams/subject/${subjectId}`,
        method: 'GET',
      }),
      providesTags: ['Exams'],
    }),

    // Get exam schedule
    getExamSchedule: builder.query({
      query: (params) => ({
        url: '/exams/schedule',
        method: 'GET',
        params,
      }),
      providesTags: ['Exams'],
    }),

    // Publish exam results
    publishExamResults: builder.mutation({
      query: (examId) => ({
        url: `/exams/${examId}/publish-results`,
        method: 'POST',
      }),
      invalidatesTags: ['Exams'],
    }),

    // Get exam report
    getExamReport: builder.query({
      query: (examId) => ({
        url: `/exams/${examId}/report`,
        method: 'GET',
      }),
      providesTags: ['Exams'],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  usePatchExamMutation,
  useDeleteExamMutation,
  useGetExamsByClassQuery,
  useGetExamsBySubjectQuery,
  useGetExamScheduleQuery,
  usePublishExamResultsMutation,
  useGetExamReportQuery,
} = examApi;
