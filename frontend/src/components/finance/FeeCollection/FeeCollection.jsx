import React, { useState } from 'react';
import { useGetStudentFeesQuery } from '@/store/api/feeApi.js';
import { Card, Spinner, Button } from '@/components/common';
import PaymentForm from './PaymentForm.jsx';

function FeeCollection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  
  const { data, isLoading, error } = useGetStudentFeesQuery(
    { search: searchTerm, limit: 20 },
    { skip: !searchTerm || searchTerm.length < 3 }
  );

  const studentFees = data?.data?.studentFees || data?.data || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Search & List */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Fee Collection</h2>
            <p className="text-sm text-gray-600">Search for a student to view their due fees and record payments.</p>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search by student name or roll number (min 3 chars)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : error ? (
            <div className="text-red-500 text-sm">Error fetching student fees.</div>
          ) : searchTerm.length >= 3 && studentFees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No matching records found.</div>
          ) : (
            <div className="space-y-4">
              {studentFees.map((fee) => (
                <div 
                  key={fee._id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedFeeId === fee._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300 bg-white'
                  }`}
                  onClick={() => setSelectedFeeId(fee._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {fee.student?.firstName} {fee.student?.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {fee.class?.name} • Roll: {fee.student?.rollNumber || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${fee.dueAmount?.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Due Amount</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      fee.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      fee.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                      fee.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {fee.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      Total: ${fee.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Right Column: Payment Form */}
      <div>
        {selectedFeeId ? (
          <PaymentForm studentFeeId={selectedFeeId} />
        ) : (
          <Card className="h-full flex flex-col items-center justify-center text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Select a Record</h3>
            <p className="text-sm text-gray-500 mt-2">
              Search and select a student fee record to record a new payment.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default FeeCollection;
