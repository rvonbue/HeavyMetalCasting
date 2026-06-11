import { useSelector } from "react-redux";
import { Button_A } from "../../components/Resuables";


export default function CheckoutPage() {
  const shoppingCartItems = useSelector(
    (state) => state.cart.shoppingCartItems
  );

  const products = useSelector((state) => state.products.products);

  const checkoutItems = shoppingCartItems
    .map((cartItem) => {
      const product = products.find(
        (product) => product.id === cartItem.product_id
      );

      if (!product) return null;

      const price = Number(product.price ?? 0);
      const quantity = Number(cartItem.quantity ?? 0);

      return {
        ...cartItem,
        product,
        price,
        lineTotal: price * quantity,
      };
    })
    .filter(Boolean);

  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.lineTotal,
    0
  );

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-4 text-hmc-c">
  <h1 className="mb-5 text-center text-3xl font-bold">Checkout</h1>

  <div className="space-y-3">
    {checkoutItems.map((item) => (
      <CheckoutItemRow key={item.id} item={item} />
    ))}
  </div>

  <aside className="mt-5 rounded border border-hmc-c/60 bg-hmc-a/20 p-4">
    <h2 className="mb-4 text-center text-xl font-bold">Order Summary</h2>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Shipping</span>
        <span>Calculated later</span>
      </div>
    </div>

    <div className="mt-4 border-t border-hmc-c/60 pt-3">
      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
    </div>

    <Button_A
      button_name="Continue to Payment"
      link_val="/payment"
      extraClassNames={"mt-6 w-full"}
    >
      Continue to Payment
    </Button_A>
  </aside>
</main>
  );
}

function CheckoutItemRow({ item }) {
  const { product, quantity, metal_type, size_chart, price, lineTotal } = item;

  const image =
    product.product_images?.[0]?.thumbnail_url ||
    product.product_images?.[0]?.image_url;

  return (
    <div className="grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded border border-hmc-c/60 bg-hmc-a/20 p-3">
      <div className="h-16 w-16 overflow-hidden rounded border border-hmc-c/50">
        {image && (
          <img
            src={image}
            alt={product.name || product.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-hmc-c text-left">
          {product.name || product.title}
        </h2>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-hmc-c/80">
          <span>
            <strong>Metal:</strong> {metal_type}
          </span>
          <span>
            <strong>Size:</strong> {size_chart}
          </span>
          <span>
            <strong>Qty:</strong> {quantity}
          </span>
        </div>
      </div>

      <div className="text-right text-sm text-hmc-c">
        <div>${price.toFixed(2)}</div>
        <div className="text-lg font-bold">${lineTotal.toFixed(2)}</div>
      </div>
    </div>
  );
}