import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageContainer } from '../../components/Resuables';
import { verifyEmail } from '../../api/authAPI';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('Invalid verification link - missing token');
        setIsLoading(false);
        return;
      }

      try {
        const result = await verifyEmail(token);
        setIsVerified(true);
        toast.success('Email verified successfully!');

        // Redirect to shop after 3 seconds
        setTimeout(() => {
          navigate('/shop');
        }, 3000);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate]);

  return (
    <PageContainer bg="admin">
      <div className="max-w-md mx-auto py-12 text-center">
        {isLoading ? (
          <div>
            <div className="mb-4 text-4xl">✉️</div>
            <h1 className="text-2xl font-bold text-hmc-textprimary mb-2">
              Verifying Email...
            </h1>
            <p className="text-hmc-textprimary/70">
              Please wait while we verify your email address.
            </p>
          </div>
        ) : isVerified ? (
          <div>
            <div className="mb-4 text-5xl">✓</div>
            <h1 className="text-2xl font-bold text-hmc-textprimary mb-2">
              Email Verified!
            </h1>
            <p className="text-hmc-textprimary/70 mb-6">
              Your account is ready to go. Redirecting to shop...
            </p>
            <div className="text-sm text-hmc-textprimary/60">
              If not redirected in a few seconds,{' '}
              <button
                onClick={() => navigate('/shop')}
                className="text-hmc-link hover:underline font-semibold"
              >
                click here
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-5xl">✗</div>
            <h1 className="text-2xl font-bold text-hmc-error mb-2">
              Verification Failed
            </h1>
            <p className="text-hmc-textprimary/70 mb-6">
              {error || 'There was an issue verifying your email.'}
            </p>
            <button
              onClick={() => navigate('/create_account')}
              className="px-6 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
