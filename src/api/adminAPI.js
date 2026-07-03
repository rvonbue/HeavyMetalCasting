import { supabase } from '../lib/supabase';

export async function getAdminInitialData() {
  const [fieldsRes, columnsRes, blocksRes] = await Promise.all([
    supabase.from("admin_product_fields").select("*").order("sort_order"),
    supabase.rpc("get_product_columns"),
    supabase
      .from("shop_page_blocks")
      .select("*, admin_product_fields(column_name, input_type, label)")
      .order("grid_row")
      .order("grid_col"),
  ]);

  if (fieldsRes.error) throw fieldsRes.error;
  if (columnsRes.error) throw columnsRes.error;
  if (blocksRes.error) throw blocksRes.error;

  return {
    productEditFields: fieldsRes.data,
    productColumns: columnsRes.data ?? [],
    shopBlocks: blocksRes.data ?? [],
  };
}

const SHOP_BLOCK_SELECT = "*, admin_product_fields(column_name, input_type, label)";

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

const NO_ROWS_MSG =
  "No rows updated — check the RLS UPDATE policy on admin_product_fields.";

export async function updateProductFieldAPI({ id, updates }) {
  const { data, error } = await supabase
    .from("admin_product_fields")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error(NO_ROWS_MSG);

  return data[0];
}

export async function createProductFieldAPI(newField) {
  const { data, error } = await supabase
    .from("admin_product_fields")
    .insert(newField)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error(NO_ROWS_MSG);

  return data[0];
}

// orderedFields: [{ id, customer_sort_order }, ...]
export async function updateProductFieldsOrderAPI(orderedFields) {
  const results = await Promise.all(
    orderedFields.map(({ id, customer_sort_order }) =>
      supabase
        .from("admin_product_fields")
        .update({ customer_sort_order })
        .eq("id", id)
        .select()
    )
  );

  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
  if (results.some((r) => !r.data || r.data.length === 0)) {
    throw new Error(NO_ROWS_MSG);
  }

  return results.flatMap((r) => r.data);
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