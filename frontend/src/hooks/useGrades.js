import { useSelector, useDispatch } from 'react-redux';
import { setSelectedGrade, setTranscripts } from '@/store/slices/gradeSlice.js';
import {
  useGetGradesQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} from '@/store/api/gradeApi.js';

export const useGrades = (queryParams = {}) => {
  const dispatch = useDispatch();
  const gradeState = useSelector((state) => state.grade);

  const queryResults = useGetGradesQuery(queryParams);
  const [createGrade, createMeta] = useCreateGradeMutation();
  const [updateGrade, updateMeta] = useUpdateGradeMutation();
  const [deleteGrade, deleteMeta] = useDeleteGradeMutation();

  const selectGrade = (grade) => {
    dispatch(setSelectedGrade(grade));
  };

  const updateTranscriptsList = (list) => {
    dispatch(setTranscripts(list));
  };

  return {
    ...gradeState,
    ...queryResults,
    gradesList: queryResults.data?.data || [],
    createGrade,
    createMeta,
    updateGrade,
    updateMeta,
    deleteGrade,
    deleteMeta,
    setSelectedGrade: selectGrade,
    setTranscriptsList: updateTranscriptsList,
  };
};

export default useGrades;
