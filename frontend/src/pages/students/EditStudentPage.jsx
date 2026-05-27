import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetStudentByIdQuery, useUpdateStudentMutation } from '@/store/api/studentApi.js';
import { StudentForm } from '@/components/students/index.js';
import { Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function EditStudentPage() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { data, isLoading: isFetching } = useGetStudentByIdQuery(studentId);
  const [updateStudent, { isLoading }] = useUpdateStudentMutation();

  const handleSubmit = async (formData) => {
    try {
      await updateStudent({ studentId, ...formData }).unwrap();
      toast.success('Student updated successfully');
      navigate(`/students/${studentId}`);
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update student');
      throw error;
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
        <p className="text-gray-600 mt-2">
          Update information for {data?.data?.firstName} {data?.data?.lastName}
        </p>
      </div>

      {/* Form */}
      <StudentForm
        initialData={data?.data}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditStudentPage;
