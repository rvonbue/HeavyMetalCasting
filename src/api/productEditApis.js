import { supabase } from '../lib/supabase';


export async function uploadProductImage(productId, file) {
  const extension = file.name.split('.').pop();

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const filePath = `products/${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  const { data, error: insertError } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: publicUrlData.publicUrl,
      image_path: filePath,
      sort_order: 0,
      is_primary: false,
    })
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return {
    id: data.id,
    product_id: data.product_id,
    image_url: data.image_url,
    image_path: data.image_path,
    sort_order: data.sort_order,
    is_primary: data.is_primary,
  };
}

export async function getProductEditFields() {
  const { data, error } = await supabase.rpc(
    'get_product_edit_fields'
  );

  if (error) {
    throw error;
  }

  return data;
}