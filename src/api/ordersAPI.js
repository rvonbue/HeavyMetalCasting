import { supabase } from "../lib/supabase";
import { getShoppingCartTotals } from "../helpers/dataHelper";

export async function createOrder({
  customer_name,
  customer_email,
  customer_phone,
  shipping,
  tax,
  shoppingCartItems,
}) {
  
 const {totalCost: subtotal} = getShoppingCartTotals(shoppingCartItems);

const total = subtotal + shipping + tax;

  // Create Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name,
      customer_email,
      customer_phone,
      subtotal,
      shipping,
      tax,
      total,
      status: "pending",
    })
    .select("id, order_token")
    .single();

  if (orderError) {
    throw orderError;
  }

  // Create Order Items
  const orderItems = shoppingCartItems.map((item) => ({
    order_id: order.id,

    product_id: item.product_id,
    product_name: item.product_name,

    product_price: item.product_price,

    quantity: item.quantity,

    metal_type: item.metal_type,
    size_chart: item.size_chart,

    line_total: item.product_price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }

  return order;
}

export async function getOrderByToken(orderToken) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items:order_items (
        *
      )
    `)
    .eq("order_token", orderToken)
    .single();

  if (error) throw error;

  return data;
}
