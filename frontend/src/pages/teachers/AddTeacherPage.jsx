import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Input from '@/components/common/Input.jsx';
import Select from '@/components/common/Select.jsx';
import Button from '@/components/common/Button.jsx';
import { useTeachers } from '@/hooks/useTeachers.js';
import { useNotifications } from '@/hooks/useNotifications.js';

function AddTeacherPage() {
  const navigate = useNavigate();
  const { createTeacher } = useTeachers();
  const { toast } = useNotifications();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    qualification: '',
    designation: '',
    joiningDate: '',
    salary: '',
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTeacher(formData).unwrap();
      toast('success', 'Teacher registered successfully!');
      navigate('/teachers');
    } catch (err) {
      toast('error', err?.data?.message || 'Failed to register teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Teacher" subtitle="Register a new teacher in the system" />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(val) => handleChange('gender', val)}
              options={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]}
              required
            />
            <Input
              label="Qualification"
              value={formData.qualification}
              onChange={(e) => handleChange('qualification', e.target.value)}
              required
            />
            <Input
              label="Designation"
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              required
            />
            <Input
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => handleChange('joiningDate', e.target.value)}
              required
            />
            <Input
              label="Salary"
              type="number"
              value={formData.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
            <Button type="button" variant="outline" onClick={() => navigate('/teachers')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Create Teacher
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddTeacherPage;
