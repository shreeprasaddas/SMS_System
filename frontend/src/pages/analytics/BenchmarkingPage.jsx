import React from 'react';
import { Card } from '@/components/common/index.js';

function BenchmarkingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">School Benchmarking</h1>
        <p className="mt-2 text-gray-600">Compare internal performance against regional or national standards</p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Standardized Test Scores vs. National Average</h2>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200">
          <span className="text-gray-400">Comparison Bar Chart Placeholder</span>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border border-blue-100">
          <h3 className="font-semibold text-blue-900">Math Proficiency</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-700">82%</span>
            <span className="text-sm text-green-600 font-medium">+5% vs National</span>
          </div>
        </Card>
        
        <Card className="bg-purple-50 border border-purple-100">
          <h3 className="font-semibold text-purple-900">Science Proficiency</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-purple-700">76%</span>
            <span className="text-sm text-red-500 font-medium">-2% vs National</span>
          </div>
        </Card>
        
        <Card className="bg-green-50 border border-green-100">
          <h3 className="font-semibold text-green-900">Reading Proficiency</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-700">88%</span>
            <span className="text-sm text-green-600 font-medium">+10% vs National</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default BenchmarkingPage;
