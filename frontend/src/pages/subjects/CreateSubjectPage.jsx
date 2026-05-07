import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateSubjectMutation } from '../../store/api/subjectApi.js';
import { SubjectForm } from '../../components/subjects/index.js';
import toast from 'react-hot-toast';

function CreateSubjectPage() {
  const navigate = useNavigate();
  const [createSubject, { isLoading }] = useCreateSubjectMutation();

  const handleSubmit = async (data) => {
    try {
      const result = await createSubject(data).unwrap();
      toast.success('Subject created successfully');
      navigate(`/subjects/${result.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create subject');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Create Subject</h1>
        <p className="text-secondary-600 mt-1">Add a new subject to the system</p>
      </div>

      <SubjectForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreateSubjectPage;
