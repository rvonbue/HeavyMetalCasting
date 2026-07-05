import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { PageContainer } from '../../components/Resuables';
import { resetPassword } from '../../api/authAPI';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password');

  async function onSubmit(data) {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(data.password);
      setIsReset(true);
      toast.success('Password reset successfully!');

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/create_account');
      }, 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageContainer bg="admin">
      <div className="max-w-md mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-hmc-textprimary mb-2">
            Create New Password
          </h1>
          <p className="text-hmc-textprimary/70">
            Enter your new password below
          </p>
        </div>

        {isReset ? (
          <div className="text-center">
            <div className="mb-4 text-5xl">✓</div>
            <h2 className="text-xl font-bold text-hmc-textprimary mb-2">
              Password Reset
            </h2>
            <p className="text-hmc-textprimary/70 mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate('/create_account')}
              className="w-full px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
            >
              Sign In
            </button>
            <p className="text-xs text-hmc-textprimary/60 mt-4">
              Redirecting in a few seconds...
            </p>
          </div>
        ) : (
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
                      className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
                    />
                    {errors.password && (
                      <p className="text-xs text-hmc-error mt-1">
                        {errors.password.message}
                      </p>
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
                  <input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
                  />
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 disabled:opacity-60 transition"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/create_account')}
                className="text-sm text-hmc-link hover:underline font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </PageContainer>
  );
}
