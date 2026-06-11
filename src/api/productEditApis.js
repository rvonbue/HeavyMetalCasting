import { supabase } from '../lib/supabase';

async function createThumbnailOnFileUpload(file, maxSize = 400, quality = 0.9) {
  const imageBitmap = await createImageBitmap(file);

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

  const thumbnailBlob = await createThumbnailOnFileUpload(file);

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
