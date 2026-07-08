import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { PageContainer } from '../../components/Resuables';
import { resetPasswordWithToken, validateResetToken } from '../../api/authAPI';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const token = searchParams.get('token');

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password');

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateResetToken(token);
        setIsValid(result.valid);
      } catch (error) {
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [token]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsResetting(true);
    try {
      await resetPasswordWithToken(token, data.password);
      toast.success('Password reset successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  if (isValidating) {
    return (
      <PageContainer bg="admin">
        <div className="max-w-md mx-auto py-12 text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-hmc-textprimary">Validating reset link...</p>
        </div>
      </PageContainer>
    );
  }

  if (!isValid) {
    return (
      <PageContainer bg="admin">
        <div className="max-w-md mx-auto py-12 text-center">
          <div className="mb-4 text-5xl">✗</div>
          <h1 className="text-2xl font-bold text-hmc-error mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-hmc-textprimary/70 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="px-6 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
          >
            Request New Link
          </button>
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
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
              New Password
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isResetting}
                    className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
                  />
                  {errors.password && (
                    <p className="text-xs text-hmc-error mt-1">{errors.password.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Please confirm your password',
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={isResetting}
                    className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-hmc-error mt-1">{errors.confirmPassword.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isResetting}
            className="w-full px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 disabled:opacity-60 transition"
          >
            {isResetting ? 'Resetting...' : 'Reset Password'}
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
