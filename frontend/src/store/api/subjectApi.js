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

export const subjectApi = createApi({
  reducerPath: 'subjectApi',
  baseQuery,
  tagTypes: ['Subjects'],
  endpoints: (builder) => ({
    // Get all subjects
    getSubjects: builder.query({
      query: (params) => ({
        url: '/subjects',
        method: 'GET',
        params,
      }),
      providesTags: ['Subjects'],
    }),

    // Get subject by ID
    getSubjectById: builder.query({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: 'GET',
      }),
      providesTags: ['Subjects'],
    }),

    // Create subject
    createSubject: builder.mutation({
      query: (data) => ({
        url: '/subjects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),

    // Update subject
    updateSubject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subjects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),

    // Patch subject
    patchSubject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subjects/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),

    // Delete subject
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subjects'],
    }),

    // Assign teachers to subject
    assignTeachersToSubject: builder.mutation({
      query: ({ subjectId, teacherIds }) => ({
        url: `/subjects/${subjectId}/assign-teachers`,
        method: 'POST',
        body: { teacherIds },
      }),
      invalidatesTags: ['Subjects'],
    }),

    // Get subjects by class
    getSubjectsByClass: builder.query({
      query: (classId) => ({
        url: `/subjects/class/${classId}`,
        method: 'GET',
      }),
      providesTags: ['Subjects'],
    }),

    // Get subject curriculum
    getSubjectCurriculum: builder.query({
      query: (subjectId) => ({
        url: `/subjects/${subjectId}/curriculum`,
        method: 'GET',
      }),
      providesTags: ['Subjects'],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  usePatchSubjectMutation,
  useDeleteSubjectMutation,
  useAssignTeachersToSubjectMutation,
  useGetSubjectsByClassQuery,
  useGetSubjectCurriculumQuery,
} = subjectApi;
