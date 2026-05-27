import React, { useState } from 'react';
import { useGetFeeStructuresQuery, useCreateFeeStructureMutation } from '@/store/api/feeApi.js';
import { useGetClassesQuery } from '@/store/api/classApi.js';
import { Card, Spinner, Button } from '@/components/common';
import toast from 'react-hot-toast';

const FEE_TYPES = [
  { label: 'Tuition', value: 'TUITION' },
  { label: 'Transport', value: 'TRANSPORT' },
  { label: 'Examination', value: 'EXAMINATION' },
  { label: 'Library', value: 'LIBRARY' },
  { label: 'Sports', value: 'SPORTS' },
  { label: 'Development', value: 'DEVELOPMENT' },
  { label: 'Other', value: 'OTHER' },
];

const FREQUENCY_OPTIONS = [
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Half Yearly', value: 'HALF_YEARLY' },
  { label: 'Annual', value: 'ANNUAL' },
];

function FeeStructureList() {
  const { data, isLoading, error } = useGetFeeStructuresQuery();
  const { data: classesResponse } = useGetClassesQuery({ limit: 100 });
  const [createFeeStructure, { isLoading: isCreating }] = useCreateFeeStructureMutation();

  const structures = data?.data?.structures || data?.data || [];
  const classes = classesResponse?.data || [];

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    classId: '',
    feeComponents: [{ name: 'TUITION', amount: '', frequency: 'ANNUAL', dueDate: '' }],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComponentChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.feeComponents];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, feeComponents: updated };
    });
  };

  const addComponent = () => {
    setFormData((prev) => ({
      ...prev,
      feeComponents: [...prev.feeComponents, { name: 'TUITION', amount: '', frequency: 'ANNUAL', dueDate: '' }],
    }));
  };

  const removeComponent = (index) => {
    if (formData.feeComponents.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      feeComponents: prev.feeComponents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a fee structure name');
      return;
    }
    if (!formData.classId) {
      toast.error('Please select a class');
      return;
    }
    const hasAmount = formData.feeComponents.some((c) => Number(c.amount) > 0);
    if (!hasAmount) {
      toast.error('Please enter at least one fee amount');
      return;
    }

    try {
      const totalAmount = formData.feeComponents.reduce((sum, c) => sum + Number(c.amount || 0), 0);
      await createFeeStructure({
        name: formData.name,
        description: formData.description,
        classId: formData.classId,
        feeComponents: formData.feeComponents.map((c) => ({
          ...c,
          amount: Number(c.amount),
        })),
        totalAmount,
      }).unwrap();

      toast.success('Fee structure created successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        classId: '',
        feeComponents: [{ name: 'TUITION', amount: '', frequency: 'ANNUAL', dueDate: '' }],
      });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create fee structure');
    }
  };

  const computeTotal = (struct) => {
    if (struct.totalAmount) return struct.totalAmount;
    let total = 0;
    struct.classes?.forEach((c) =>
      c.sections?.forEach((s) =>
        s.fees?.forEach((f) => {
          total += f.amount || 0;
        })
      )
    );
    return total;
  };

  const getClassName = (struct) => {
    if (struct.class?.name) return struct.class.name;
    if (struct.classes?.[0]?.class?.name) return struct.classes[0].class.name;
    return 'All';
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Active Fee Structures</h2>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create Structure'}
        </Button>
      </div>

      {/* Inline Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-5">
          <h3 className="text-lg font-semibold text-gray-800">New Fee Structure</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Structure Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Annual Tuition Fee 2025-26"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <select
                value={formData.classId}
                onChange={(e) => handleChange('classId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Optional description..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Fee Components */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-800">Fee Components</label>
              <button
                type="button"
                onClick={addComponent}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                + Add Component
              </button>
            </div>
            <div className="space-y-3">
              {formData.feeComponents.map((comp, idx) => (
                <div key={idx} className="flex items-end gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Fee Type</label>
                    <select
                      value={comp.name}
                      onChange={(e) => handleComponentChange(idx, 'name', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                      {FEE_TYPES.map((ft) => (
                        <option key={ft.value} value={ft.value}>
                          {ft.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Amount *</label>
                    <input
                      type="number"
                      min="0"
                      value={comp.amount}
                      onChange={(e) => handleComponentChange(idx, 'amount', e.target.value)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                    <select
                      value={comp.frequency}
                      onChange={(e) => handleComponentChange(idx, 'frequency', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                      {FREQUENCY_OPTIONS.map((fo) => (
                        <option key={fo.value} value={fo.value}>
                          {fo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={comp.dueDate}
                      onChange={(e) => handleComponentChange(idx, 'dueDate', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  {formData.feeComponents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeComponent(idx)}
                      className="px-2 py-1.5 text-red-500 hover:text-red-700 text-sm font-bold"
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-right text-sm font-semibold text-gray-700">
              Total: ₹{formData.feeComponents.reduce((sum, c) => sum + Number(c.amount || 0), 0).toLocaleString()}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Save Fee Structure'}
            </Button>
          </div>
        </form>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Failed to load fee structures.
        </div>
      ) : structures.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No fee structures found. Create one to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {structures.map((struct) => (
                <tr key={struct._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{struct.name}</div>
                    <div className="text-sm text-gray-500">{struct.academicYear?.yearName || struct.academicYear?.name || 'Current Year'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getClassName(struct)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{computeTotal(struct).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      struct.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      struct.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      struct.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {struct.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default FeeStructureList;
