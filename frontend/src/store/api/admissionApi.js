import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const admissionApi = createApi({
  reducerPath: 'admissionApi',
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
  tagTypes: ['Application', 'Cycle'],
  endpoints: (builder) => ({
    getApplications: builder.query({
      query: (params) => ({
        url: '/admission/applications',
        params,
      }),
      providesTags: ['Application'],
    }),
    getApplicationById: builder.query({
      query: (id) => `/admission/applications/${id}`,
      providesTags: (result, error, id) => [{ type: 'Application', id }],
    }),
    updateApplication: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admission/applications/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Application'],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationMutation,
} = admissionApi;
