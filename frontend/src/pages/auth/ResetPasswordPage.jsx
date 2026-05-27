import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '@/store/api/authApi.js';
import { Button, Input, Card } from '@/components/common/index.js';

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...submitData } = data;
      await resetPassword({
        ...submitData,
        token,
      }).unwrap();

      toast.success('Password reset successful! Please login with your new password.');
      navigate('/auth/login');
    } catch (error) {
      const message = error?.data?.message || 'Failed to reset password.';
      toast.error(message);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Reset Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            error={errors.password?.message}
            {...register('password', {
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
            {...register('confirmPassword', {
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
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
