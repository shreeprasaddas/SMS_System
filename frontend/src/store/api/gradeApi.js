import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

export const gradeApi = createApi({
  reducerPath: 'gradeApi',
  baseQuery,
  tagTypes: ['Grade'],
  endpoints: (builder) => ({
    // GET /grades
    getGrades: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/grades?${queryString}`;
      },
      providesTags: ['Grade'],
    }),

    // GET /grades/:gradeId
    getGradeById: builder.query({
      query: (gradeId) => `/grades/${gradeId}`,
      providesTags: ['Grade'],
    }),

    // POST /grades
    createGrade: builder.mutation({
      query: (data) => ({
        url: '/grades',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Grade'],
    }),

    // PUT /grades/:gradeId
    updateGrade: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/grades/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Grade'],
    }),

    // PATCH /grades/:gradeId
    patchGrade: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/grades/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Grade'],
    }),

    // DELETE /grades/:gradeId
    deleteGrade: builder.mutation({
      query: (gradeId) => ({
        url: `/grades/${gradeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Grade'],
    }),

    // POST /grades/mark-bulk
    markBulkGrades: builder.mutation({
      query: (data) => ({
        url: '/grades/mark-bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Grade'],
    }),

    // GET /grades/student/:studentId
    getStudentGrades: builder.query({
      query: (studentId) => `/grades/student/${studentId}`,
      providesTags: ['Grade'],
    }),

    // GET /grades/class/:classId
    getClassGrades: builder.query({
      query: (classId) => `/grades/class/${classId}`,
      providesTags: ['Grade'],
    }),

    // GET /grades/report
    getGradeReport: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/grades/report?${queryString}`;
      },
      providesTags: ['Grade'],
    }),

    // GET /grades/stats
    getGradeStats: builder.query({
      query: (classId) => `/grades/stats?classId=${classId}`,
      providesTags: ['Grade'],
    }),
  }),
});

export const {
  useGetGradesQuery,
  useGetGradeByIdQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  usePatchGradeMutation,
  useDeleteGradeMutation,
  useMarkBulkGradesMutation,
  useGetStudentGradesQuery,
  useGetClassGradesQuery,
  useGetGradeReportQuery,
  useGetGradeStatsQuery,
} = gradeApi;
