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
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    if (user?.id) {
      checkUserOrders();
      loadUserPreferences();
      loadAddresses();
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

  const loadAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleAddAddress = async () => {
    if (!formData.full_name || !formData.street || !formData.city || !formData.zip) {
      toast.error('Please fill in all fields');
      return;
    }

    if (addresses.length >= 3) {
      toast.error('Maximum 3 addresses allowed');
      return;
    }

    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .insert([{ user_id: user.id, ...formData }]);

      if (error) throw error;
      toast.success('Address added');
      setFormData({ full_name: '', street: '', city: '', state: '', zip: '', country: '' });
      setShowAddForm(false);
      loadAddresses();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;

    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      toast.success('Address deleted');
      loadAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
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
      <div className="max-w-4xl mx-auto py-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-hmc-textprimary">Profile</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? 'Out...' : 'Logout'}
          </button>
        </div>

        {/* Account Info Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-2xl font-bold text-hmc-textprimary mb-3">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-hmc-textprimary mb-1 block">📧 Email</label>
              <p className="text-sm text-hmc-textprimary">{user?.email}</p>
            </div>

            {user?.full_name && (
              <div>
                <label className="text-xs font-bold text-hmc-textprimary mb-1 block">Full Name</label>
                <p className="text-sm text-hmc-textprimary">{user.full_name}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-lg">{user?.email_verified ? '✅' : '❌'}</span>
            </div>

            {user?.role === 'admin' && (
              <div>
                <label className="text-xs font-bold text-hmc-textprimary mb-1 block">Role</label>
                <p className="text-sm text-hmc-textprimary capitalize">{user.role}</p>
              </div>
            )}

            {user?.created_at && (
              <div>
                <label className="text-xs font-bold text-hmc-textprimary mb-1 block">Member Since</label>
                <p className="text-sm text-hmc-textprimary">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            )}

            <div className="border-t border-hmc-border-a pt-3 mt-3">
              <h3 className="text-sm font-semibold text-hmc-textprimary mb-3">Preferences</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-hmc-textprimary mb-1 block">Theme</label>
                  <Select
                    options={THEME_OPTIONS}
                    value={THEME_OPTIONS.find(opt => opt.value === theme)}
                    onChange={handleThemeChange}
                    isSearchable={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: 'white',
                        borderColor: 'var(--color-hmc-border-a)',
                        minHeight: '28px',
                        fontSize: '12px',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? 'var(--color-hmc-button-a)' : 'white',
                        color: state.isSelected ? 'white' : 'var(--color-hmc-textprimary)',
                        fontSize: '12px',
                        padding: '4px 8px',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'var(--color-hmc-textprimary)',
                        fontSize: '12px',
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: '2px 8px',
                      }),
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="marketing-unsubscribe"
                    checked={unsubscribeMarketing}
                    onChange={handleMarketingToggle}
                    className="w-4 h-4"
                  />
                  <label htmlFor="marketing-unsubscribe" className="text-xs font-bold text-hmc-textprimary cursor-pointer">
                    Unsubscribe from marketing emails
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Addresses Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-hmc-textprimary">Shipping Addresses ({addresses.length}/3)</h2>
            {addresses.length < 3 && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="ml-auto px-2 py-1 text-xs bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
              >
                {showAddForm ? '✕' : '+'}
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="border border-hmc-border-a rounded p-3 mb-3">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="px-2 py-1 text-sm border border-hmc-border-a rounded text-hmc-textprimary"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="px-2 py-1 text-sm border border-hmc-border-a rounded text-hmc-textprimary"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="px-2 py-1 text-sm border border-hmc-border-a rounded text-hmc-textprimary"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="px-2 py-1 text-sm border border-hmc-border-a rounded text-hmc-textprimary"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  className="px-2 py-1 text-sm border border-hmc-border-a rounded text-hmc-textprimary"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="px-2 py-1 text-sm border border-hmc-border-a rounded text-hmc-textprimary"
                />
              </div>
              <button
                onClick={handleAddAddress}
                className="mt-2 px-3 py-1 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
              >
                Save
              </button>
            </div>
          )}

          {addresses.length === 0 ? (
            <p className="text-hmc-textprimary text-center py-2 text-sm">No addresses saved yet</p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-hmc-border-a rounded p-3">
                  <div className="space-y-2 mb-2">
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary block mb-0.5">Name</label>
                      <p className="text-hmc-textprimary">{addr.full_name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary block mb-0.5">Street</label>
                      <p className="text-hmc-textprimary">{addr.street}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary block mb-0.5">City</label>
                      <p className="text-hmc-textprimary">{addr.city}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary block mb-0.5">State</label>
                      <p className="text-hmc-textprimary">{addr.state}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary block mb-0.5">ZIP</label>
                      <p className="text-hmc-textprimary">{addr.zip}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary block mb-0.5">Country</label>
                      <p className="text-hmc-textprimary">{addr.country}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="px-2 py-0.5 bg-red-600 text-white text-xs rounded hover:opacity-90"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting || hasOrders}
              className="px-2 py-1 text-xs bg-red-600 text-white font-bold rounded hover:opacity-90 disabled:opacity-60 disabled:bg-gray-400"
              title={hasOrders ? 'Cannot delete account with order history' : 'Delete account permanently'}
            >
              {isDeleting ? '...' : 'Delete Account'}
            </button>
          </div>

          {hasOrders && (
            <p className="text-red-600 text-xs mt-2">Your account cannot be deleted because you have order history.</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
