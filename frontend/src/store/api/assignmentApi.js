import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const assignmentApi = createApi({
  reducerPath: 'assignmentApi',
  baseQuery,
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

    // Get assignments by class
    getAssignmentsByClass: builder.query({
      query: (classId) => `/assignments/class/${classId}`,
      providesTags: ['Assignment'],
    }),

    // Get assignments by subject
    getAssignmentsBySubject: builder.query({
      query: (subjectId) => `/assignments/subject/${subjectId}`,
      providesTags: ['Assignment'],
    }),

    // Get assignment statistics
    getAssignmentStats: builder.query({
      query: () => '/assignments/stats',
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

    // Grade assignment submission
    gradeSubmission: builder.mutation({
      query: ({ assignmentId, submissionId, marks, feedback }) => ({
        url: `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
        method: 'POST',
        body: { marks, feedback },
      }),
      invalidatesTags: ['Assignment'],
    }),

    // Get assignment submissions
    getAssignmentSubmissions: builder.query({
      query: (assignmentId) => `/assignments/${assignmentId}/submissions`,
      providesTags: ['Assignment'],
    }),

    // Get assignment report
    getAssignmentReport: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/assignments/report${queryString ? '?' + queryString : ''}`;
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
  useGetAssignmentsByClassQuery,
  useGetAssignmentsBySubjectQuery,
  useGetAssignmentStatsQuery,
  useSubmitAssignmentMutation,
  useGradeSubmissionMutation,
  useGetAssignmentSubmissionsQuery,
  useGetAssignmentReportQuery,
} = assignmentApi;
