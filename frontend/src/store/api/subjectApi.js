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

export const subjectApi = createApi({
  reducerPath: 'subjectApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Subjects', 'Curriculum', 'SubjectAssignments'],
  endpoints: (builder) => ({
    // ==================== SUBJECT CRUD ====================
    getSubjects: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/subjects${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Subjects'],
    }),

    getSubjectById: builder.query({
      query: (id) => `/subjects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subjects', id }],
    }),

    createSubject: builder.mutation({
      query: (data) => ({
        url: '/subjects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),

    updateSubject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subjects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),

    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subjects'],
    }),

    // ==================== CURRICULUM ====================
    getCurriculums: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/subjects/curriculum${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Curriculum'],
    }),

    getCurriculumById: builder.query({
      query: (id) => `/subjects/curriculum/${id}`,
      providesTags: ['Curriculum'],
    }),

    createCurriculum: builder.mutation({
      query: (data) => ({
        url: '/subjects/curriculum',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Curriculum'],
    }),

    updateCurriculum: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subjects/curriculum/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Curriculum'],
    }),

    approveCurriculum: builder.mutation({
      query: (id) => ({
        url: `/subjects/curriculum/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Curriculum'],
    }),

    activateCurriculum: builder.mutation({
      query: (id) => ({
        url: `/subjects/curriculum/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Curriculum'],
    }),

    // ==================== TEACHER ASSIGNMENTS ====================
    assignTeacher: builder.mutation({
      query: (data) => ({
        url: '/subjects/assign-teacher',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SubjectAssignments', 'Subjects'],
    }),

    getTeacherAssignments: builder.query({
      query: (teacherId) => `/subjects/teacher/${teacherId}/assignments`,
      providesTags: ['SubjectAssignments'],
    }),

    removeTeacherAssignment: builder.mutation({
      query: (assignmentId) => ({
        url: `/subjects/assignment/${assignmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubjectAssignments', 'Subjects'],
    }),

    // ==================== LEGACY COMPAT ====================
    patchSubject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subjects/${id}`,
        method: 'PUT', // Route is PUT in backend
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),

    assignTeachersToSubject: builder.mutation({
      query: ({ subjectId, teacherIds }) => ({
        url: '/subjects/assign-teacher', // Map to correct backend endpoint
        method: 'POST',
        body: { subjectId, teacherId: teacherIds[0] }, // Legacy sent array, new takes single
      }),
      invalidatesTags: ['Subjects', 'SubjectAssignments'],
    }),

    getSubjectsByClass: builder.query({
      query: (classId) => `/subjects?classId=${classId}`, // Maps to getSubjects
      providesTags: ['Subjects'],
    }),

    getSubjectCurriculum: builder.query({
      query: (subjectId) => `/subjects/curriculum?subjectId=${subjectId}`, // Maps to getCurriculums
      providesTags: ['Curriculum'],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetCurriculumsQuery,
  useGetCurriculumByIdQuery,
  useCreateCurriculumMutation,
  useUpdateCurriculumMutation,
  useApproveCurriculumMutation,
  useActivateCurriculumMutation,
  useAssignTeacherMutation,
  useGetTeacherAssignmentsQuery,
  useRemoveTeacherAssignmentMutation,
  // Legacy compat
  usePatchSubjectMutation,
  useAssignTeachersToSubjectMutation,
  useGetSubjectsByClassQuery,
  useGetSubjectCurriculumQuery,
} = subjectApi;
