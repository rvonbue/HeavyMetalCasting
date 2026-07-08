import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Select from 'react-select';
import { signOut } from '../../api/authAPI';
import { setUser } from '../../store/userSlice';
import { PageContainer } from '../../components/Resuables';
import { supabase } from '../../lib/supabase';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState('light');
  const [unsubscribeMarketing, setUnsubscribeMarketing] = useState(false);
  const [hasOrders, setHasOrders] = useState(false);

  useEffect(() => {
    if (user?.id) {
      checkUserOrders();
      loadUserPreferences();
    }
  }, [user?.id]);

  const checkUserOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .limit(1);

      if (error) throw error;
      setHasOrders(data && data.length > 0);
    } catch (error) {
      console.error('Error checking orders:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('theme, unsubscribe_marketing')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setTheme(data.theme || 'light');
        setUnsubscribeMarketing(data.unsubscribe_marketing || false);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleThemeChange = async (option) => {
    setTheme(option.value);
    try {
      const { error } = await supabase
        .from('users')
        .update({ theme: option.value })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Theme updated');
    } catch (error) {
      toast.error('Failed to update theme');
      setTheme(theme);
    }
  };

  const handleMarketingToggle = async () => {
    const newValue = !unsubscribeMarketing;
    setUnsubscribeMarketing(newValue);
    try {
      const { error } = await supabase
        .from('users')
        .update({ unsubscribe_marketing: newValue })
        .eq('id', user.id);

      if (error) throw error;
      toast.success(newValue ? 'Unsubscribed from marketing' : 'Subscribed to marketing');
    } catch (error) {
      toast.error('Failed to update preferences');
      setUnsubscribeMarketing(!newValue);
    }
  };

  const handleDeleteAccount = async () => {
    if (hasOrders) {
      toast.error('Users with orders cannot currently be deleted');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your account permanently? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Account deleted successfully');
      await signOut();
      dispatch(setUser({}));
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: 'var(--color-hmc-textprimary)', marginBottom: '32px' }}>
            Profile
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-hmc-textprimary-70)' }}>Email</label>
                <p style={{ fontSize: '18px', color: 'var(--color-hmc-textprimary)', marginTop: '8px' }}>{user?.email}</p>
              </div>

              {user?.full_name && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-hmc-textprimary-70)' }}>Full Name</label>
                  <p style={{ fontSize: '18px', color: 'var(--color-hmc-textprimary)', marginTop: '8px' }}>{user.full_name}</p>
                </div>
              )}

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-hmc-textprimary-70)' }}>Email Verified</label>
                <p style={{ fontSize: '18px', color: 'var(--color-hmc-textprimary)', marginTop: '8px' }}>
                  {user?.email_verified ? '✓ Verified' : '✗ Not Verified'}
                </p>
              </div>

              {user?.role === 'admin' && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-hmc-textprimary-70)' }}>Role</label>
                  <p style={{ fontSize: '18px', color: 'var(--color-hmc-textprimary)', marginTop: '8px', textTransform: 'capitalize' }}>
                    {user.role}
                  </p>
                </div>
              )}

              {user?.created_at && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-hmc-textprimary-70)' }}>Member Since</label>
                  <p style={{ fontSize: '18px', color: 'var(--color-hmc-textprimary)', marginTop: '8px' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-hmc-textprimary-70)', display: 'block', marginBottom: '8px' }}>
                  Theme
                </label>
                <Select
                  options={THEME_OPTIONS}
                  value={THEME_OPTIONS.find(opt => opt.value === theme)}
                  onChange={handleThemeChange}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'white',
                      borderColor: 'var(--color-hmc-border-a)',
                      color: 'var(--color-hmc-textprimary)',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? 'var(--color-hmc-button-a)' : 'white',
                      color: state.isSelected ? 'white' : 'var(--color-hmc-textprimary)',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'var(--color-hmc-textprimary)',
                    }),
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="marketing-unsubscribe"
                  checked={unsubscribeMarketing}
                  onChange={handleMarketingToggle}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label
                  htmlFor="marketing-unsubscribe"
                  style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-hmc-textprimary)', cursor: 'pointer' }}
                >
                  Unsubscribe from marketing emails
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--color-hmc-button-a)',
                color: 'var(--color-hmc-button-text-a)',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? 'Signing Out...' : 'Logout'}
            </button>

            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting || hasOrders}
              style={{
                padding: '12px 24px',
                backgroundColor: hasOrders ? '#ccc' : '#dc2626',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '6px',
                cursor: isDeleting || hasOrders ? 'not-allowed' : 'pointer',
                opacity: isDeleting ? 0.6 : 1,
              }}
              title={hasOrders ? 'Cannot delete account with order history' : 'Delete account permanently'}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>

          {hasOrders && (
            <p style={{ fontSize: '14px', color: '#dc2626', marginTop: '12px' }}>
              Your account cannot be deleted because you have order history.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
