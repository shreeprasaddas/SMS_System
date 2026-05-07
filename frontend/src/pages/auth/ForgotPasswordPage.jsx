import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForgotPasswordMutation } from '../../store/api/authApi.js';
import { Button, Input, Card } from '../../components/common/index.js';

function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      toast.success('Check your email for password reset instructions.');
    } catch (error) {
      const message = error?.data?.message || 'Failed to send reset email.';
      toast.error(message);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Forgot Password</h2>
        <p className="text-secondary-600 text-sm mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

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

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center text-secondary-600">
          <Link
            to="/auth/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
