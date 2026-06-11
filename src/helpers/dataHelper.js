
export const getProductImageLinks = (product) => {
  if (!product) return   { originalImageSrc: '', thumbnailSrc: '' };
  const heroImage = product.product_images?.[0];
  const originalImageSrc = heroImage.image_url;
  const thumbnailSrc = product.product_images?.[0]?.thumbnail_url || originalImageSrc;

  return { originalImageSrc, thumbnailSrc };
}
export function getCartItemId({ productId, metalTypeSelected, sizeSelected }) {
  return Object.values({ productId, metalTypeSelected, sizeSelected }).join("_");
}
export function getProductPropDisplayLabel({ metal_type, size_chart, size_charts, metal_types }) { 
  return {  
    metalLabel: metal_types ? metal_types.find(option => option.id === metal_type)?.label || metal_type : metal_type, 
    sizeLabel: size_charts ? size_charts.find(option => option.id === size_chart)?.label || size_chart : size_chart
  }
}

export function getUpdateCartProduct({ product, newQuantity, metalTypeSelected, sizeSelected}) { 
  const cartItemId = getCartItemId({ productId: product.id, metalTypeSelected, sizeSelected });

  return {
     id: cartItemId, 
     product_id: product.id,
     quantity: newQuantity, 
     metal_type: metalTypeSelected, 
     size_chart: sizeSelected 
  }
}

export function getShoppingCartItemDetails({
  products,
  shoppingCartItems,
}) {
  const productMap = Object.fromEntries(
    products.map((product) => [product.id, product])
  );

  const shoppingCartItemsList = shoppingCartItems
    .map((cartItem) => {
      const product = productMap[cartItem.product_id];

      if (!product) {
        return null;
      }

      return {
        ...product,
        ...cartItem,
      };
    })
    .filter(Boolean);

  const { totalQuantities, totalCost } = shoppingCartItemsList.reduce(
    (acc, item) => {
      acc.totalQuantities += item.quantity;
      acc.totalCost += item.price * item.quantity;
      return acc;
    },
    {
      totalQuantities: 0,
      totalCost: 0,
    }
  );

  return {
    shoppingCartItemsList,
    totalQuantities,
    totalCost: Number(totalCost.toFixed(2)),
  };
}
