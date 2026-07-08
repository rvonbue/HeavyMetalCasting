import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Select from 'react-select';
import { signOut } from '../../api/authAPI';
import { setUser } from '../../store/userSlice';
import { PageContainer, AdminPageHeader } from '../../components/Resuables';
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

  const labelClass = "text-xs font-bold text-hmc-textprimary uppercase";
  const valueClass = "text-sm text-hmc-textprimary";
  const addressInputClass = "w-full bg-hmc-panelbackground text-hmc-textprimary text-sm px-3 py-2 border border-hmc-border-b focus:outline-none focus:border-hmc-border-a";

  return (
    <PageContainer bg="admin">
      <div className="mx-auto w-full max-w-2xl text-left">
        <AdminPageHeader
          title="Profile"
          action={
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-5 py-2 text-sm font-bold bg-hmc-button-a text-hmc-button-text-a border border-hmc-border-b hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? 'Signing out…' : 'Logout'}
            </button>
          }
        />

        {/* Account Information */}
        <div className="bg-hmc-panelbackground border border-hmc-border-b p-4 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-hmc-textprimary/60 mb-3">
            Account Information
          </h2>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-4 gap-y-2">
            <label className={labelClass}>Email</label>
            <div className={`flex items-center gap-2 ${valueClass}`}>
              <span>{user?.email}</span>
              <span>{user?.email_verified ? '✅' : '❌'}</span>
              {!user?.email_verified && (
                <span className="text-xs text-hmc-textprimary/60">Not verified</span>
              )}
            </div>

            {user?.full_name && (
              <>
                <label className={labelClass}>Full Name</label>
                <p className={valueClass}>{user.full_name}</p>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <label className={labelClass}>Role</label>
                <p className={`${valueClass} capitalize`}>{user.role}</p>
              </>
            )}

            {user?.created_at && (
              <>
                <label className={labelClass}>Member Since</label>
                <p className={valueClass}>{new Date(user.created_at).toLocaleDateString()}</p>
              </>
            )}
          </div>

          {/* Preferences */}
          <div className="mt-4 border-t border-hmc-border-b pt-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-hmc-textprimary/60 mb-3">
              Preferences
            </h2>
            <div className="grid grid-cols-[140px_1fr] items-center gap-x-4 gap-y-2">
              <label className={labelClass}>Theme</label>
              <div className="w-44">
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
                      borderRadius: 0,
                      minHeight: '32px',
                      height: '32px',
                      fontSize: '13px',
                      boxShadow: 'none',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? 'var(--color-hmc-button-a)' : 'var(--color-hmc-panelbackground)',
                      color: state.isSelected ? 'var(--color-hmc-button-text-a)' : 'var(--color-hmc-textprimary)',
                      fontSize: '13px',
                      padding: '6px 10px',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'var(--color-hmc-textprimary)',
                      fontSize: '13px',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: '0 10px',
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: '32px',
                    }),
                  }}
                />
              </div>

              <label className={labelClass}>Marketing</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="marketing-unsubscribe"
                  checked={unsubscribeMarketing}
                  onChange={handleMarketingToggle}
                  className="w-4 h-4 cursor-pointer accent-hmc-textprimary"
                />
                <label htmlFor="marketing-unsubscribe" className={`${valueClass} cursor-pointer`}>
                  Unsubscribe from marketing emails
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Addresses */}
        <div className="bg-hmc-panelbackground border border-hmc-border-b p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-hmc-textprimary/60">
              Shipping Addresses ({addresses.length}/3)
            </h2>
            {addresses.length < 3 && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1 text-sm font-bold bg-hmc-button-a text-hmc-button-text-a border border-hmc-border-b hover:opacity-90"
              >
                {showAddForm ? '✕' : '+ Add'}
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="border border-hmc-border-b p-3 mb-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className={`${addressInputClass} col-span-2`}
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className={`${addressInputClass} col-span-2`}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className={addressInputClass}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className={addressInputClass}
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                  className={addressInputClass}
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className={addressInputClass}
                />
              </div>
              <button
                onClick={handleAddAddress}
                className="mt-3 px-5 py-2 text-sm font-bold bg-hmc-button-a text-hmc-button-text-a border border-hmc-border-b hover:opacity-90"
              >
                Save Address
              </button>
            </div>
          )}

          {addresses.length === 0 ? (
            <p className="text-sm text-hmc-textprimary/60">No addresses saved yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-hmc-border-b p-3 flex items-start justify-between">
                  <div className={valueClass}>
                    <p className="font-semibold">{addr.full_name}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}</p>
                    <p>{addr.country}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs font-bold uppercase text-hmc-error hover:opacity-70"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete account */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting || hasOrders}
            className="px-4 py-2 text-xs font-bold bg-hmc-error text-white hover:opacity-90 disabled:opacity-50"
            title={hasOrders ? 'Cannot delete account with order history' : 'Delete account permanently'}
          >
            {isDeleting ? 'Deleting…' : 'Delete Account'}
          </button>
          {hasOrders && (
            <p className="text-xs text-hmc-error">Your account cannot be deleted because you have order history.</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
