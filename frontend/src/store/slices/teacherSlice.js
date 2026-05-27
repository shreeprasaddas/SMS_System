import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teachers: [],
  selectedTeacher: null,
  filters: {
    search: '',
    status: '',
    subjectId: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setTeachers: (state, action) => {
      state.teachers = action.payload;
    },
    setSelectedTeacher: (state, action) => {
      state.selectedTeacher = action.payload;
    },
    setTeacherFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTeacherFilters: (state) => {
      state.filters = initialState.filters;
    },
    setTeacherPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setTeacherLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTeacherError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTeachers,
  setSelectedTeacher,
  setTeacherFilters,
  clearTeacherFilters,
  setTeacherPagination,
  setTeacherLoading,
  setTeacherError,
} = teacherSlice.actions;

export default teacherSlice.reducer;
