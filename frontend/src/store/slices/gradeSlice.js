import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grades: [],
  selectedGrade: null,
  transcripts: [],
  loading: false,
  error: null,
};

const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {
    setGrades: (state, action) => {
      state.grades = action.payload;
    },
    setSelectedGrade: (state, action) => {
      state.selectedGrade = action.payload;
    },
    setTranscripts: (state, action) => {
      state.transcripts = action.payload;
    },
    setGradeLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGradeError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGrades,
  setSelectedGrade,
  setTranscripts,
  setGradeLoading,
  setGradeError,
} = gradeSlice.actions;

export default gradeSlice.reducer;
