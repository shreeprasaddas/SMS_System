import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button.jsx';
import Input from '@/components/common/Input.jsx';
import { useNotifications } from '@/hooks/useNotifications.js';

function OTPPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast('error', 'Please enter a valid 6-digit code');
      return;
    }
    setLoading(true);
    // Mimic API OTP verification
    setTimeout(() => {
      setLoading(false);
      toast('success', 'Authentication successful!');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-secondary-900 mb-2 text-center">Verify 2FA Code</h2>
      <p className="text-sm text-secondary-600 mb-6 text-center">
        Enter the 6-digit verification code from your authenticator app.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Verification Code"
          type="text"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="text-center tracking-widest text-lg font-mono"
          required
        />
        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Verify & Proceed
        </Button>
      </form>
    </div>
  );
}

export default OTPPage;
