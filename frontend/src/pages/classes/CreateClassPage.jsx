import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateClassMutation } from '@/store/api/classApi.js';
import { ClassForm } from '@/components/classes/index.js';
import toast from 'react-hot-toast';

function CreateClassPage() {
  const navigate = useNavigate();
  const [createClass, { isLoading }] = useCreateClassMutation();

  const handleSubmit = async (data) => {
    try {
      const result = await createClass(data).unwrap();
      toast.success('Class created successfully');
      navigate(`/classes/${result.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create class');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Add New Class</h1>
        <p className="text-secondary-600 mt-1">Create a new class in the system</p>
      </div>

      <ClassForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreateClassPage;
