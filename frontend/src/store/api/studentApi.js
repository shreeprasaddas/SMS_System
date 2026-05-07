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

// Base query with error handling and token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle token expiration
  if (result.error?.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
      },
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

      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Students', 'Student'],
  endpoints: (builder) => ({
    // Get all students
    getStudents: builder.query({
      query: ({ page = 1, limit = 10, search = '', classId = '', status = '' } = {}) => {
        let url = `/students?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (classId) url += `&classId=${classId}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Students'],
    }),

    // Get single student by ID
    getStudentById: builder.query({
      query: (studentId) => `/students/${studentId}`,
      providesTags: (result, error, studentId) => [{ type: 'Student', id: studentId }],
    }),

    // Create new student
    createStudent: builder.mutation({
      query: (studentData) => ({
        url: '/students',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Students'],
    }),

    // Update student
    updateStudent: builder.mutation({
      query: ({ studentId, ...updates }) => ({
        url: `/students/${studentId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { studentId }) => [
        { type: 'Student', id: studentId },
        'Students',
      ],
    }),

    // Partial update (e.g., change status)
    patchStudent: builder.mutation({
      query: ({ studentId, ...updates }) => ({
        url: `/students/${studentId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { studentId }) => [
        { type: 'Student', id: studentId },
        'Students',
      ],
    }),

    // Delete student
    deleteStudent: builder.mutation({
      query: (studentId) => ({
        url: `/students/${studentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Students'],
    }),

    // Get student by roll number
    getStudentByRollNumber: builder.query({
      query: ({ classId, rollNumber }) =>
        `/students/roll/${classId}/${rollNumber}`,
      providesTags: ['Student'],
    }),

    // Get students by class
    getStudentsByClass: builder.query({
      query: (classId) => `/students/class/${classId}`,
      providesTags: ['Students'],
    }),

    // Bulk update student status (e.g., activate/deactivate multiple)
    bulkUpdateStudentStatus: builder.mutation({
      query: (data) => ({
        url: '/students/bulk/status',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Students'],
    }),

    // Upload student profile photo
    uploadStudentPhoto: builder.mutation({
      query: ({ studentId, file }) => {
        const formData = new FormData();
        formData.append('profilePhoto', file);
        return {
          url: `/students/${studentId}/photo`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { studentId }) => [
        { type: 'Student', id: studentId },
      ],
    }),

    // Get student stats (dashboard data)
    getStudentStats: builder.query({
      query: () => '/students/stats',
      providesTags: ['Students'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  usePatchStudentMutation,
  useDeleteStudentMutation,
  useGetStudentByRollNumberQuery,
  useGetStudentsByClassQuery,
  useBulkUpdateStudentStatusMutation,
  useUploadStudentPhotoMutation,
  useGetStudentStatsQuery,
} = studentApi;
