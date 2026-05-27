import { useSelector, useDispatch } from 'react-redux';
import {
  setStudentFilters,
  clearStudentFilters,
  setSelectedStudent,
  setStudentPagination,
} from '@/store/slices/studentSlice.js';
import {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from '@/store/api/studentApi.js';

export const useStudents = (filterOptions = {}) => {
  const dispatch = useDispatch();
  const studentState = useSelector((state) => state.student);
  
  // Dynamic query using current filters from Redux state
  const queryParams = {
    page: studentState.pagination.page,
    limit: studentState.pagination.limit,
    search: studentState.filters.search,
    classId: studentState.filters.classId,
    status: studentState.filters.status,
    ...filterOptions,
  };

  const queryResults = useGetStudentsQuery(queryParams);
  const [createStudent, createMeta] = useCreateStudentMutation();
  const [updateStudent, updateMeta] = useUpdateStudentMutation();
  const [deleteStudent, deleteMeta] = useDeleteStudentMutation();

  const changeFilters = (newFilters) => {
    dispatch(setStudentFilters(newFilters));
    dispatch(setStudentPagination({ page: 1 })); // reset page on filter change
  };

  const clearFilters = () => {
    dispatch(clearStudentFilters());
  };

  const selectStudent = (student) => {
    dispatch(setSelectedStudent(student));
  };

  const changePage = (page) => {
    dispatch(setStudentPagination({ page }));
  };

  return {
    ...studentState,
    ...queryResults,
    studentsList: queryResults.data?.data || [],
    paginationMeta: queryResults.data?.pagination || studentState.pagination,
    createStudent,
    createMeta,
    updateStudent,
    updateMeta,
    deleteStudent,
    deleteMeta,
    setFilters: changeFilters,
    clearFilters,
    setSelectedStudent: selectStudent,
    setPage: changePage,
    useGetStudentByIdQuery, // Expose for detailed views
  };
};

export default useStudents;
