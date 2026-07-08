import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { signOut } from '../../api/authAPI';
import { setUser } from '../../store/userSlice';
import { PageContainer } from '../../components/Resuables';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      dispatch(setUser({}));
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-hmc-textprimary mb-8">Profile</h1>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-hmc-textprimary/70">Email</label>
              <p className="text-lg text-hmc-textprimary mt-1">{user?.email}</p>
            </div>

            {user?.full_name && (
              <div>
                <label className="text-sm font-semibold text-hmc-textprimary/70">Full Name</label>
                <p className="text-lg text-hmc-textprimary mt-1">{user.full_name}</p>
              </div>
            )}

            {user?.role && (
              <div>
                <label className="text-sm font-semibold text-hmc-textprimary/70">Role</label>
                <p className="text-lg text-hmc-textprimary mt-1 capitalize">{user.role}</p>
              </div>
            )}

            {user?.created_at && (
              <div>
                <label className="text-sm font-semibold text-hmc-textprimary/70">Member Since</label>
                <p className="text-lg text-hmc-textprimary mt-1">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="mt-8 px-6 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 disabled:opacity-60 transition"
          >
            {isLoading ? 'Signing Out...' : 'Logout'}
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
