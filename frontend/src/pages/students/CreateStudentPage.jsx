import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateStudentMutation } from '../../store/api/studentApi.js';
import { StudentForm } from '../../components/students/index.js';
import { Card } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function CreateStudentPage() {
  const navigate = useNavigate();
  const [createStudent, { isLoading }] = useCreateStudentMutation();

  const handleSubmit = async (formData) => {
    try {
      const response = await createStudent(formData).unwrap();
      toast.success('Student created successfully');
      navigate(`/students/${response.data._id}`);
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create student');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
        <p className="text-gray-600 mt-2">Register a new student in the system</p>
      </div>

      {/* Form */}
      <StudentForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreateStudentPage;
