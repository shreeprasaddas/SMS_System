import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTeacherMutation } from '@/store/api/teacherApi.js';
import { TeacherForm } from '@/components/teachers/index.js';
import toast from 'react-hot-toast';

function CreateTeacherPage() {
  const navigate = useNavigate();
  const [createTeacher, { isLoading }] = useCreateTeacherMutation();

  const handleSubmit = async (formData) => {
    try {
      const response = await createTeacher(formData).unwrap();
      toast.success('Teacher created successfully');
      navigate(`/teachers/${response.data._id}`);
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create teacher');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Teacher</h1>
        <p className="text-gray-600 mt-2">Hire a new teacher to the system</p>
      </div>
      <TeacherForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreateTeacherPage;
