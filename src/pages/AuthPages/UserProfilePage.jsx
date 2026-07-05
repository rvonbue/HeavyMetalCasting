import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import Select from 'react-select';
import { PageContainer, AdminPageHeader } from '../../components/Resuables';
import {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  setDefaultAddress,
  updateThemePreference,
  updateMarketingSubscription
} from '../../api/userProfileAPI';
import { signOut } from '../../api/authAPI';
import { logout } from '../../store/authSlice';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/create_account');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  async function loadProfile() {
    try {
      const profileData = await getUserProfile(user.id);
      setProfile(profileData);
      const addressesData = await getUserAddresses(user.id);
      setAddresses(addressesData);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      dispatch(logout());
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <PageContainer bg="admin">
      <AdminPageHeader
        title="My Profile"
        action={
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold border border-hmc-border-b hover:bg-hmc-button-b hover:text-hmc-button-text-b transition"
          >
            Sign Out
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-hmc-border-a">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'profile'
              ? 'text-hmc-textprimary border-b-2 border-hmc-button-a'
              : 'text-hmc-textprimary/60 hover:text-hmc-textprimary'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'addresses'
              ? 'text-hmc-textprimary border-b-2 border-hmc-button-a'
              : 'text-hmc-textprimary/60 hover:text-hmc-textprimary'
          }`}
        >
          Shipping Addresses
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'preferences'
              ? 'text-hmc-textprimary border-b-2 border-hmc-button-a'
              : 'text-hmc-textprimary/60 hover:text-hmc-textprimary'
          }`}
        >
          Preferences
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && profile && (
        <ProfileSection profile={profile} onUpdate={loadProfile} />
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <AddressesSection
          addresses={addresses}
          userId={user.id}
          onUpdate={loadProfile}
          showForm={showAddressForm}
          onShowForm={setShowAddressForm}
        />
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && profile && (
        <PreferencesSection profile={profile} onUpdate={loadProfile} />
      )}
    </PageContainer>
  );
}

function ProfileSection({ profile, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      full_name: profile.full_name || '',
      email: profile.email || '',
    },
  });

  async function onSubmit(data) {
    try {
      await updateUserProfile(profile.id, {
        full_name: data.full_name,
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-hmc-panelbackground border border-hmc-border-a rounded p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-hmc-textprimary">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
                Full Name
              </label>
              <Controller
                name="full_name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-hmc-textprimary mb-1">
                Email (Cannot be changed)
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 border border-hmc-border-a rounded bg-hmc-bodybackground text-hmc-textprimary/60 cursor-not-allowed"
              />
              <p className="text-xs text-hmc-textprimary/60 mt-1">
                Contact support to change email
              </p>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-hmc-textprimary/70">Full Name</p>
              <p className="text-hmc-textprimary">{profile.full_name || '(Not set)'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-hmc-textprimary/70">Email</p>
              <p className="text-hmc-textprimary">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-hmc-textprimary/70">Email Verified</p>
              <p className={profile.email_verified ? 'text-green-600' : 'text-hmc-error'}>
                {profile.email_verified ? '✓ Verified' : '✗ Not verified'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PreferencesSection({ profile, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleThemeChange(option) {
    setIsLoading(true);
    try {
      await updateUserProfile(profile.id, { theme: option.value });
      toast.success('Theme preference saved. Refresh page to apply.');
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarketingChange(checked) {
    setIsLoading(true);
    try {
      await updateUserProfile(profile.id, { subscribe_marketing: checked });
      toast.success(checked ? 'Subscribed to marketing' : 'Unsubscribed from marketing');
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-hmc-panelbackground border border-hmc-border-a rounded p-6">
        <h2 className="text-xl font-bold text-hmc-textprimary mb-6">Theme</h2>
        <div>
          <label className="block text-sm font-semibold text-hmc-textprimary mb-2">
            Preferred Theme
          </label>
          <Select
            options={THEME_OPTIONS}
            value={THEME_OPTIONS.find(o => o.value === (profile.theme || 'light'))}
            onChange={handleThemeChange}
            isDisabled={isLoading}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '38px',
                borderColor: 'var(--color-hmc-border-a)',
              }),
            }}
            className="text-sm"
          />
          <p className="text-xs text-hmc-textprimary/60 mt-2">
            Your site theme will update when you refresh
          </p>
        </div>
      </div>

      <div className="bg-hmc-panelbackground border border-hmc-border-a rounded p-6">
        <h2 className="text-xl font-bold text-hmc-textprimary mb-6">Email Preferences</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.subscribe_marketing || false}
            onChange={(e) => handleMarketingChange(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4"
          />
          <div>
            <p className="font-semibold text-hmc-textprimary">Subscribe to Marketing Emails</p>
            <p className="text-xs text-hmc-textprimary/60">
              Get updates about new products, promotions, and company news
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

function AddressesSection({ addresses, userId, onUpdate, showForm, onShowForm }) {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-hmc-textprimary">Shipping Addresses</h2>
        <button
          onClick={() => onShowForm(!showForm)}
          className="px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90"
        >
          {showForm ? 'Cancel' : '+ Add Address'}
        </button>
      </div>

      {showForm && (
        <AddressForm userId={userId} onSuccess={() => {
          onShowForm(false);
          onUpdate();
        }} />
      )}

      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-hmc-textprimary/60">No shipping addresses yet</p>
        ) : (
          addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AddressForm({ userId, onSuccess }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'USA',
      phone: '',
    },
  });

  async function onSubmit(data) {
    try {
      await addShippingAddress(userId, data);
      toast.success('Address added successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-hmc-panelbackground border border-hmc-border-a rounded p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-hmc-textprimary mb-1">Name</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <>
                <input {...field} type="text" placeholder="Full Name" className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a" />
                {errors.name && <p className="text-xs text-hmc-error mt-1">{errors.name.message}</p>}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-hmc-textprimary mb-1">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input {...field} type="tel" placeholder="(555) 000-0000" className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a" />
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-hmc-textprimary mb-1">Street Address</label>
        <Controller
          name="street_address"
          control={control}
          rules={{ required: 'Street address is required' }}
          render={({ field }) => (
            <>
              <input {...field} type="text" placeholder="123 Main St" className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a" />
              {errors.street_address && <p className="text-xs text-hmc-error mt-1">{errors.street_address.message}</p>}
            </>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-hmc-textprimary mb-1">City</label>
          <Controller
            name="city"
            control={control}
            rules={{ required: 'City is required' }}
            render={({ field }) => (
              <>
                <input {...field} type="text" placeholder="Santa Cruz" className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a" />
                {errors.city && <p className="text-xs text-hmc-error mt-1">{errors.city.message}</p>}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-hmc-textprimary mb-1">State</label>
          <Controller
            name="state"
            control={control}
            rules={{ required: 'State is required' }}
            render={({ field }) => (
              <>
                <input {...field} type="text" placeholder="CA" className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a" />
                {errors.state && <p className="text-xs text-hmc-error mt-1">{errors.state.message}</p>}
              </>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-hmc-textprimary mb-1">ZIP Code</label>
          <Controller
            name="zip_code"
            control={control}
            rules={{ required: 'ZIP code is required' }}
            render={({ field }) => (
              <>
                <input {...field} type="text" placeholder="95001" className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a" />
                {errors.zip_code && <p className="text-xs text-hmc-error mt-1">{errors.zip_code.message}</p>}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-hmc-textprimary mb-1">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <input {...field} type="text" placeholder="USA" className="w-full px-3 py-2 border border-hmc-border-a rounded bg-white text-hmc-textprimary focus:outline-none focus:ring-1 focus:ring-hmc-button-a" />
            )}
          />
        </div>
      </div>

      <button type="submit" className="w-full px-4 py-2 bg-hmc-button-a text-hmc-button-text-a font-bold rounded hover:opacity-90">
        Add Address
      </button>
    </form>
  );
}

function AddressCard({ address, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: address,
  });

  async function onSubmit(data) {
    try {
      await updateShippingAddress(address.id, data);
      toast.success('Address updated');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleDelete() {
    if (confirm('Delete this address?')) {
      try {
        await deleteShippingAddress(address.id);
        toast.success('Address deleted');
        onUpdate();
      } catch (error) {
        toast.error(error.message);
      }
    }
  }

  async function handleSetDefault() {
    try {
      await setDefaultAddress(address.user_id, address.id);
      toast.success('Default address updated');
      onUpdate();
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="bg-hmc-panelbackground border border-hmc-border-a rounded p-4 space-y-3">
        <Controller name="name" control={control} render={({ field }) => <input {...field} placeholder="Name" className="w-full px-2 py-1 border border-hmc-border-a rounded text-sm" />} />
        <Controller name="street_address" control={control} render={({ field }) => <input {...field} placeholder="Street" className="w-full px-2 py-1 border border-hmc-border-a rounded text-sm" />} />
        <div className="grid grid-cols-2 gap-2">
          <Controller name="city" control={control} render={({ field }) => <input {...field} placeholder="City" className="w-full px-2 py-1 border border-hmc-border-a rounded text-sm" />} />
          <Controller name="state" control={control} render={({ field }) => <input {...field} placeholder="State" className="w-full px-2 py-1 border border-hmc-border-a rounded text-sm" />} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 px-3 py-1 bg-hmc-button-a text-hmc-button-text-a text-sm font-bold rounded hover:opacity-90">Save</button>
          <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-3 py-1 bg-hmc-button-b text-hmc-textprimary text-sm font-bold rounded hover:opacity-90">Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-hmc-panelbackground border border-hmc-border-a rounded p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-hmc-textprimary">{address.name}</p>
          <p className="text-sm text-hmc-textprimary/70">{address.street_address}</p>
          <p className="text-sm text-hmc-textprimary/70">{address.city}, {address.state} {address.zip_code}</p>
          {address.phone && <p className="text-sm text-hmc-textprimary/70">{address.phone}</p>}
          {address.is_default && <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">Default</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="text-xs text-hmc-link hover:underline font-semibold">Edit</button>
          {!address.is_default && <button onClick={handleSetDefault} className="text-xs text-hmc-link hover:underline font-semibold">Set Default</button>}
          <button onClick={handleDelete} className="text-xs text-hmc-error hover:underline font-semibold">Delete</button>
        </div>
      </div>
    </div>
  );
}
