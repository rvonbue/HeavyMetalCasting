import { supabase } from '../lib/supabase';

export async function getAdminInitialData() {
  const { data, error } = await supabase
    .from("admin_product_fields")
    .select("*")
    .order("sort_order");

  if (error) {
    throw error;
  }

  return {
    productEditFields: data,
  };
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