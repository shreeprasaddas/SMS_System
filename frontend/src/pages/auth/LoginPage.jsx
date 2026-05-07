import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../../store/api/authApi.js';
import { loginSuccess } from '../../store/slices/authSlice.js';
import { Button, Input, Card } from '../../components/common/index.js';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      const { user, accessToken, refreshToken } = result.data;

      dispatch(
        loginSuccess({
          user,
          token: accessToken,
          refreshToken,
        })
      );

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = error?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            error={errors.email?.message}
            {...register('email', {
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
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 space-y-3 text-sm">
          <Link
            to="/auth/forgot-password"
            className="block text-center text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </Link>

          <p className="text-center text-secondary-600">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
