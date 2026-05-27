import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRegisterMutation } from '@/store/api/authApi.js';
import { Button, Input, Card } from '@/components/common/index.js';

function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { register: formRegister, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...submitData } = data;
      // The role is now selected via the form dropdown
      submitData.schoolId = '6a15d2c61b7c0a9ac910ec7f'; // Default school ObjectId
      await register(submitData).unwrap();
      toast.success('Registration successful! Please login.');
      navigate('/auth/login');
    } catch (error) {
      const message = error?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              error={errors.firstName?.message}
              {...formRegister('firstName', {
                required: 'First name is required',
              })}
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...formRegister('lastName', {
                required: 'Last name is required',
              })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role (Testing purposes)
            </label>
            <select
              {...formRegister('role', { required: 'Role is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              defaultValue="STUDENT"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
              <option value="PRINCIPAL">Principal</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            error={errors.email?.message}
            {...formRegister('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...formRegister('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...formRegister('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="mt-6 text-center text-secondary-600">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Login here
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
