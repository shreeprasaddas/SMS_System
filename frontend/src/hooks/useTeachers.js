import { useSelector, useDispatch } from 'react-redux';
import {
  setTeacherFilters,
  clearTeacherFilters,
  setSelectedTeacher,
  setTeacherPagination,
} from '@/store/slices/teacherSlice.js';
import {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} from '@/store/api/teacherApi.js';

export const useTeachers = (filterOptions = {}) => {
  const dispatch = useDispatch();
  const teacherState = useSelector((state) => state.teacher);

  const queryParams = {
    page: teacherState.pagination.page,
    limit: teacherState.pagination.limit,
    search: teacherState.filters.search,
    status: teacherState.filters.status,
    subjectId: teacherState.filters.subjectId,
    ...filterOptions,
  };

  const queryResults = useGetTeachersQuery(queryParams);
  const [createTeacher, createMeta] = useCreateTeacherMutation();
  const [updateTeacher, updateMeta] = useUpdateTeacherMutation();
  const [deleteTeacher, deleteMeta] = useDeleteTeacherMutation();

  const changeFilters = (newFilters) => {
    dispatch(setTeacherFilters(newFilters));
    dispatch(setTeacherPagination({ page: 1 }));
  };

  const clearFilters = () => {
    dispatch(clearTeacherFilters());
  };

  const selectTeacher = (teacher) => {
    dispatch(setSelectedTeacher(teacher));
  };

  const changePage = (page) => {
    dispatch(setTeacherPagination({ page }));
  };

  return {
    ...teacherState,
    ...queryResults,
    teachersList: queryResults.data?.data || [],
    paginationMeta: queryResults.data?.pagination || teacherState.pagination,
    createTeacher,
    createMeta,
    updateTeacher,
    updateMeta,
    deleteTeacher,
    deleteMeta,
    setFilters: changeFilters,
    clearFilters,
    setSelectedTeacher: selectTeacher,
    setPage: changePage,
    useGetTeacherByIdQuery,
  };
};

export default useTeachers;
