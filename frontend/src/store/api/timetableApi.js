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

export const timetableApi = createApi({
  reducerPath: 'timetableApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Timetable', 'PeriodConfig', 'TimeSlot'],
  endpoints: (builder) => ({
    // ==================== PERIOD CONFIGURATIONS ====================
    createPeriodConfig: builder.mutation({
      query: (data) => ({
        url: '/timetables/period-configs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PeriodConfig'],
    }),

    getPeriodConfigs: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/timetables/period-configs${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['PeriodConfig'],
    }),

    getPeriodConfigById: builder.query({
      query: (id) => `/timetables/period-configs/${id}`,
      providesTags: ['PeriodConfig'],
    }),

    // ==================== TIME SLOTS ====================
    createTimeSlot: builder.mutation({
      query: (data) => ({
        url: '/timetables/time-slots',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TimeSlot'],
    }),

    getTimeSlots: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/timetables/time-slots${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['TimeSlot'],
    }),

    // ==================== TIMETABLES ====================
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

    getTimetableById: builder.query({
      query: (id) => `/timetables/${id}`,
      providesTags: (result, error, id) => [{ type: 'Timetable', id }],
    }),

    createTimetable: builder.mutation({
      query: (data) => ({
        url: '/timetables',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

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

    publishTimetable: builder.mutation({
      query: (id) => ({
        url: `/timetables/${id}/publish`,
        method: 'PUT',
      }),
      invalidatesTags: ['Timetable'],
    }),

    activateTimetable: builder.mutation({
      query: (id) => ({
        url: `/timetables/${id}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Timetable'],
    }),

    getTimetableStatistics: builder.query({
      query: (id) => `/timetables/${id}/statistics`,
      providesTags: ['Timetable'],
    }),

    // ==================== TEACHER TIMETABLES ====================
    createTeacherTimetable: builder.mutation({
      query: ({ teacherId, ...data }) => ({
        url: `/timetables/teachers/${teacherId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    getTeacherTimetable: builder.query({
      query: (teacherId) => `/timetables/teachers/${teacherId}`,
      providesTags: ['Timetable'],
    }),

    confirmTeacherTimetable: builder.mutation({
      query: (teacherId) => ({
        url: `/timetables/teachers/${teacherId}/confirm`,
        method: 'PUT',
      }),
      invalidatesTags: ['Timetable'],
    }),

    // ==================== TIMETABLE CHANGES ====================
    requestTimetableChange: builder.mutation({
      query: ({ timetableId, ...data }) => ({
        url: `/timetables/${timetableId}/changes`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    getTimetableChanges: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/timetables/changes${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Timetable'],
    }),

    approveTimetableChange: builder.mutation({
      query: ({ changeId, ...data }) => ({
        url: `/timetables/changes/${changeId}/approve`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    rejectTimetableChange: builder.mutation({
      query: ({ changeId, ...data }) => ({
        url: `/timetables/changes/${changeId}/reject`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    implementTimetableChange: builder.mutation({
      query: (changeId) => ({
        url: `/timetables/changes/${changeId}/implement`,
        method: 'PUT',
      }),
      invalidatesTags: ['Timetable'],
    }),

    // ==================== LEGACY COMPAT ====================
    patchTimetable: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/timetables/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    deleteTimetable: builder.mutation({
      query: (id) => ({
        url: `/timetables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Timetable'],
    }),

    getClassTimetable: builder.query({
      query: (classId) => `/timetables?class=${classId}`,
      providesTags: ['Timetable'],
    }),

    getTimetableCalendar: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/timetables${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Timetable'],
    }),

    bulkCreateTimetables: builder.mutation({
      query: (data) => ({
        url: '/timetables',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Timetable'],
    }),

    getTimetableStats: builder.query({
      query: () => '/timetables?limit=1',
      providesTags: ['Timetable'],
    }),

    getTimetableByDay: builder.query({
      query: (day) => `/timetables?day=${day}`,
      providesTags: ['Timetable'],
    }),

    getTimetableReport: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/timetables${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Timetable'],
    }),
  }),
});

export const {
  useCreatePeriodConfigMutation,
  useGetPeriodConfigsQuery,
  useGetPeriodConfigByIdQuery,
  useCreateTimeSlotMutation,
  useGetTimeSlotsQuery,
  useGetTimetablesQuery,
  useGetTimetableByIdQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  usePublishTimetableMutation,
  useActivateTimetableMutation,
  useGetTimetableStatisticsQuery,
  useCreateTeacherTimetableMutation,
  useGetTeacherTimetableQuery,
  useConfirmTeacherTimetableMutation,
  useRequestTimetableChangeMutation,
  useGetTimetableChangesQuery,
  useApproveTimetableChangeMutation,
  useRejectTimetableChangeMutation,
  useImplementTimetableChangeMutation,
  // Legacy compat
  usePatchTimetableMutation,
  useDeleteTimetableMutation,
  useGetClassTimetableQuery,
  useGetTimetableCalendarQuery,
  useBulkCreateTimetablesMutation,
  useGetTimetableStatsQuery,
  useGetTimetableByDayQuery,
  useGetTimetableReportQuery,
} = timetableApi;
