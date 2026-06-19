import { supabase } from '../lib/supabase';

export async function getEventsAPI() {
  const { data, error } = await supabase
    .from('events')
    .select('*, image:site_images(*)')
    .order('sort_order')
    .order('id');
  if (error) throw error;
  return data;
}

export async function createEventAPI(fields) {
  const { data, error } = await supabase
    .from('events')
    .insert(fields)
    .select('*, image:site_images(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function updateEventAPI(id, fields) {
  const { data, error } = await supabase
    .from('events')
    .update(fields)
    .eq('id', id)
    .select('*, image:site_images(*)')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEventAPI(id) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadEventImageAPI(file) {
  const id = crypto.randomUUID();
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `events/${id}.${ext}`;

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
      context: 'event',
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

export async function deleteSiteImageAPI(imageId, imagePath) {
  await supabase.storage.from('site-images').remove([imagePath]);
  const { error } = await supabase.from('site_images').delete().eq('id', imageId);
  if (error) throw error;
}
