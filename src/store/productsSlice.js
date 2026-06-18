import { createSlice } from '@reduxjs/toolkit'
import { productData } from '../staticData/testData.js'

const initialState = {
  products: [],
  shopProducts: [],
  productsLoading: true,
  productAttributes: {
    product_categories: [],
    size_charts: [],
    metal_types: []
  },
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAppData(state, action) {
      const {
        products,
        product_categories,
        size_charts,
        metal_types,
      } = action.payload;
      
      console.log("setAppData:action", action);
      state.products = products ?? [];
      state.shopProducts = state.products.filter(prd => prd.live);
      state.productAttributes.product_categories = product_categories ?? [];
      state.productAttributes.size_charts = size_charts ?? [];
      state.productAttributes.metal_types = metal_types ?? [];
      state.productsLoading = false;
    },
    setProductsLoading(state, action) {
      state.productsLoading = action.payload
    },
    setProducts(state, action) {
      state.products = action.payload;
      state.shopProducts= action.payload.filter(prd => prd.live === true);
    },
    setProductEditFields(state, action){
      state.productEditFields = action.payload;
    },
    updateProduct(state, action) {
      const updatedProduct = action.payload;

      const index = state.products.findIndex(
        (product) => product.id === updatedProduct.id
      );

      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...updatedProduct,
        };
      }
    },
    addProduct(state, action) {
      state.products.push({ product_images: [], product_variants: [], ...action.payload})
    },
    removeProduct(state, action) {
      state.products = state.products.filter(
        product => product.id !== action.payload
      )
    },
    addProductImages: (state, action) => {
      const { productId, images } = action.payload;

      const product = state.products.find(
        (p) => p.id === productId
      );

      if (!product) return;

      product.product_images ??= [];
      product.product_images.push(...images);
    },
    removeProductImage: (state, action) => {
      const { productId, imageId } = action.payload;

      const product = state.products.find(
        (p) => p.id === productId
      );

      if (!product) return;

      product.product_images = product.product_images.filter(
        (image) => image.id !== imageId
      );
    },
    reorderProductImages: (state, action) => {
      const { productId, images } = action.payload;

      const product = state.products.find(
        (p) => p.id === productId
      );

      if (!product) return;

      product.product_images = images;
    },
    upsertProductVariants: (state, action) => {
      const { productId, variants } = action.payload;

      const product = state.products.find((p) => p.id === productId);
      if (!product) return;

      product.product_variants ??= [];

      for (const incoming of variants) {
        const idx = product.product_variants.findIndex(
          (v) =>
            v.size_chart_id === incoming.size_chart_id &&
            v.size_value === incoming.size_value &&
            v.metal_type_id === incoming.metal_type_id
        );

        if (idx !== -1) {
          product.product_variants[idx] = { ...product.product_variants[idx], ...incoming };
        } else {
          product.product_variants.push(incoming);
        }
      }
    },
  },
})

export const {
  setAppData,
  setProductsLoading,
  setProducts,
  setProductEditFields,
  updateProduct,
  addProduct,
  removeProduct,
  addProductImages,
  removeProductImage,
  reorderProductImages,
  upsertProductVariants,
} = productsSlice.actions

export default productsSlice.reducer
