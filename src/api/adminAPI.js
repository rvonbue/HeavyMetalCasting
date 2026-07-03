import { supabase } from '../lib/supabase';

export async function getAdminInitialData() {
  const [fieldsRes, blocksRes] = await Promise.all([
    supabase.from("admin_product_fields").select("*").order("sort_order"),
    supabase
      .from("shop_page_blocks")
      .select("*, admin_product_fields(column_name, input_type, label)")
      .order("grid_row")
      .order("grid_col"),
  ]);

  if (fieldsRes.error) throw fieldsRes.error;
  if (blocksRes.error) throw blocksRes.error;

  return {
    productEditFields: fieldsRes.data,
    shopBlocks: blocksRes.data ?? [],
  };
}

const SHOP_BLOCK_SELECT = "*, admin_product_fields(column_name, input_type, label)";
const NO_ROWS_MSG =
  "No rows returned — check the RLS policies on shop_page_blocks.";

export async function createShopBlockAPI(block) {
  const { data, error } = await supabase
    .from("shop_page_blocks")
    .insert(block)
    .select(SHOP_BLOCK_SELECT);

  if (error) throw error;
  if (!data || data.length === 0) throw new Error(NO_ROWS_MSG);

  return data[0];
}

export async function updateShopBlockAPI({ id, updates }) {
  const { data, error } = await supabase
    .from("shop_page_blocks")
    .update(updates)
    .eq("id", id)
    .select(SHOP_BLOCK_SELECT);

  if (error) throw error;
  if (!data || data.length === 0) throw new Error(NO_ROWS_MSG);

  return data[0];
}

export async function deleteShopBlockAPI(id) {
  const { error } = await supabase
    .from("shop_page_blocks")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return id;
}

// blocks: [{ id, grid_row, grid_col }, ...]
export async function updateShopBlocksLayoutAPI(blocks) {
  const results = await Promise.all(
    blocks.map(({ id, grid_row, grid_col }) =>
      supabase
        .from("shop_page_blocks")
        .update({ grid_row, grid_col })
        .eq("id", id)
        .select("id")
    )
  );

  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;

  return blocks;
}

export async function deleteProductAPI(productId) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;
}

export async function getCustomerOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminOrders error:", error);
    throw error;
  }

  return data ?? [];
}