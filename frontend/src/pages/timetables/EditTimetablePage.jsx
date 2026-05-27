import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTimetableByIdQuery, useUpdateTimetableMutation } from '@/store/api/timetableApi.js';
import { TimetableForm } from '@/components/timetables/index.js';
import { Spinner } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function EditTimetablePage() {
  const { timetableId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading: isFetching } = useGetTimetableByIdQuery(timetableId);
  const [updateTimetable, { isLoading }] = useUpdateTimetableMutation();

  const timetable = response?.data;

  const handleSubmit = async (data) => {
    try {
      await updateTimetable({ id: timetableId, ...data }).unwrap();
      toast.success('Timetable entry updated successfully');
      navigate('/timetables');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update timetable entry');
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
        <h1 className="text-3xl font-bold text-secondary-900">Edit Timetable Entry</h1>
        <p className="text-secondary-600 mt-1">{timetable?.subjectId} - {timetable?.classId}</p>
      </div>

      <TimetableForm
        initialData={timetable}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default EditTimetablePage;
