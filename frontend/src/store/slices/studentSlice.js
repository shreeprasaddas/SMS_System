import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  selectedStudent: null,
  filters: {
    search: '',
    classId: '',
    status: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
    setStudentFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearStudentFilters: (state) => {
      state.filters = initialState.filters;
    },
    setStudentPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setStudentLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStudentError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStudents,
  setSelectedStudent,
  setStudentFilters,
  clearStudentFilters,
  setStudentPagination,
  setStudentLoading,
  setStudentError,
} = studentSlice.actions;

export default studentSlice.reducer;
