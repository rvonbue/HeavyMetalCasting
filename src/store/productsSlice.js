import { createSlice } from '@reduxjs/toolkit'
import { productData } from '../staticData/testData.js'

const initialState = {
  products: [],
  shopProducts: [],
  productsLoading: true,
  productAttributes: {
    productCategories: [
      { id: 1, label: 'rings' },
      { id: 2, label: 'necklaces' },
      { id: 3, label: 'earrings' },
      { id: 4, label: 'pins' },
    ],
    sizeCharts: [
      {
        id: 1,
        label: 'ring_sizes',
        options: [
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
          { label: '10', value: '10' },
          { label: '11', value: '11' },
          { label: '12', value: '12' },
        ],
      },
      {
        id: 2,
        label: 'necklace_lengths',
        options: [
          { label: '16in', value: '16in' },
          { label: '18in', value: '18in' },
          { label: '20in', value: '20in' },
          { label: '22in', value: '22in' },
          { label: '24in', value: '24in' },
        ],
      },
      {
        id: 3,
        label: 'earring_types',
        options: [
          { label: 'studs', value: 'studs' },
          { label: 'hoops', value: 'hoops' },
          { label: 'dangles', value: 'dangles' },
        ],
      },
    ],
  },
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
    {
      adminDisplayName: 'Product Categories',
      dataType: 'list',
      dataName: 'productCategories',
      userEdit: true,
    },
    {
      adminDisplayName: 'Size Chart',
      dataType: 'list',
      dataName: 'sizeCharts',
      userEdit: true,
    },
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
    setProductsLoading(state, action) {
      state.productsLoading = action.payload
    },
    setProducts(state, action) {
      state.products = action.payload;
      state.shopProducts= action.payload.filter(prd => prd.live === true);
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
  },
})




export const {
  setProducts,
  setProductsLoading,
  updateProduct,
  addProduct,
  removeProduct,
} = productsSlice.actions

export default productsSlice.reducer
