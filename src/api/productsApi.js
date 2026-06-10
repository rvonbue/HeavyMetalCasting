import { supabase } from '../lib/supabase';

export async function downloadProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');

  if (error) throw error;

  return data;
}