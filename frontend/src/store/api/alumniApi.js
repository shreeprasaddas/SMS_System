import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const alumniApi = createApi({
  reducerPath: 'alumniApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Alumni'],
  endpoints: (builder) => ({
    getAlumni: builder.query({
      query: (params) => ({
        url: '/alumni', // StandardREST path based on routing setup
        params,
      }),
      providesTags: ['Alumni'],
    }),
    registerAlumni: builder.mutation({
      query: (data) => ({
        url: '/alumni/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Alumni'],
    }),
  }),
});

export const {
  useGetAlumniQuery,
  useRegisterAlumniMutation
} = alumniApi;
