import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PageContainer, AdminPageHeader } from '../../components/Resuables';
import { updateSetting } from '../../store/settingsSlice';
import { updateStoreSettingAPI } from '../../api/storeSettingsAPI';

const SETTINGS_CONFIG = [
  { key: 'store_name', label: 'Store Name', type: 'text', group: 'General' },
  { key: 'tagline', label: 'Tagline', type: 'text', group: 'General' },
  { key: 'contact_email', label: 'Contact Email', type: 'text', group: 'General' },
  { key: 'about_us_text', label: 'About Us Text', type: 'textarea', group: 'About Us' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'text', group: 'About Us' },
  { key: 'facebook_url', label: 'Facebook URL', type: 'text', group: 'About Us' },
  { key: 'sale_active', label: 'Sale Active', type: 'checkbox', group: 'Sales' },
  { key: 'sale_banner_text', label: 'Sale Banner Text', type: 'text', group: 'Sales' },
  { key: 'sale_discount_percent', label: 'Sale Discount %', type: 'number', group: 'Sales' },
];

const GROUPS = [...new Set(SETTINGS_CONFIG.map((s) => s.group))];

const inputClass = "w-full bg-hmc-panelbackground text-hmc-textprimary text-sm px-3 py-2 border border-hmc-border-b focus:outline-none focus:border-hmc-border-a";

function SettingField({ config, register }) {
  if (config.type === 'checkbox') {
    return (
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          {...register(config.key)}
          className="w-4 h-4 cursor-pointer accent-hmc-textprimary"
        />
      </div>
    );
  }

  if (config.type === 'textarea') {
    return (
      <textarea
        {...register(config.key)}
        rows={6}
        className={`${inputClass} resize-none`}
      />
    );
  }

  return (
    <input
      type={config.type}
      {...register(config.key)}
      className={inputClass}
    />
  );
}

export default function StoreSettingsPage() {
  const dispatch = useDispatch();
  const storedSettings = useSelector((state) => state.settings.settings);

  const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm();

  useEffect(() => {
    if (Object.keys(storedSettings).length > 0) {
      reset(storedSettings);
    }
  }, [storedSettings, reset]);

  async function onSubmit(values) {
    try {
      await Promise.all(
        Object.entries(values).map(([key, value]) =>
          updateStoreSettingAPI(key, value == null ? '' : String(value))
        )
      );
      Object.entries(values).forEach(([key, value]) =>
        dispatch(updateSetting({ key, value: value == null ? '' : String(value) }))
      );
      reset(values);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  }

  return (
    <PageContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AdminPageHeader
          title="Store Settings"
          subtitle="Edit fields then save all at once."
          action={
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="px-5 py-2 text-sm font-bold bg-hmc-button-a text-hmc-button-text-a border border-hmc-border-b disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-hmc-button-b hover:text-hmc-button-text-b transition"
            >
              {isSubmitting ? 'Saving...' : 'Save All'}
            </button>
          }
        />

        <div className="flex flex-col gap-6">
          {GROUPS.map((group) => (
            <div key={group} className="bg-hmc-panelbackground border border-hmc-border-b">
              <div className="px-5 py-3 border-b border-hmc-border-b bg-hmc-button-b">
                <h2 className="text-xs font-bold uppercase tracking-widest text-hmc-button-text-b">
                  {group}
                </h2>
              </div>
              <div className="p-5 flex flex-col gap-5">
                {SETTINGS_CONFIG.filter((c) => c.group === group).map((config) => (
                  <div key={config.key} className="grid grid-cols-3 gap-4 items-start">
                    <label className="text-sm font-semibold text-hmc-textprimary pt-2 col-span-1">
                      {config.label}
                    </label>
                    <div className="col-span-2">
                      <SettingField config={config} register={register} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </form>
    </PageContainer>
  );
}
