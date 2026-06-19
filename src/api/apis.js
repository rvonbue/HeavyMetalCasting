import { supabase } from '../lib/supabase';
import {
  setAppData,
  setProductsLoading,
} from '../store/productsSlice';
import { setSettings } from '../store/settingsSlice';
import { getStoreSettingsAPI } from './storeSettingsAPI';

export async function loadAppData(dispatch) {
  try {
    dispatch(setProductsLoading(true));

    const [{ data, error }, settingsRows] = await Promise.all([
      supabase.rpc('get_app_data'),
      getStoreSettingsAPI(),
    ]);
    if (error) throw error;

    dispatch(
      setAppData({
        products: data.products.map((product) => ({
          ...product,
          product_categories: product.product_categories ?? [],
          size_chart: product.size_chart ?? [],
          product_images: product.product_images ?? [],
        })),
        product_categories: data.product_categories,
        size_charts: data.size_charts,
        metal_types: data.metal_types,
      })
    );
    dispatch(setSettings(settingsRows));
  } catch (error) {
    console.error('Failed loading app data', error);
  } finally {
    dispatch(setProductsLoading(false));
  }
}