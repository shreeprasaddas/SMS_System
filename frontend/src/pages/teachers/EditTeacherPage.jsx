import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetTeacherByIdQuery, useUpdateTeacherMutation } from '../../store/api/teacherApi.js';
import { TeacherForm } from '../../components/teachers/index.js';
import { Spinner } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function EditTeacherPage() {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { data, isLoading: isFetching } = useGetTeacherByIdQuery(teacherId);
  const [updateTeacher, { isLoading }] = useUpdateTeacherMutation();

  const handleSubmit = async (formData) => {
    try {
      await updateTeacher({ teacherId, ...formData }).unwrap();
      toast.success('Teacher updated successfully');
      navigate(`/teachers/${teacherId}`);
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update teacher');
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Teacher</h1>
        <p className="text-gray-600 mt-2">
          Update information for {data?.data?.firstName} {data?.data?.lastName}
        </p>
      </div>
      <TeacherForm
        initialData={data?.data}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditTeacherPage;
