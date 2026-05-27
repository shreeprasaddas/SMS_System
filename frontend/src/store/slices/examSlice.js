import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exams: [],
  selectedExam: null,
  loading: false,
  error: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setExams: (state, action) => {
      state.exams = action.payload;
    },
    setSelectedExam: (state, action) => {
      state.selectedExam = action.payload;
    },
    setExamLoading: (state, action) => {
      state.loading = action.payload;
    },
    setExamError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setExams,
  setSelectedExam,
  setExamLoading,
  setExamError,
} = examSlice.actions;

export default examSlice.reducer;
