import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageContainer } from '../../components/Resuables';
import { requestPasswordReset } from '../../api/authAPI';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
      toast.success('Password reset email sent!');

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <PageContainer bg="admin">
        <div className="max-w-md mx-auto py-12 text-center">
          <div className="mb-4 text-5xl">✉️</div>
          <h1 className="text-2xl font-bold text-hmc-textprimary mb-2">
            Check Your Email
          </h1>
          <p className="text-hmc-textprimary/70 mb-4">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-hmc-textprimary/60 mb-6">
            The link expires in 30 minutes. If you don't see it, check your spam folder.
          </p>
          <p className="text-xs text-hmc-textprimary/50">
            Redirecting to login in 5 seconds...
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer bg="admin">
      <div className="max-w-md mx-auto py-12">
        <h1 className="text-3xl font-bold text-hmc-textprimary mb-2">
          Reset Password
        </h1>
        <p className="text-hmc-textprimary/70 mb-8">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 disabled:opacity-60 transition"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center pt-4">
            <a
              href="/login"
              className="text-sm text-hmc-link hover:underline"
            >
              Back to login
            </a>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
