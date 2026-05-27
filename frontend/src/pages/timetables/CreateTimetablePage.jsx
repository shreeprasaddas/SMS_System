import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTimetableMutation } from '@/store/api/timetableApi.js';
import { TimetableForm } from '@/components/timetables/index.js';
import toast from 'react-hot-toast';

function CreateTimetablePage() {
  const navigate = useNavigate();
  const [createTimetable, { isLoading }] = useCreateTimetableMutation();

  const handleSubmit = async (data) => {
    try {
      const result = await createTimetable(data).unwrap();
      toast.success('Timetable entry created successfully');
      navigate('/timetables');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create timetable entry');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Add Timetable Entry</h1>
        <p className="text-secondary-600 mt-1">Create a new class schedule slot</p>
      </div>

      <TimetableForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default CreateTimetablePage;
