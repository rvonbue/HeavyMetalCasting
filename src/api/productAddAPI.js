import { supabase } from "../lib/supabase";

const ADD_PRODUCT_TEMPLATES = {
  ring: {
    name: "New Ring",
    price: 0,
    description: "Ring Description",
    live: false,
    product_categories: [1],
    size_chart: [1],
    metal_types: [1],
  },

  necklace: {
    name: "New Necklace",
    price: 0,
    description: "Necklace Description here",
    live: false,
    product_categories: [2],
    size_chart: [2],
    metal_types: [2],
  },

  earring: {
    name: "New Earring",
    price: 0,
    description: "Earring Description here",
    live: false,
    product_categories: [3],
    size_chart: [3],
    metal_types: [3],
  },

  pin: {
    name: "New Pin",
    price: 0,
    description: "Pin Description here",
    live: false,
    product_categories: [4],
    size_chart: [4],
    metal_types: [4],
  },
};

export async function createProductFromTemplate({
  templateType,
}) {
  const template = ADD_PRODUCT_TEMPLATES[templateType];

  if (!template) {
    throw new Error(`Unknown product template: ${templateType}`);
  }

  const { data, error } = await supabase
    .from("products")
    .insert(template)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}