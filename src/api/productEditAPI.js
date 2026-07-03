import { supabase } from '../lib/supabase';

async function createThumbnailFromBitmap(imageBitmap, maxSize = 400, quality = 0.9) {
  const scale = Math.min(
    maxSize / imageBitmap.width,
    maxSize / imageBitmap.height,
    1
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(imageBitmap.width * scale);
  canvas.height = Math.round(imageBitmap.height * scale);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/webp",
      quality
    );
  });
}
export async function uploadProductImage(productId, file, new_sort_order) {
  const id = crypto.randomUUID();

  const originalPath = `products/${productId}/original/${id}.webp`;
  const thumbnailPath = `products/${productId}/thumbs/${id}.webp`;

  const fileExtension = file.name.split('.').pop().toLowerCase();

  const imageBitmap = await createImageBitmap(file);
  const imageWidth = imageBitmap.width;
  const imageHeight = imageBitmap.height;

  const thumbnailBlob = await createThumbnailFromBitmap(imageBitmap);

  const { error: originalError } = await supabase.storage
    .from("product-images")
    .upload(originalPath, file);

  if (originalError) throw originalError;

  const { error: thumbError } = await supabase.storage
    .from("product-images")
    .upload(thumbnailPath, thumbnailBlob, {
      contentType: "image/webp",
    });

  if (thumbError) throw thumbError;

  const { data: originalUrl } = supabase.storage
    .from("product-images")
    .getPublicUrl(originalPath);

  const { data: thumbUrl } = supabase.storage
    .from("product-images")
    .getPublicUrl(thumbnailPath);

  
  
  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      label: file.name,
      image_url: originalUrl.publicUrl,
      image_path: originalPath,
      thumbnail_url: thumbUrl.publicUrl,
      thumbnail_path: thumbnailPath,
      sort_order: new_sort_order,
      is_primary: false,
      file_size: file.size,
      file_extension: fileExtension,
      width: imageWidth,
      height: imageHeight,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
export async function deleteProductImage(image) {
  const pathsToDelete = [
    image.image_path,
    image.thumbnail_path,
  ].filter(Boolean);

  if (pathsToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove(pathsToDelete);

    if (storageError) throw storageError;
  }

  const { error: dbError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", image.id);

  if (dbError) throw dbError;

  return image.id;
}
export async function replaceProductImageFile({ image, blob }) {
  const productId = image.product_id;
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const originalPath = `products/${productId}/original/${uid}.webp`;
  const thumbnailPath = `products/${productId}/thumbs/${uid}.webp`;

  const imageBitmap = await createImageBitmap(blob);
  const width = imageBitmap.width;
  const height = imageBitmap.height;
  const thumbnailBlob = await createThumbnailFromBitmap(imageBitmap);

  const { error: originalError } = await supabase.storage
    .from("product-images")
    .upload(originalPath, blob, { contentType: "image/webp" });
  if (originalError) throw originalError;

  const { error: thumbError } = await supabase.storage
    .from("product-images")
    .upload(thumbnailPath, thumbnailBlob, { contentType: "image/webp" });
  if (thumbError) throw thumbError;

  const { data: originalUrl } = supabase.storage
    .from("product-images")
    .getPublicUrl(originalPath);
  const { data: thumbUrl } = supabase.storage
    .from("product-images")
    .getPublicUrl(thumbnailPath);

  const { data, error } = await supabase
    .from("product_images")
    .update({
      image_url: originalUrl.publicUrl,
      image_path: originalPath,
      thumbnail_url: thumbUrl.publicUrl,
      thumbnail_path: thumbnailPath,
      width,
      height,
    })
    .eq("id", image.id)
    .select();

  if (error) throw error;

  // Best-effort cleanup of the replaced files.
  const oldPaths = [image.image_path, image.thumbnail_path].filter(Boolean);
  if (oldPaths.length > 0) {
    await supabase.storage.from("product-images").remove(oldPaths);
  }

  return data?.[0];
}

export async function updateProductImageAPI({ id, updates }) {
  const { data, error } = await supabase
    .from("product_images")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(
      "No rows updated — check the RLS UPDATE policy on product_images."
    );
  }

  return data[0];
}

export async function updateProductImageSortOrder(images) {
  const image_updates = images.map((image, index) => ({
    id: image.id,
    sort_order: index,
  }));

  console.log("sending image_updates", image_updates);

  const { data, error } = await supabase.rpc(
    "update_product_image_sort_order",
    { image_updates }
  );

  if (error) throw error;

  console.log("updated rows from rpc", data);

  return data;
}
export async function upsertProductVariantsAPI({ productId, variants }) {
  const rows = variants.map((v) => ({
    product_id: productId,
    size_chart_id: v.size_chart_id,
    size_value: v.size_value,
    metal_type_id: v.metal_type_id,
    stock: v.stock,
  }));

  const { data, error } = await supabase
    .from('product_variants')
    .upsert(rows, { onConflict: 'product_id,size_chart_id,size_value,metal_type_id' })
    .select();

  if (error) throw error;
  return data;
}

export async function updateProductAPI({
  productId,
  productUpdates,
}) {
  const { data, error } = await supabase
    .from("products")
    .update(productUpdates)
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    console.error("updateProduct error:", error);
    throw error;
  }

  return data;
}