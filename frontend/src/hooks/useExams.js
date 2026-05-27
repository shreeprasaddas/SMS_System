import { useSelector, useDispatch } from 'react-redux';
import { setSelectedExam } from '@/store/slices/examSlice.js';
import {
  useGetExamsQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
} from '@/store/api/examApi.js';

export const useExams = (queryParams = {}) => {
  const dispatch = useDispatch();
  const examState = useSelector((state) => state.exam);

  const queryResults = useGetExamsQuery(queryParams);
  const [createExam, createMeta] = useCreateExamMutation();
  const [updateExam, updateMeta] = useUpdateExamMutation();
  const [deleteExam, deleteMeta] = useDeleteExamMutation();

  const selectExam = (exam) => {
    dispatch(setSelectedExam(exam));
  };

  return {
    ...examState,
    ...queryResults,
    examsList: queryResults.data?.data || [],
    createExam,
    createMeta,
    updateExam,
    updateMeta,
    deleteExam,
    deleteMeta,
    setSelectedExam: selectExam,
  };
};

export default useExams;
