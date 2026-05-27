import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/common/index.js';
import { useGetUserProfileQuery, useUpdateUserProfileMutation, useChangePasswordMutation } from '@/store/api/userApi.js';
import toast from 'react-hot-toast';

function UserProfilePage() {
  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (profileData?.data) {
      setProfileForm({
        firstName: profileData.data.firstName || '',
        lastName: profileData.data.lastName || '',
        email: profileData.data.email || '',
        phone: profileData.data.phone || '',
      });
    }
  }, [profileData]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm).unwrap();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }).unwrap();
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your profile...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={profileForm.firstName}
                  onChange={handleProfileChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={profileForm.lastName}
                  onChange={handleProfileChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                  disabled
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" loading={isUpdating}>
                  Update Profile
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Security / Password */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" loading={isChangingPassword} className="w-full">
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
