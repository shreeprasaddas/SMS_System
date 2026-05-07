import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetExamByIdQuery, useUpdateExamMutation } from '../../store/api/examApi.js';
import { ExamForm } from '../../components/exams/index.js';
import { Spinner } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function EditExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading: isFetching } = useGetExamByIdQuery(examId);
  const [updateExam, { isLoading }] = useUpdateExamMutation();

  const exam = response?.data;

  const handleSubmit = async (data) => {
    try {
      await updateExam({ id: examId, ...data }).unwrap();
      toast.success('Exam updated successfully');
      navigate(`/exams/${examId}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update exam');
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Edit Exam</h1>
        <p className="text-secondary-600 mt-1">{exam?.name}</p>
      </div>

      <ExamForm
        initialData={exam}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditExamPage;
