import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fees: [],
  selectedFee: null,
  payments: [],
  filters: {
    search: '',
    status: '',
    classId: '',
  },
  loading: false,
  error: null,
};

const feeSlice = createSlice({
  name: 'fee',
  initialState,
  reducers: {
    setFees: (state, action) => {
      state.fees = action.payload;
    },
    setSelectedFee: (state, action) => {
      state.selectedFee = action.payload;
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
    setFeeFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFeeFilters: (state) => {
      state.filters = initialState.filters;
    },
    setFeeLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFeeError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFees,
  setSelectedFee,
  setPayments,
  setFeeFilters,
  clearFeeFilters,
  setFeeLoading,
  setFeeError,
} = feeSlice.actions;

export default feeSlice.reducer;
