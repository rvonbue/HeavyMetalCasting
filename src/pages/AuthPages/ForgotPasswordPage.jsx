import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { PageContainer } from '../../components/Resuables';
import { requestPasswordReset } from '../../api/authAPI';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' },
  });

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      await requestPasswordReset(data.email);
      setSubmitted(true);
      toast.success('Password reset email sent!');

      // Redirect after 5 seconds
      setTimeout(() => {
        navigate('/create_account');
      }, 5000);
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
            Reset Password
          </h1>
          <p className="text-hmc-textprimary/70">
            Enter your email to receive a password reset link
          </p>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="mb-4 text-5xl">📧</div>
            <h2 className="text-xl font-bold text-hmc-textprimary mb-2">
              Check Your Email
            </h2>
            <p className="text-hmc-textprimary/70 mb-6">
              We've sent a password reset link to your email address. Click the link to reset your password.
            </p>
            <p className="text-sm text-hmc-textprimary/60 mb-6">
              The link expires in 1 hour. If you didn't receive it, check your spam folder.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/create_account')}
                className="w-full px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
              >
                Back to Sign In
              </button>
              <p className="text-xs text-hmc-textprimary/60">
                Redirecting in a few seconds...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
                    />
                    {errors.email && (
                      <p className="text-xs text-hmc-error mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 disabled:opacity-60 transition"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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
