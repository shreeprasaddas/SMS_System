import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const disciplineApi = createApi({
  reducerPath: 'disciplineApi',
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
  tagTypes: ['Incident', 'Record', 'Action'],
  endpoints: (builder) => ({
    getIncidents: builder.query({
      query: (params) => ({
        url: '/discipline/incidents',
        params,
      }),
      providesTags: ['Incident'],
    }),
    reportIncident: builder.mutation({
      query: (data) => ({
        url: '/discipline/incidents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Incident'],
    }),
    getDisciplineRecords: builder.query({
      query: (params) => ({
        url: '/discipline/records',
        params,
      }),
      providesTags: ['Record'],
    }),
    getDisciplineActions: builder.query({
      query: (params) => ({
        url: '/discipline/actions',
        params,
      }),
      providesTags: ['Action'],
    })
  }),
});

export const {
  useGetIncidentsQuery,
  useReportIncidentMutation,
  useGetDisciplineRecordsQuery,
  useGetDisciplineActionsQuery
} = disciplineApi;
