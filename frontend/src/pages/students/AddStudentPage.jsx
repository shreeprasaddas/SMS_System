import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader/PageHeader.jsx';
import Card from '@/components/common/Card.jsx';
import Input from '@/components/common/Input.jsx';
import Select from '@/components/common/Select.jsx';
import Button from '@/components/common/Button.jsx';
import { useStudents } from '@/hooks/useStudents.js';
import { useNotifications } from '@/hooks/useNotifications.js';

function AddStudentPage() {
  const navigate = useNavigate();
  const { createStudent } = useStudents();
  const { toast } = useNotifications();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    classId: '',
    rollNumber: '',
    guardianName: '',
    guardianPhone: '',
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createStudent(formData).unwrap();
      toast('success', 'Student registered successfully!');
      navigate('/students');
    } catch (err) {
      toast('error', err?.data?.message || 'Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Student" subtitle="Enroll a new student in the system" />
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
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
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
              label="Roll Number"
              value={formData.rollNumber}
              onChange={(e) => handleChange('rollNumber', e.target.value)}
              required
            />
            <Input
              label="Guardian Name"
              value={formData.guardianName}
              onChange={(e) => handleChange('guardianName', e.target.value)}
              required
            />
            <Input
              label="Guardian Phone"
              value={formData.guardianPhone}
              onChange={(e) => handleChange('guardianPhone', e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
            <Button type="button" variant="outline" onClick={() => navigate('/students')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Create Student
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddStudentPage;
