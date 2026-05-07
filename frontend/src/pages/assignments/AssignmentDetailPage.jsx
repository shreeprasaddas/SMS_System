import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAssignmentByIdQuery, useGetAssignmentSubmissionsQuery } from '../../store/api/assignmentApi.js';
import { Card, Spinner, Button } from '../../components/common/index.js';

function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetAssignmentByIdQuery(assignmentId);
  const { data: submissionsResponse } = useGetAssignmentSubmissionsQuery(assignmentId);

  const assignment = response?.data;
  const submissions = submissionsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        Assignment not found
      </div>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">{assignment.title}</h1>
          <p className="text-secondary-600 mt-1">{assignment.subjectId} • {assignment.classId}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            onClick={() => navigate(`/assignments/${assignmentId}/edit`)}
          >
            Edit Assignment
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/assignments')}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Description</h3>
            <p className="text-secondary-600 leading-relaxed">{assignment.description}</p>
          </Card>

          {assignment.instructions && (
            <Card>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Instructions</h3>
              <p className="text-secondary-600 whitespace-pre-wrap">{assignment.instructions}</p>
            </Card>
          )}

          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Assignment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-600 font-medium">Class</p>
                <p className="text-secondary-900">{assignment.classId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Subject</p>
                <p className="text-secondary-900">{assignment.subjectId}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Type</p>
                <p className="text-secondary-900">{assignment.assignmentType}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Total Marks</p>
                <p className="text-secondary-900">{assignment.totalMarks}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Due Date</p>
                <p className={isOverdue ? 'text-red-600 font-semibold' : 'text-secondary-900'}>
                  {new Date(assignment.dueDate).toLocaleDateString()}
                  {isOverdue && <span className="ml-2">(Overdue)</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 font-medium">Status</p>
                <p className="text-secondary-900">{assignment.status}</p>
              </div>
            </div>
          </Card>

          {/* Submissions List */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Submissions ({submissions.length})
            </h3>
            {submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="p-4 bg-secondary-50 rounded-lg border border-secondary-200 hover:border-secondary-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-secondary-900">{submission.studentName}</p>
                        <p className="text-sm text-secondary-600">
                          Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {submission.marks !== undefined && (
                          <p className="font-semibold text-secondary-900">
                            {submission.marks}/{assignment.totalMarks}
                          </p>
                        )}
                        {submission.status === 'SUBMITTED' && !submission.marks && (
                          <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-bold">
                            Pending Grading
                          </span>
                        )}
                        {submission.status === 'GRADED' && (
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">
                            Graded
                          </span>
                        )}
                      </div>
                    </div>
                    {submission.feedback && (
                      <p className="text-sm text-secondary-600 mt-2 pt-2 border-t border-secondary-200">
                        {submission.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-600">No submissions yet</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Total Students</span>
                <span className="font-semibold text-secondary-900">{assignment.studentCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Submitted</span>
                <span className="font-semibold text-secondary-900">{submissions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Graded</span>
                <span className="font-semibold text-secondary-900">
                  {submissions.filter(s => s.status === 'GRADED').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Pending</span>
                <span className="font-semibold text-secondary-900">
                  {submissions.filter(s => s.status === 'SUBMITTED' && !s.marks).length}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/assignments/${assignmentId}/submissions`)}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
              >
                View All Submissions
              </button>
              <button
                onClick={() => navigate(`/assignments/${assignmentId}/grade`)}
                className="w-full px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
              >
                Grade Submissions
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetailPage;
