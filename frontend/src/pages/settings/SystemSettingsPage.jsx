import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/common/index.js';
import { useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } from '@/store/api/settingsApi.js';
import toast from 'react-hot-toast';

function SystemSettingsPage() {
  const { data: settingsData, isLoading } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation();
  
  const [formData, setFormData] = useState({
    academicYear: '2023-2024',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    enableEmailNotifications: true,
    enableSMSNotifications: false,
  });

  useEffect(() => {
    if (settingsData?.data) {
      setFormData(settingsData.data);
    }
  }, [settingsData]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(formData).unwrap();
      toast.success('System settings updated successfully');
    } catch (error) {
      toast.error('Failed to update system settings');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-2 text-gray-600">Configure global application behaviors and localization.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Academic Year</label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="2022-2023">2022-2023</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <Input
              label="Timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
            />

            <Input
              label="Date Format"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Global Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enableEmailNotifications"
                  checked={formData.enableEmailNotifications}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Enable Email Notifications System-Wide</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enableSMSNotifications"
                  checked={formData.enableSMSNotifications}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Enable SMS Notifications System-Wide</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" variant="primary" loading={isUpdating}>
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SystemSettingsPage;
