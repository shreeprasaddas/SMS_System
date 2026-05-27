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

export const classApi = createApi({
  reducerPath: 'classApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Classes', 'Class'],
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: ({ page = 1, limit = 10, search = '', section = '', status = '' } = {}) => {
        let url = `/classes?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        if (section) url += `&section=${section}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      transformResponse: (response) => {
        const classes = Array.isArray(response?.data) ? response.data : (response?.data?.classes || []);
        const total = response?.pagination?.total || response?.data?.total || classes.length;

        // Define properties on the array itself so it acts both as a list and as a structured object
        const dataArray = [...classes];
        Object.defineProperties(dataArray, {
          classes: { value: classes, enumerable: true },
          total: { value: total, enumerable: true },
          pagination: { value: response?.pagination, enumerable: true }
        });

        return {
          success: true,
          data: dataArray,
          pagination: response?.pagination,
          total: total
        };
      },
      providesTags: ['Classes'],
    }),

    getClassById: builder.query({
      query: (classId) => `/classes/${classId}`,
      providesTags: (result, error, classId) => [{ type: 'Class', id: classId }],
    }),

    createClass: builder.mutation({
      query: (classData) => ({
        url: '/classes',
        method: 'POST',
        body: classData,
      }),
      invalidatesTags: ['Classes'],
    }),

    updateClass: builder.mutation({
      query: ({ classId, ...updates }) => ({
        url: `/classes/${classId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: 'Class', id: classId },
        'Classes',
      ],
    }),

    patchClass: builder.mutation({
      query: ({ classId, ...updates }) => ({
        url: `/classes/${classId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: 'Class', id: classId },
        'Classes',
      ],
    }),

    deleteClass: builder.mutation({
      query: (classId) => ({
        url: `/classes/${classId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Classes'],
    }),

    getClassStats: builder.query({
      query: () => '/classes/stats',
      providesTags: ['Classes'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  usePatchClassMutation,
  useDeleteClassMutation,
  useGetClassStatsQuery,
} = classApi;
