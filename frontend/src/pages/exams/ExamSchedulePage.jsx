import React, { useState } from 'react';
import { useGetExamScheduleQuery, usePublishExamResultsMutation } from '@/store/api/examApi.js';
import { Card, Spinner, Button } from '@/components/common/index.js';
import toast from 'react-hot-toast';

function ExamSchedulePage() {
  const { data: response, isLoading } = useGetExamScheduleQuery();
  const [publishResults] = usePublishExamResultsMutation();
  const [selectedExam, setSelectedExam] = useState(null);

  const schedule = response?.data || [];

  const handlePublishResults = async (examId) => {
    if (window.confirm('Are you sure you want to publish results for this exam?')) {
      try {
        await publishResults(examId).unwrap();
        toast.success('Results published successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to publish results');
      }
    }
  };

  const groupedSchedule = schedule.reduce((acc, exam) => {
    const date = new Date(exam.examDate).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(exam);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Exam Schedule</h1>
        <p className="text-secondary-600 mt-1">View and manage exam schedule</p>
      </div>

      {/* Schedule by Date */}
      <div className="space-y-6">
        {Object.entries(groupedSchedule).map(([date, exams]) => (
          <Card key={date}>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">{date}</h3>
            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="flex justify-between items-start p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-900">{exam.name}</h4>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-secondary-600">Subject</p>
                        <p className="text-secondary-900 font-medium">{exam.subjectId}</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Class</p>
                        <p className="text-secondary-900 font-medium">{exam.classId}</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Time</p>
                        <p className="text-secondary-900 font-medium">
                          {exam.startTime} - {exam.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Duration</p>
                        <p className="text-secondary-900 font-medium">{exam.duration} min</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Max Marks</p>
                        <p className="text-secondary-900 font-medium">{exam.totalMarks}</p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Status</p>
                        <p className={`font-medium ${
                          exam.status === 'COMPLETED' ? 'text-green-600' :
                          exam.status === 'ONGOING' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {exam.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setSelectedExam(exam._id)}
                      className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium"
                    >
                      View Details
                    </button>
                    {exam.status === 'COMPLETED' && (
                      <button
                        onClick={() => handlePublishResults(exam._id)}
                        className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium"
                      >
                        Publish Results
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {schedule.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-secondary-600 mb-4">No scheduled exams</p>
            <Button variant="primary">
              Create First Exam
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ExamSchedulePage;
