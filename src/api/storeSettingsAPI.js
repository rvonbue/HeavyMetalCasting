import { supabase } from '../lib/supabase';

export async function getStoreSettingsAPI() {
  const { data, error } = await supabase.from('store_settings').select('*');
  if (error) throw error;
  return data ?? [];
}

export async function updateStoreSettingAPI(key, value) {
  const { error } = await supabase
    .from('store_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key);
  if (error) throw error;
}
