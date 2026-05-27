import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attendanceRecords: [],
  filters: {
    date: new Date().toISOString().split('T')[0],
    classId: '',
  },
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceRecords: (state, action) => {
      state.attendanceRecords = action.payload;
    },
    setAttendanceFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearAttendanceFilters: (state) => {
      state.filters = initialState.filters;
    },
    setAttendanceLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAttendanceError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAttendanceRecords,
  setAttendanceFilters,
  clearAttendanceFilters,
  setAttendanceLoading,
  setAttendanceError,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
