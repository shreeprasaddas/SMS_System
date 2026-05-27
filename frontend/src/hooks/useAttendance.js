import { useSelector, useDispatch } from 'react-redux';
import {
  setAttendanceFilters,
  clearAttendanceFilters,
} from '@/store/slices/attendanceSlice.js';
import {
  useGetAttendanceQuery,
  useUpdateAttendanceMutation,
  useMarkAttendanceMutation,
} from '@/store/api/attendanceApi.js';

export const useAttendance = (filterOptions = {}) => {
  const dispatch = useDispatch();
  const attendanceState = useSelector((state) => state.attendance);

  const queryParams = {
    date: attendanceState.filters.date,
    classId: attendanceState.filters.classId,
    ...filterOptions,
  };

  const queryResults = useGetAttendanceQuery(queryParams);
  const [markAttendance, markMeta] = useMarkAttendanceMutation();
  const [updateAttendance, updateMeta] = useUpdateAttendanceMutation();

  const changeFilters = (newFilters) => {
    dispatch(setAttendanceFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(clearAttendanceFilters());
  };

  return {
    ...attendanceState,
    ...queryResults,
    recordsList: queryResults.data?.data || [],
    markAttendance,
    markMeta,
    updateAttendance,
    updateMeta,
    setFilters: changeFilters,
    clearFilters,
  };
};

export default useAttendance;
