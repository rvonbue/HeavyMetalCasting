import { supabase } from '../lib/supabase';

// Get user profile
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to get user profile');
  }
}

// Update user profile
export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile');
  }
}

// Get user's shipping addresses
export async function getUserAddresses(userId) {
  try {
    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(error.message || 'Failed to get addresses');
  }
}

// Add shipping address
export async function addShippingAddress(userId, address) {
  try {
    const { data, error } = await supabase
      .from('shipping_addresses')
      .insert([
        {
          user_id: userId,
          ...address,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to add address');
  }
}

// Update shipping address
export async function updateShippingAddress(addressId, updates) {
  try {
    const { data, error } = await supabase
      .from('shipping_addresses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', addressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update address');
  }
}

// Delete shipping address
export async function deleteShippingAddress(addressId) {
  try {
    const { error } = await supabase
      .from('shipping_addresses')
      .delete()
      .eq('id', addressId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw new Error(error.message || 'Failed to delete address');
  }
}

// Set default shipping address
export async function setDefaultAddress(userId, addressId) {
  try {
    // Unset all other defaults
    await supabase
      .from('shipping_addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Set this one as default
    const { data, error } = await supabase
      .from('shipping_addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to set default address');
  }
}

// Update theme preference
export async function updateThemePreference(userId, theme) {
  return updateUserProfile(userId, { theme });
}

// Update marketing subscription
export async function updateMarketingSubscription(userId, subscribe) {
  return updateUserProfile(userId, { subscribe_marketing: subscribe });
}
