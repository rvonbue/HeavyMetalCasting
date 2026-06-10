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
  productEditFields: [],
  productProps: [
    {
      adminDisplayName: 'ID',
      dataType: 'number',
      dataName: 'id',
      userEdit: false,
      classNames: 'min-w-36',
    },
    {
      adminDisplayName: 'Product Name',
      dataType: 'text',
      dataName: 'name',
      userEdit: true,
      classNames: 'min-w-36',
    },
    // {
    //   adminDisplayName: 'Product Categories',
    //   dataType: 'list',
    //   dataName: 'product_categories',
    //   userEdit: true,
    // },
    // {
    //   adminDisplayName: 'Size Chart',
    //   dataType: 'list',
    //   dataName: 'size_charts',
    //   userEdit: true,
    // },
    {
      adminDisplayName: 'Live',
      dataType: 'checkbox',
      dataName: 'live',
      userEdit: true,
    },
    {
      adminDisplayName: 'Price($)',
      dataType: 'number',
      dataName: 'price',
      userEdit: true,
    },
    {
      adminDisplayName: 'Stock',
      dataType: 'number',
      dataName: 'stock',
      userEdit: true,
    },
    {
      adminDisplayName: 'Description',
      dataType: 'textarea',
      dataName: 'description',
      userEdit: true,
    },
  ],
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
      const { id, updates } = action.payload
      const product = state.products.find(p => p.id === id)
      if (product) {
        Object.assign(product, updates)
      }
    },
    addProduct(state, action) {
      state.products.push(action.payload)
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
  addProductImages
} = productsSlice.actions

export default productsSlice.reducer
