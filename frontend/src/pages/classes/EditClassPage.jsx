import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClassByIdQuery, useUpdateClassMutation } from '@/store/api/classApi.js';
import { ClassForm } from '@/components/classes/index.js';
import { Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function EditClassPage() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { data: response, isLoading: isLoadingClass } = useGetClassByIdQuery(classId);
  const [updateClass, { isLoading }] = useUpdateClassMutation();

  const classData = response?.data;

  const handleSubmit = async (data) => {
    try {
      await updateClass({ id: classId, ...data }).unwrap();
      toast.success('Class updated successfully');
      navigate(`/classes/${classId}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update class');
    }
  };

  if (isLoadingClass) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Edit Class</h1>
        <p className="text-secondary-600 mt-1">Update class information</p>
      </div>

      <ClassForm 
        initialData={classData} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export default EditClassPage;
