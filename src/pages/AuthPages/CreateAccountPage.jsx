import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { PageContainer } from '../../components/Resuables';
import { signUpWithEmail, signInWithOAuth } from '../../api/authAPI';

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signup'); // 'signup' or 'signin'
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  const password = watch('password');

  async function onSubmitSignUp(data) {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpWithEmail(data.email, data.password, data.fullName);
      toast.success(result.message);

      // Show verification message and redirect to shop after 3 seconds
      setTimeout(() => {
        navigate('/shop', {
          state: {
            showVerificationNotice: true,
            email: data.email,
          },
        });
      }, 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider) {
    setIsLoading(true);
    try {
      const result = await signInWithOAuth(provider);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  return (
    <PageContainer bg="admin">
      <div className="max-w-md mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-hmc-textprimary mb-2">
            Heavy Metal Casting
          </h1>
          <p className="text-hmc-textprimary/70">Join our community</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-hmc-border-a">
          <button
            onClick={() => setActiveTab('signup')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'signup'
                ? 'text-hmc-textprimary border-b-2 border-hmc-button-a'
                : 'text-hmc-textprimary/60 hover:text-hmc-textprimary'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setActiveTab('signin')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'signin'
                ? 'text-hmc-textprimary border-b-2 border-hmc-button-a'
                : 'text-hmc-textprimary/60 hover:text-hmc-textprimary'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Social Login Logos (Both Tabs) */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-16 h-16 flex items-center justify-center border border-hmc-border-a rounded hover:bg-hmc-button-a/10 transition disabled:opacity-60"
            title="Sign in with Google"
          >
            <img src="/logos/google.png" alt="Google" className="w-12 h-12 object-contain" />
          </button>

          <button
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
            className="w-16 h-16 flex items-center justify-center border border-hmc-border-a rounded hover:bg-hmc-button-a/10 transition disabled:opacity-60"
            title="Sign in with Facebook"
          >
            <img src="/logos/facebook.png" alt="Facebook" className="w-12 h-12 object-contain" />
          </button>

          <button
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
            className="w-16 h-16 flex items-center justify-center border border-hmc-border-a rounded hover:bg-hmc-button-a/10 transition disabled:opacity-60"
            title="Sign in with Apple"
          >
            <img src="/logos/apple.png" alt="Apple" className="w-12 h-12 object-contain" />
          </button>

          <button
            onClick={() => handleSocialLogin('discord')}
            disabled={isLoading}
            className="w-16 h-16 flex items-center justify-center border border-hmc-border-a rounded hover:bg-hmc-button-a/10 transition disabled:opacity-60"
            title="Sign in with Discord"
          >
            <img src="/logos/discord.png" alt="Discord" className="w-12 h-12 object-contain" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-hmc-border-a"></div>
          <span className="text-sm text-hmc-textprimary/60">or</span>
          <div className="flex-1 h-px bg-hmc-border-a"></div>
        </div>

        {/* Email/Password Form */}
        {activeTab === 'signup' ? (
          <form onSubmit={handleSubmit(onSubmitSignUp)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
                Full Name
              </label>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
                Email
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
                      <p className="text-xs text-hmc-error mt-1">{errors.email.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
                Password
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-xs text-hmc-textprimary/70 text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        ) : (
          <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
        )}
      </div>
    </PageContainer>
  );
}

function SignInForm({ isLoading, setIsLoading }) {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  async function onSubmitSignIn(data) {
    setIsLoading(true);
    try {
      const { signInWithEmail } = await import('../../api/authAPI');
      const result = await signInWithEmail(data.email, data.password);
      toast.success('Signed in successfully');
      navigate('/shop');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitSignIn)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
          Email
        </label>
        <Controller
          name="email"
          control={control}
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
              />
              {errors.email && (
                <p className="text-xs text-hmc-error mt-1">{errors.email.message}</p>
              )}
            </>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
          Password
        </label>
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Password is required' }}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
              />
              {errors.password && (
                <p className="text-xs text-hmc-error mt-1">{errors.password.message}</p>
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
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>

      <div className="text-center">
        <a href="/forgot-password" className="text-sm text-hmc-link hover:underline">
          Forgot password?
        </a>
      </div>
    </form>
  );
}
