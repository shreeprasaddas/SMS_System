import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRegisterMutation } from '../../store/api/authApi.js';
import { Button, Input, Card } from '../../components/common/index.js';

function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { register: formRegister, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...submitData } = data;
      // Add required backend fields
      submitData.role = 'STUDENT';
      submitData.schoolId = 'test-school';
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
