import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PageContainer, AdminPageHeader, FolderTab } from '../../components/Resuables';
import { updateSetting } from '../../store/settingsSlice';
import { setTheme } from '../../store/appSlice';
import { updateStoreSettingAPI, uploadSiteImageAPI } from '../../api/storeSettingsAPI';
import { THEME_COLORS, themeColorKey, resolveVarToHex } from '../../staticData/themeColors';

const SETTINGS_CONFIG = [
  { key: 'store_name', label: 'Store Name', type: 'text', group: 'General' },
  { key: 'site_initials', label: 'Site Initials (toolbar)', type: 'text', group: 'General' },
  { key: 'tagline', label: 'Tagline', type: 'text', group: 'General' },
  { key: 'contact_email', label: 'Contact Email', type: 'text', group: 'General' },

  { key: 'theme', label: 'Theme', type: 'select', group: 'Theme',
    options: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }] },

  { key: 'homepage_image_desktop_url', label: 'Homepage Image (Desktop)', type: 'image', context: 'homepage_desktop', group: 'Branding' },
  { key: 'homepage_image_mobile_url', label: 'Homepage Image (Mobile)', type: 'image', context: 'homepage_mobile', group: 'Branding' },
  { key: 'logo_url', label: 'Site Logo', type: 'image', context: 'logo', group: 'Branding' },
  { key: 'navbar_home_button_image_url', label: 'Navbar Home Button Image', type: 'image', context: 'navbar_home', group: 'Branding' },
  { key: 'shopping_cart_bg_image_url', label: 'Shopping Cart Background Image', type: 'image', context: 'shopping_cart_bg', group: 'Branding' },
  { key: 'logo_show_in_navbar', label: 'Show Logo in Navbar', type: 'checkbox', group: 'Branding' },

  { key: 'about_us_text', label: 'About Us Text', type: 'textarea', group: 'About Us' },
  { key: 'about_image_url', label: 'About Us Image', type: 'image', context: 'about', group: 'About Us' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'text', group: 'About Us' },
  { key: 'facebook_url', label: 'Facebook URL', type: 'text', group: 'About Us' },

  { key: 'sale_active', label: 'Sale Active', type: 'checkbox', group: 'Sales' },
  { key: 'sale_banner_html', label: 'Sale Banner HTML', type: 'textarea', group: 'Sales' },
  { key: 'sale_discount_percent', label: 'Sale Discount %', type: 'number', group: 'Sales' },
];

const GROUPS = [...new Set(SETTINGS_CONFIG.map((s) => s.group))];
const CHECKBOX_KEYS = SETTINGS_CONFIG.filter((c) => c.type === 'checkbox').map((c) => c.key);

const inputClass = "w-full bg-hmc-panelbackground text-hmc-textprimary text-sm px-3 py-2 border border-hmc-border-b focus:outline-none focus:border-hmc-border-a";

function ImageSettingField({ value, onUpload }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden border border-hmc-border-b bg-hmc-bg-a">
        {value ? (
          <img src={value} alt="" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-xs text-hmc-textprimary/50">None</span>
        )}
      </div>
      <input type="file" accept="image/*" ref={inputRef} onChange={handleFile} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 text-sm font-bold border border-hmc-border-b bg-hmc-button-a text-hmc-button-text-a hover:opacity-90 disabled:opacity-50"
      >
        {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
      </button>
    </div>
  );
}

function SettingField({ config, register, watch, onImageUpload }) {
  if (config.type === 'image') {
    return (
      <ImageSettingField
        value={watch(config.key)}
        onUpload={(file) => onImageUpload(config, file)}
      />
    );
  }

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
        className={`${inputClass} resize-none font-mono`}
      />
    );
  }

  if (config.type === 'select') {
    return (
      <select {...register(config.key)} className={inputClass}>
        {config.options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
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

function ColorSwatch({ varName, value, onChange }) {
  const [resolved, setResolved] = useState(null);

  useEffect(() => {
    if (!value) setResolved(resolveVarToHex(varName));
  }, [varName, value]);

  const hex = value || resolved || '#000000';

  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded bg-transparent p-0"
        aria-label={`Edit ${varName}`}
      />
    </div>
  );
}

export default function StoreSettingsPage() {
  const dispatch = useDispatch();
  const storedSettings = useSelector((state) => state.settings.settings);
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]);

  const { register, handleSubmit, reset, setValue, watch, formState: { isDirty, isSubmitting } } = useForm({
    defaultValues: storedSettings
  });

  useEffect(() => {
    if (Object.keys(storedSettings).length > 0) {
      // Normalize checkbox string values ('true'/'false') to booleans for RHF.
      const normalized = { ...storedSettings };
      for (const key of CHECKBOX_KEYS) {
        normalized[key] = storedSettings[key] === 'true' || storedSettings[key] === true;
      }
      reset(normalized);
    }
  }, [storedSettings, reset]);


  function handleResetThemeColors() {
    THEME_COLORS.forEach((c) =>
      setValue(themeColorKey(c.var), '', { shouldDirty: true })
    );
  }

  async function handleImageUpload(config, file) {
    try {
      const row = await uploadSiteImageAPI(file, config.context);
      setValue(config.key, row.image_url, { shouldDirty: true });
      toast.success('Image uploaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    }
  }

  async function onSubmit(values) {
    try {
      const entries = Object.entries(values).map(([key, value]) => [
        key,
        value == null ? '' : String(value),
      ]);
      await Promise.all(entries.map(([key, value]) => updateStoreSettingAPI(key, value)));
      entries.forEach(([key, value]) => dispatch(updateSetting({ key, value })));
      if (values.theme === 'light' || values.theme === 'dark') {
        dispatch(setTheme(values.theme));
      }
      reset(values);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  }

  const groupConfigs = SETTINGS_CONFIG.filter((c) => c.group === activeGroup);

  return (
    <PageContainer bg="admin">
      <form onSubmit={handleSubmit(onSubmit)}>
        <AdminPageHeader
          title="Store Settings"
          action={
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="px-5 py-2 text-sm font-bold bg-hmc-button-a text-hmc-button-text-a border border-hmc-border-b disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-hmc-button-b hover:text-hmc-button-text-b transition"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          }
        />

        {/* Folder-tab navbar */}
        <div className="flex flex-wrap gap-y-2 pl-6 pt-2">
          {GROUPS.map((group) => (
            <FolderTab
              key={group}
              label={group}
              selected={group === activeGroup}
              onClick={() => setActiveGroup(group)}
            />
          ))}
        </div>

        {/* Active section panel */}
        <div className="bg-hmc-panelbackground border border-hmc-border-b">
          <div className="p-3 flex flex-col gap-2">
            {groupConfigs.map((config) => (
              <div key={config.key} className="border border-hmc-border-b rounded p-3 grid grid-cols-3 gap-3 items-start bg-hmc-button-a/5">
                <label className="text-sm font-semibold text-hmc-textprimary pt-1 col-span-1">
                  {config.label}
                </label>
                <div className="col-span-2">
                  <SettingField
                    config={config}
                    register={register}
                    watch={watch}
                    onImageUpload={handleImageUpload}
                  />
                </div>
              </div>
            ))}

            {activeGroup === 'Theme' && (
              <div className="flex flex-col gap-2 border-t border-hmc-border-b pt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-hmc-textprimary/60">
                    Theme Colors
                  </h3>
                  <button
                    type="button"
                    onClick={handleResetThemeColors}
                    className="px-3 py-1 text-xs font-bold border border-hmc-border-b text-hmc-textprimary hover:bg-hmc-button-a/20"
                  >
                    Reset to theme defaults
                  </button>
                </div>
                <div className="w-4/5 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2">
                  {THEME_COLORS.map((c) => (
                    <div key={c.var} className="flex items-center gap-2">
                      <ColorSwatch
                        varName={c.var}
                        value={watch(themeColorKey(c.var))}
                        onChange={(hex) =>
                          setValue(themeColorKey(c.var), hex, { shouldDirty: true })
                        }
                      />
                      <label className="text-sm font-semibold text-hmc-textprimary text-left truncate">
                        {c.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
