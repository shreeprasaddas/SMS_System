import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateAssignmentMutation } from '@/store/api/assignmentApi.js';
import { AssignmentForm } from '@/components/assignments/index.js';
import toast from 'react-hot-toast';

function CreateAssignmentPage() {
  const navigate = useNavigate();
  const [createAssignment, { isLoading }] = useCreateAssignmentMutation();

  const handleSubmit = async (data) => {
    try {
      const result = await createAssignment(data).unwrap();
      toast.success('Assignment created successfully');
      navigate(`/assignments/${result.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create assignment');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Create Assignment</h1>
        <p className="text-secondary-600 mt-1">Create a new assignment for students</p>
      </div>

      <AssignmentForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreateAssignmentPage;
