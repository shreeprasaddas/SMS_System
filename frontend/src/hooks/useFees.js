import { useSelector, useDispatch } from 'react-redux';
import {
  setFeeFilters,
  clearFeeFilters,
  setSelectedFee,
} from '@/store/slices/feeSlice.js';
import {
  useGetFeesQuery,
  useCreateFeeMutation,
  useUpdateFeeMutation,
  useDeleteFeeMutation,
} from '@/store/api/feeApi.js';

export const useFees = (filterOptions = {}) => {
  const dispatch = useDispatch();
  const feeState = useSelector((state) => state.fee);

  const queryParams = {
    search: feeState.filters.search,
    status: feeState.filters.status,
    classId: feeState.filters.classId,
    ...filterOptions,
  };

  const queryResults = useGetFeesQuery(queryParams);
  const [createFee, createMeta] = useCreateFeeMutation();
  const [updateFee, updateMeta] = useUpdateFeeMutation();
  const [deleteFee, deleteMeta] = useDeleteFeeMutation();

  const changeFilters = (newFilters) => {
    dispatch(setFeeFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(clearFeeFilters());
  };

  const selectFee = (fee) => {
    dispatch(setSelectedFee(fee));
  };

  return {
    ...feeState,
    ...queryResults,
    feesList: queryResults.data?.data || [],
    createFee,
    createMeta,
    updateFee,
    updateMeta,
    deleteFee,
    deleteMeta,
    setFilters: changeFilters,
    clearFilters,
    setSelectedFee: selectFee,
  };
};

export default useFees;
