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
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold text-hmc-textprimary">Profile</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-6 py-2 text-sm bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 disabled:opacity-60 transition"
          >
            {isLoading ? 'Signing out...' : 'Logout'}
          </button>
        </div>

        {/* Account Info Section */}
        <div className="bg-hmc-panelbackground border border-hmc-border-b rounded-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-hmc-textprimary mb-6">Account Information</h2>
          <div className="space-y-5">
            <div className="pb-5 border-b border-hmc-border-b">
              <div className="flex items-center gap-3 mb-2">
                <label className="text-base font-bold text-hmc-textprimary">Email</label>
                <span className="text-xl">{user?.email_verified ? '✅' : '❌'}</span>
                {!user?.email_verified && <span className="text-sm text-hmc-textprimary font-semibold">Not verified</span>}
              </div>
              <p className="text-lg text-hmc-textprimary font-light">{user?.email}</p>
            </div>

            {user?.full_name && (
              <div className="pb-5 border-b border-hmc-border-b">
                <label className="text-sm font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">Full Name</label>
                <p className="text-lg text-hmc-textprimary">{user.full_name}</p>
              </div>
            )}

            {user?.role === 'admin' && (
              <div className="pb-5 border-b border-hmc-border-b">
                <label className="text-sm font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">Role</label>
                <p className="text-lg text-hmc-textprimary capitalize font-semibold px-3 py-1 bg-hmc-button-a/20 w-fit rounded">{user.role}</p>
              </div>
            )}

            {user?.created_at && (
              <div className="pb-5">
                <label className="text-sm font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">Member Since</label>
                <p className="text-lg text-hmc-textprimary">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-hmc-border-b">
              <h3 className="text-2xl font-bold text-hmc-textprimary mb-6">Preferences</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-hmc-textprimary/70 block mb-3 uppercase tracking-wide">Theme</label>
                  <Select
                    options={THEME_OPTIONS}
                    value={THEME_OPTIONS.find(opt => opt.value === theme)}
                    onChange={handleThemeChange}
                    isSearchable={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: 'var(--color-hmc-panelbackground)',
                        borderColor: 'var(--color-hmc-border-b)',
                        borderWidth: '2px',
                        minHeight: '40px',
                        fontSize: '14px',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? 'var(--color-hmc-button-a)' : 'var(--color-hmc-panelbackground)',
                        color: state.isSelected ? 'white' : 'var(--color-hmc-textprimary)',
                        fontSize: '14px',
                        padding: '8px 12px',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'var(--color-hmc-textprimary)',
                        fontSize: '14px',
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: '4px 12px',
                      }),
                    }}
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <input
                    type="checkbox"
                    id="marketing-unsubscribe"
                    checked={unsubscribeMarketing}
                    onChange={handleMarketingToggle}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label htmlFor="marketing-unsubscribe" className="text-base text-hmc-textprimary cursor-pointer">
                    Unsubscribe from marketing emails
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Addresses Section */}
        <div className="bg-hmc-panelbackground border border-hmc-border-b rounded-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-hmc-textprimary">Shipping Addresses <span className="text-hmc-textprimary/50 text-2xl">({addresses.length}/3)</span></h2>
            {addresses.length < 3 && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="ml-8 px-4 py-3 text-2xl bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 transition"
              >
                {showAddForm ? '✕' : '+'}
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="border-2 border-hmc-border-b rounded-lg p-6 mb-6 bg-hmc-button-a/5">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-4 py-3 text-base border border-hmc-border-b rounded text-hmc-textprimary bg-hmc-panelbackground focus:outline-none focus:border-hmc-button-a"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full px-4 py-3 text-base border border-hmc-border-b rounded text-hmc-textprimary bg-hmc-panelbackground focus:outline-none focus:border-hmc-button-a"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="px-4 py-3 text-base border border-hmc-border-b rounded text-hmc-textprimary bg-hmc-panelbackground focus:outline-none focus:border-hmc-button-a"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="px-4 py-3 text-base border border-hmc-border-b rounded text-hmc-textprimary bg-hmc-panelbackground focus:outline-none focus:border-hmc-button-a"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={formData.zip}
                    onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    className="px-4 py-3 text-base border border-hmc-border-b rounded text-hmc-textprimary bg-hmc-panelbackground focus:outline-none focus:border-hmc-button-a"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="px-4 py-3 text-base border border-hmc-border-b rounded text-hmc-textprimary bg-hmc-panelbackground focus:outline-none focus:border-hmc-button-a"
                  />
                </div>
              </div>
              <button
                onClick={handleAddAddress}
                className="mt-6 px-6 py-2 text-base bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90 transition"
              >
                Save Address
              </button>
            </div>
          )}

          {addresses.length === 0 ? (
            <p className="text-hmc-textprimary text-center py-8 text-lg opacity-60">No addresses saved yet</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-hmc-border-b rounded-lg p-6 bg-hmc-button-a/5">
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">Name</label>
                      <p className="text-lg text-hmc-textprimary">{addr.full_name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">Street</label>
                      <p className="text-lg text-hmc-textprimary">{addr.street}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">City</label>
                      <p className="text-lg text-hmc-textprimary">{addr.city}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">State</label>
                      <p className="text-lg text-hmc-textprimary">{addr.state}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">ZIP</label>
                      <p className="text-lg text-hmc-textprimary">{addr.zip}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-hmc-textprimary/70 block mb-2 uppercase tracking-wide">Country</label>
                      <p className="text-lg text-hmc-textprimary">{addr.country}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="px-4 py-2 bg-hmc-error text-white text-sm font-bold rounded hover:opacity-90 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-hmc-panelbackground border border-hmc-border-b rounded-lg p-8">
          <div className="flex justify-end">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting || hasOrders}
              className="px-6 py-3 text-base bg-hmc-error text-white font-bold rounded hover:opacity-90 disabled:opacity-60 disabled:bg-hmc-textprimary/30 transition"
              title={hasOrders ? 'Cannot delete account with order history' : 'Delete account permanently'}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>

          {hasOrders && (
            <p className="text-hmc-error text-base mt-4 font-semibold">Your account cannot be deleted because you have order history.</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
