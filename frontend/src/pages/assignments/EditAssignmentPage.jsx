import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAssignmentByIdQuery, useUpdateAssignmentMutation } from '../../store/api/assignmentApi.js';
import { AssignmentForm } from '../../components/assignments/index.js';
import { Spinner } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function EditAssignmentPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading: isFetching } = useGetAssignmentByIdQuery(assignmentId);
  const [updateAssignment, { isLoading }] = useUpdateAssignmentMutation();

  const assignment = response?.data;

  const handleSubmit = async (data) => {
    try {
      await updateAssignment({ id: assignmentId, ...data }).unwrap();
      toast.success('Assignment updated successfully');
      navigate(`/assignments/${assignmentId}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update assignment');
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
        <h1 className="text-3xl font-bold text-secondary-900">Edit Assignment</h1>
        <p className="text-secondary-600 mt-1">{assignment?.title}</p>
      </div>

      <AssignmentForm
        initialData={assignment}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditAssignmentPage;
