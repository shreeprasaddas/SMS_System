import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/common/index.js';
import { useGetSchoolProfileQuery, useUpdateSchoolProfileMutation } from '@/store/api/settingsApi.js';
import toast from 'react-hot-toast';

function SchoolProfilePage() {
  const { data: profileData, isLoading } = useGetSchoolProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateSchoolProfileMutation();
  
  const [formData, setFormData] = useState({
    schoolName: '',
    registrationNumber: '',
    establishedYear: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    website: '',
  });

  useEffect(() => {
    if (profileData?.data) {
      setFormData(profileData.data);
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      toast.success('School profile updated successfully');
    } catch (error) {
      toast.error('Failed to update school profile');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">School Profile</h1>
        <p className="mt-2 text-gray-600">Manage your institution's public identity and contact details.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="School Name"
              name="schoolName"
              value={formData.schoolName || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber || ''}
              onChange={handleChange}
            />
            <Input
              label="Established Year"
              name="establishedYear"
              type="number"
              value={formData.establishedYear || ''}
              onChange={handleChange}
            />
            <Input
              label="Contact Email"
              name="contactEmail"
              type="email"
              value={formData.contactEmail || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Contact Phone"
              name="contactPhone"
              value={formData.contactPhone || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Website"
              name="website"
              type="url"
              value={formData.website || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" variant="primary" loading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SchoolProfilePage;
