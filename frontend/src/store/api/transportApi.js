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

export const transportApi = createApi({
  reducerPath: 'transportApi',
  baseQuery,
  tagTypes: ['Transport'],
  endpoints: (builder) => ({
    // Get all transport routes with pagination and filters
    getRoutes: builder.query({
      query: ({ page = 1, limit = 12, search = '', status = '', driver = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (driver) params.append('driver', driver);
        return `/transport/routes?${params.toString()}`;
      },
      providesTags: ['Transport'],
    }),

    // Get single route by ID
    getRouteById: builder.query({
      query: (id) => `/transport/routes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transport', id }],
    }),

    // Create new transport route
    createRoute: builder.mutation({
      query: (data) => ({
        url: '/transport/routes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transport'],
    }),

    // Update transport route
    updateRoute: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport/routes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transport', id },
        'Transport',
      ],
    }),

    // Partial update route
    patchRoute: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport/routes/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transport', id },
        'Transport',
      ],
    }),

    // Delete transport route
    deleteRoute: builder.mutation({
      query: (id) => ({
        url: `/transport/routes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transport'],
    }),

    // Get vehicles
    getVehicles: builder.query({
      query: ({ page = 1, limit = 12, search = '', status = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        return `/transport/vehicles?${params.toString()}`;
      },
      providesTags: ['Transport'],
    }),

    // Get vehicle by ID
    getVehicleById: builder.query({
      query: (id) => `/transport/vehicles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transport', id }],
    }),

    // Create vehicle
    createVehicle: builder.mutation({
      query: (data) => ({
        url: '/transport/vehicles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transport'],
    }),

    // Update vehicle
    updateVehicle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport/vehicles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transport', id },
        'Transport',
      ],
    }),

    // Delete vehicle
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/transport/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transport'],
    }),

    // Get drivers
    getDrivers: builder.query({
      query: ({ page = 1, limit = 12, search = '', status = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        return `/transport/drivers?${params.toString()}`;
      },
      providesTags: ['Transport'],
    }),

    // Get driver by ID
    getDriverById: builder.query({
      query: (id) => `/transport/drivers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transport', id }],
    }),

    // Create driver
    createDriver: builder.mutation({
      query: (data) => ({
        url: '/transport/drivers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transport'],
    }),

    // Update driver
    updateDriver: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport/drivers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transport', id },
        'Transport',
      ],
    }),

    // Delete driver
    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `/transport/drivers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transport'],
    }),

    // Assign student to route
    assignStudentToRoute: builder.mutation({
      query: (data) => ({
        url: '/transport/routes/assign/student',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transport'],
    }),

    // Get route by student
    getRouteByStudent: builder.query({
      query: (studentId) => `/transport/routes/student/${studentId}`,
      providesTags: ['Transport'],
    }),

    // Get transport statistics
    getTransportStats: builder.query({
      query: () => '/transport/stats',
      providesTags: ['Transport'],
    }),

    // Get active routes (for tracking)
    getActiveRoutes: builder.query({
      query: () => '/transport/routes/active',
      providesTags: ['Transport'],
    }),

    // Upload route GPS tracking
    uploadGPSTracking: builder.mutation({
      query: ({ routeId, ...data }) => ({
        url: `/transport/routes/${routeId}/tracking`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transport'],
    }),

    // Get route tracking history
    getRouteTracking: builder.query({
      query: (routeId) => `/transport/routes/${routeId}/tracking`,
      providesTags: ['Transport'],
    }),

    // Generate transport report
    getTransportReport: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `/transport/report${queryString ? '?' + queryString : ''}`;
      },
      providesTags: ['Transport'],
    }),
  }),
});

export const {
  useGetRoutesQuery,
  useGetRouteByIdQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  usePatchRouteMutation,
  useDeleteRouteMutation,
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetDriversQuery,
  useGetDriverByIdQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useAssignStudentToRouteMutation,
  useGetRouteByStudentQuery,
  useGetTransportStatsQuery,
  useGetActiveRoutesQuery,
  useUploadGPSTrackingMutation,
  useGetRouteTrackingQuery,
  useGetTransportReportQuery,
} = transportApi;
