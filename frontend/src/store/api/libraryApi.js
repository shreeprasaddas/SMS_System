import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const libraryApi = createApi({
  reducerPath: 'libraryApi',
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
  tagTypes: ['Book', 'Issue', 'Member'],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (params) => ({
        url: '/library/books',
        params,
      }),
      providesTags: ['Book'],
    }),
    getBookById: builder.query({
      query: (id) => `/library/books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    }),
    issueBook: builder.mutation({
      query: (data) => ({
        url: '/library/issues',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Issue', 'Book'],
    }),
    getPendingIssues: builder.query({
      query: (params) => ({
        url: '/library/issues',
        params,
      }),
      providesTags: ['Issue'],
    }),
    returnBook: builder.mutation({
      query: ({ issueId, ...data }) => ({
        url: `/library/issues/${issueId}/return`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Issue', 'Book'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useIssueBookMutation,
  useGetPendingIssuesQuery,
  useReturnBookMutation,
} = libraryApi;
