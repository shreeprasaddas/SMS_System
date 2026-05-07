import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAssignmentSubmissionsQuery, useGradeSubmissionMutation } from '../../store/api/assignmentApi.js';
import { Card, Spinner, Button } from '../../components/common/index.js';
import toast from 'react-hot-toast';

function GradeSubmissionsPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetAssignmentSubmissionsQuery(assignmentId);
  const [gradeSubmission] = useGradeSubmissionMutation();
  const [grades, setGrades] = useState({});
  const [feedback, setFeedback] = useState({});

  const submissions = response?.data || [];

  const handleGrade = async (submissionId) => {
    if (!grades[submissionId]) {
      toast.error('Please enter marks');
      return;
    }

    try {
      await gradeSubmission({
        assignmentId,
        submissionId,
        marks: parseFloat(grades[submissionId]),
        feedback: feedback[submissionId] || '',
      }).unwrap();
      toast.success('Submission graded successfully');
      setGrades(prev => ({ ...prev, [submissionId]: '' }));
      setFeedback(prev => ({ ...prev, [submissionId]: '' }));
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to grade submission');
    }
  };

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Grade Submissions</h1>
          <p className="text-secondary-600 mt-1">Assignment #{assignmentId}</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate(`/assignments/${assignmentId}`)}
        >
          Back
        </Button>
      </div>

      {/* Submissions Table */}
      {submissions.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Submitted</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Marks</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Feedback</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="px-4 py-3 text-sm text-secondary-900">{submission.studentName}</td>
                    <td className="px-4 py-3 text-sm text-secondary-600">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={grades[submission._id] || ''}
                        onChange={(e) => setGrades(prev => ({
                          ...prev,
                          [submission._id]: e.target.value
                        }))}
                        className="w-20 px-2 py-1 border border-secondary-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Feedback (optional)"
                        value={feedback[submission._id] || ''}
                        onChange={(e) => setFeedback(prev => ({
                          ...prev,
                          [submission._id]: e.target.value
                        }))}
                        className="w-32 px-2 py-1 border border-secondary-300 rounded text-sm focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleGrade(submission._id)}
                        className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded text-sm font-medium transition-colors"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-center py-8 text-secondary-600">No submissions to grade</p>
        </Card>
      )}
    </div>
  );
}

export default GradeSubmissionsPage;
