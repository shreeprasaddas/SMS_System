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

export const assignmentApi = createApi({
  reducerPath: 'assignmentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Assignment'],
  endpoints: (builder) => ({
    // Get all assignments with pagination and filters
    getAssignments: builder.query({
      query: ({ page = 1, limit = 12, search = '', class: classId = '', subject = '', status = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (classId) params.append('class', classId);
        if (subject) params.append('subject', subject);
        if (status) params.append('status', status);
        return `/assignments?${params.toString()}`;
      },
      providesTags: ['Assignment'],
    }),

    // Get single assignment by ID
    getAssignmentById: builder.query({
      query: (id) => `/assignments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Assignment', id }],
    }),

    // Create new assignment
    createAssignment: builder.mutation({
      query: (data) => ({
        url: '/assignments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Update assignment
    updateAssignment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/assignments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Assignment', id },
        'Assignment',
      ],
    }),

    // Partial update assignment
    patchAssignment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/assignments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Assignment', id },
        'Assignment',
      ],
    }),

    // Delete assignment
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Publish assignment
    publishAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}/publish`,
        method: 'PUT',
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Close assignment
    closeAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}/close`,
        method: 'PUT',
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Get assignment statistics
    getAssignmentStatistics: builder.query({
      query: (id) => `/assignments/${id}/statistics`,
      providesTags: ['Assignment'],
    }),

    // Submit assignment (student submits work)
    submitAssignment: builder.mutation({
      query: ({ id, submission }) => ({
        url: `/assignments/${id}/submit`,
        method: 'POST',
        body: { submission },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Assignment', id },
        'Assignment',
      ],
    }),

    // Get assignment submissions
    getAssignmentSubmissions: builder.query({
      query: (assignmentId) => `/assignments/${assignmentId}/submissions`,
      providesTags: ['Assignment'],
    }),

    // Get student's submissions
    getStudentSubmissions: builder.query({
      query: ({ assignmentId, studentId }) =>
        `/assignments/${assignmentId}/students/${studentId}/submissions`,
      providesTags: ['Assignment'],
    }),

    // Evaluate submission
    evaluateSubmission: builder.mutation({
      query: ({ submissionId, ...data }) => ({
        url: `/assignments/submissions/${submissionId}/evaluate`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assignment'],
    }),

    // ==================== LEGACY COMPAT ====================
    getAssignmentsByClass: builder.query({
      query: (classId) => `/assignments?class=${classId}`,
      providesTags: ['Assignment'],
    }),

    getAssignmentsBySubject: builder.query({
      query: (subjectId) => `/assignments?subject=${subjectId}`,
      providesTags: ['Assignment'],
    }),

    getAssignmentStats: builder.query({
      query: () => '/assignments?limit=1', // Get just count
      providesTags: ['Assignment'],
    }),

    gradeSubmission: builder.mutation({
      query: ({ assignmentId, submissionId, marks, feedback }) => ({
        url: `/assignments/submissions/${submissionId}/evaluate`,
        method: 'POST',
        body: { marks, feedback },
      }),
      invalidatesTags: ['Assignment'],
    }),

    getAssignmentReport: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/assignments${queryString ? '?' + queryString : ''}`;
      },
      providesTags: ['Assignment'],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  usePatchAssignmentMutation,
  useDeleteAssignmentMutation,
  usePublishAssignmentMutation,
  useCloseAssignmentMutation,
  useGetAssignmentStatisticsQuery,
  useSubmitAssignmentMutation,
  useGetAssignmentSubmissionsQuery,
  useGetStudentSubmissionsQuery,
  useEvaluateSubmissionMutation,
  // Legacy compat
  useGetAssignmentsByClassQuery,
  useGetAssignmentsBySubjectQuery,
  useGetAssignmentStatsQuery,
  useGradeSubmissionMutation,
  useGetAssignmentReportQuery,
} = assignmentApi;
