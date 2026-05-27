import React from 'react';
import { Card } from '@/components/common';

function StudentSummaryCard({ student }) {
  if (!student) return null;

  return (
    <Card className="mb-6 bg-white overflow-hidden p-0 border-0 shadow-sm">
      {/* Cover Image Area */}
      <div className="h-32 bg-primary-600 w-full relative">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden flex items-center justify-center shadow-md">
            {student.profilePicture ? (
              <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-600 text-3xl font-bold">
                {student.firstName?.[0]}{student.lastName?.[0]}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="pt-16 pb-6 px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h2>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                ID: {student.studentId || student.admissionNumber || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {student.class?.name || student.className || 'Class N/A'} - Section {student.section || 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
              student.status === 'INACTIVE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {student.status || 'ACTIVE'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StudentSummaryCard;
