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

export const teacherApi = createApi({
  reducerPath: 'teacherApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Teachers', 'Teacher'],
  endpoints: (builder) => ({
    getTeachers: builder.query({
      query: ({ page = 1, limit = 10, search = '', department = '', status = '' } = {}) => {
        let url = `/teachers?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (department) url += `&department=${department}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Teachers'],
    }),

    getTeacherById: builder.query({
      query: (teacherId) => `/teachers/${teacherId}`,
      providesTags: (result, error, teacherId) => [{ type: 'Teacher', id: teacherId }],
    }),

    createTeacher: builder.mutation({
      query: (teacherData) => ({
        url: '/teachers',
        method: 'POST',
        body: teacherData,
      }),
      invalidatesTags: ['Teachers'],
    }),

    updateTeacher: builder.mutation({
      query: ({ teacherId, ...updates }) => ({
        url: `/teachers/${teacherId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { teacherId }) => [
        { type: 'Teacher', id: teacherId },
        'Teachers',
      ],
    }),

    patchTeacher: builder.mutation({
      query: ({ teacherId, ...updates }) => ({
        url: `/teachers/${teacherId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { teacherId }) => [
        { type: 'Teacher', id: teacherId },
        'Teachers',
      ],
    }),

    deleteTeacher: builder.mutation({
      query: (teacherId) => ({
        url: `/teachers/${teacherId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teachers'],
    }),

    getTeachersByDepartment: builder.query({
      query: (department) => `/teachers/department/${department}`,
      providesTags: ['Teachers'],
    }),

    getTeacherStats: builder.query({
      query: () => '/teachers/stats',
      providesTags: ['Teachers'],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  usePatchTeacherMutation,
  useDeleteTeacherMutation,
  useGetTeachersByDepartmentQuery,
  useGetTeacherStatsQuery,
} = teacherApi;
