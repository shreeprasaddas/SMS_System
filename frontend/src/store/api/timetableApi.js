import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const timetableApi = createApi({
  reducerPath: 'timetableApi',
  baseQuery,
  tagTypes: ['Timetable'],
  endpoints: (builder) => ({
    // Get all timetable entries with pagination and filters
    getTimetables: builder.query({
      query: ({ page = 1, limit = 12, search = '', class: classId = '', teacher = '', day = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (classId) params.append('class', classId);
        if (teacher) params.append('teacher', teacher);
        if (day) params.append('day', day);
        return `/timetables?${params.toString()}`;
      },
      providesTags: ['Timetable'],
    }),

    // Get single timetable entry by ID
    getTimetableById: builder.query({
      query: (id) => `/timetables/${id}`,
      providesTags: (result, error, id) => [{ type: 'Timetable', id }],
    }),

    // Create new timetable entry
    createTimetable: builder.mutation({
      query: (data) => ({
        url: '/timetables',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    // Update timetable entry
    updateTimetable: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/timetables/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Timetable', id },
        'Timetable',
      ],
    }),

    // Partial update timetable
    patchTimetable: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/timetables/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Timetable', id },
        'Timetable',
      ],
    }),

    // Delete timetable entry
    deleteTimetable: builder.mutation({
      query: (id) => ({
        url: `/timetables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Timetable'],
    }),

    // Get timetable for a specific class
    getClassTimetable: builder.query({
      query: (classId) => `/timetables/class/${classId}`,
      providesTags: ['Timetable'],
    }),

    // Get timetable for a specific teacher
    getTeacherTimetable: builder.query({
      query: (teacherId) => `/timetables/teacher/${teacherId}`,
      providesTags: ['Timetable'],
    }),

    // Get calendar view (all timetables grouped by day/time)
    getTimetableCalendar: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/timetables/calendar${queryString ? '?' + queryString : ''}`;
      },
      providesTags: ['Timetable'],
    }),

    // Bulk create timetables for a class (paste schedule)
    bulkCreateTimetables: builder.mutation({
      query: (data) => ({
        url: '/timetables/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    // Get timetable statistics
    getTimetableStats: builder.query({
      query: () => '/timetables/stats',
      providesTags: ['Timetable'],
    }),

    // Get timetable for a specific day
    getTimetableByDay: builder.query({
      query: (day) => `/timetables/day/${day}`,
      providesTags: ['Timetable'],
    }),

    // Generate timetable report
    getTimetableReport: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/timetables/report${queryString ? '?' + queryString : ''}`;
      },
      providesTags: ['Timetable'],
    }),
  }),
});

export const {
  useGetTimetablesQuery,
  useGetTimetableByIdQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  usePatchTimetableMutation,
  useDeleteTimetableMutation,
  useGetClassTimetableQuery,
  useGetTeacherTimetableQuery,
  useGetTimetableCalendarQuery,
  useBulkCreateTimetablesMutation,
  useGetTimetableStatsQuery,
  useGetTimetableByDayQuery,
  useGetTimetableReportQuery,
} = timetableApi;
