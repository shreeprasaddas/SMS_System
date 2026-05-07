import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSubjectByIdQuery, useUpdateSubjectMutation } from '../../store/api/subjectApi.js';
import { SubjectForm } from '../../components/subjects/index.js';
import { Spinner } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function EditSubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading: isFetching } = useGetSubjectByIdQuery(subjectId);
  const [updateSubject, { isLoading }] = useUpdateSubjectMutation();

  const subject = response?.data;

  const handleSubmit = async (data) => {
    try {
      await updateSubject({ id: subjectId, ...data }).unwrap();
      toast.success('Subject updated successfully');
      navigate(`/subjects/${subjectId}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update subject');
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
        <h1 className="text-3xl font-bold text-secondary-900">Edit Subject</h1>
        <p className="text-secondary-600 mt-1">{subject?.name}</p>
      </div>

      <SubjectForm
        initialData={subject}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditSubjectPage;
