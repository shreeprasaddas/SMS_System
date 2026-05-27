import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateExamMutation } from '@/store/api/examApi.js';
import { ExamForm } from '@/components/exams/index.js';
import toast from 'react-hot-toast';

function CreateExamPage() {
  const navigate = useNavigate();
  const [createExam, { isLoading }] = useCreateExamMutation();

  const handleSubmit = async (data) => {
    try {
      const result = await createExam(data).unwrap();
      toast.success('Exam created successfully');
      navigate(`/exams/${result.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create exam');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Create Exam</h1>
        <p className="text-secondary-600 mt-1">Schedule a new exam</p>
      </div>

      <ExamForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreateExamPage;
