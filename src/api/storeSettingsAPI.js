import { supabase } from '../lib/supabase';

export async function getStoreSettingsAPI() {
  const { data, error } = await supabase.from('store_settings').select('*');
  if (error) throw error;
  return data ?? [];
}

export async function updateStoreSettingAPI(key, value) {
  // Upsert so keys that were never seeded still persist (an UPDATE by key
  // silently affects 0 rows when the row doesn't exist yet).
  const { error } = await supabase
    .from('store_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}

// Uploads an image to the site-images bucket + site_images table, tagged with a
// context (e.g. 'logo', 'homepage_desktop', 'about'). Returns the row.
export async function uploadSiteImageAPI(file, context) {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${context}/${uid}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('site-images')
    .upload(path, file, { contentType: file.type });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);

  const bitmap = await createImageBitmap(file);

  const { data, error } = await supabase
    .from('site_images')
    .insert({
      image_url: urlData.publicUrl,
      image_path: path,
      context,
      file_size: file.size,
      file_extension: ext,
      width: bitmap.width,
      height: bitmap.height,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllSiteImagesAPI() {
  const { data, error } = await supabase
    .from('site_images')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteSiteImageAPI(imageId, imagePath) {
  const { error: storageError } = await supabase.storage
    .from('site-images')
    .remove([imagePath]);
  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from('site_images')
    .delete()
    .eq('id', imageId);
  if (dbError) throw dbError;
}
