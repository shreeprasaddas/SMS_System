import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loginSuccess, logout } from '../slices/authSlice.js';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
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

export const financeApi = createApi({
  reducerPath: 'financeApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Budget', 'Expense', 'Income', 'Voucher', 'Report'],
  endpoints: (builder) => ({
    // ========== Budgets ==========
    getBudgets: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/finance/budgets?${query}`;
      },
      providesTags: ['Budget'],
    }),
    createBudget: builder.mutation({
      query: (data) => ({
        url: '/finance/budgets',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Budget'],
    }),

    // ========== Expenses ==========
    getExpenses: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/finance/expenses?${query}`;
      },
      providesTags: ['Expense'],
    }),
    recordExpense: builder.mutation({
      query: (data) => ({
        url: '/finance/expenses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Expense'],
    }),

    // ========== Income ==========
    getIncome: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/finance/income?${query}`;
      },
      providesTags: ['Income'],
    }),
    recordIncome: builder.mutation({
      query: (data) => ({
        url: '/finance/income',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Income'],
    }),

    // ========== Reports ==========
    getFinancialReport: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/finance/reports?${query}`;
      },
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useGetExpensesQuery,
  useRecordExpenseMutation,
  useGetIncomeQuery,
  useRecordIncomeMutation,
  useGetFinancialReportQuery,
} = financeApi;
