import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createOrder } from "../../api/ordersAPI.js";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shoppingCartItems = useSelector(
    (state) => state.cart.shoppingCartItems
  );

  async function handlePlaceOrder() {
    if (!shoppingCartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setIsSubmitting(true);

      const order = await createOrder({
        customer_name: "Test Customer",
        customer_email: "test@example.com",
        customer_phone: "",
        shipping: 0,
        tax: 0,
        shoppingCartItems,
      });

      toast.success("Order placed successfully!");

      navigate(`/order_status/${order.order_token}`);
    } catch (error) {
      console.error(error);
      toast.error("Could not place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-6 text-hmc-c">
      <h1 className="mb-6 text-center text-3xl font-bold">Payment</h1>

      <div className="rounded border border-hmc-c/60 bg-hmc-a/20 p-5">
        <h2 className="mb-4 text-xl font-bold">Payment Details</h2>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* your inputs here */}
      <div>
            <label className="mb-1 block text-xs font-bold uppercase">
              Name on Card
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded border border-hmc-c/50 bg-white px-3 py-2 text-hmc-a"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase">
              Card Number
            </label>
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              className="w-full rounded border border-hmc-c/50 bg-white px-3 py-2 text-hmc-a"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase">
                Expiration
              </label>
              <input
                type="text"
                placeholder="12/30"
                className="w-full rounded border border-hmc-c/50 bg-white px-3 py-2 text-hmc-a"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full rounded border border-hmc-c/50 bg-white px-3 py-2 text-hmc-a"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="mt-4 w-full rounded bg-hmc-button-a px-4 py-2 font-bold text-hmc-a transition hover:bg-hmc-button-b disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Placing Order..." : "Place Fake Order"}
          </button>
        </form>
      </div>
    </main>
  );
}