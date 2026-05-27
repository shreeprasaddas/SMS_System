import React, { useState } from 'react';
import { Card, Button } from '@/components/common/index.js';
import FeeStructureList from '@/components/finance/FeeStructure/FeeStructureList.jsx';
import FeeCollection from '@/components/finance/FeeCollection/FeeCollection.jsx';

function FeesPage() {
  const [activeTab, setActiveTab] = useState('structures');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600 mt-2">Manage fee structures and student fee collections</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'structures'
              ? 'border-primary-600 text-primary-600 bg-primary-50 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('structures')}
        >
          Fee Structures
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'collection'
              ? 'border-primary-600 text-primary-600 bg-primary-50 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('collection')}
        >
          Fee Collection
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'structures' && <FeeStructureList />}
        {activeTab === 'collection' && <FeeCollection />}
      </div>
    </div>
  );
}

export default FeesPage;
