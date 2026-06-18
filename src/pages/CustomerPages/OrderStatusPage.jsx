import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderByToken } from "../../api/ordersAPI";

export default function OrderStatusPage() {
  const { orderToken } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setIsLoading(true);
        setErrorMsg("");

        const orderData = await getOrderByToken(orderToken);

        setOrder(orderData);
      } catch (error) {
        console.error(error);
        setErrorMsg("Could not find this order.");
      } finally {
        setIsLoading(false);
      }
    }

    if (orderToken) {
      loadOrder();
    }
  }, [orderToken]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 text-hmc-c">
        Loading order...
      </main>
    );
  }

  if (errorMsg || !order) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 text-hmc-c">
        <div className=" border border-red-300 p-6">
          <h1 className="mb-2 text-2xl font-bold">
            Order Not Found
          </h1>

          <p>{errorMsg}</p>

          <Link
            to="/shop"
            className="mt-4 inline-block  bg-hmc-button-a px-4 py-2 font-bold text-hmc-textprimary transition hover:bg-hmc-button-b"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  console.log("order", order);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 text-hmc-c">
      <div className="border border-hmc-c/60 p-6 shadow bg-hmc-panelbackground">
        <h1 className="mb-2 text-3xl font-bold">
          Order Status
        </h1>

        <p className="mb-1 text-sm">
          Order Token:
          <span className="ml-2 font-bold">
            {order.order_token}
          </span>
        </p>

        <p className="mb-6 text-sm">
          Status:
          <span className="ml-2  border border-hmc-c px-2 py-1 font-bold uppercase">
            {order.status}
          </span>
        </p>

        <div className="mb-6 border-t border-hmc-c/30 pt-4">
          <h2 className="mb-3 text-xl font-bold">
            Customer Information
          </h2>

          <div className="space-y-1">
            <p>{order.customer_name}</p>
            <p>{order.customer_email}</p>

            {order.customer_phone && (
              <p>{order.customer_phone}</p>
            )}
          </div>
        </div>

        <div className="mb-6 border-t border-hmc-c/30 pt-4">
          <h2 className="mb-3 text-xl font-bold">
            Order Items
          </h2>

          <div className="space-y-3">
            {order.order_items?.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between  border border-hmc-c/30 p-3"
              >
                <div>
                  <p className="font-bold">
                    {item.product_name}
                  </p>

                  <p className="text-sm">
                    Quantity: {item.quantity}
                  </p>

                  {item.metal_type && (
                    <p className="text-sm">
                      Metal Type: {item.metal_type}
                    </p>
                  )}

                  {item.size_chart && (
                    <p className="text-sm">
                      Size: {item.size_chart}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p>
                    ${Number(item.product_price).toFixed(2)}
                  </p>

                  <p className="font-bold">
                    ${Number(item.line_total).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-hmc-c/30 pt-4">
          <div className="ml-auto max-w-xs space-y-1 text-right">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ${Number(order.subtotal).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                ${Number(order.shipping).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>
                ${Number(order.tax).toFixed(2)}
              </span>
            </div>

            <div className="mt-2 flex justify-between border-t border-hmc-c/30 pt-2 text-xl font-bold">
              <span>Total</span>
              <span>
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className=" bg-hmc-button-a px-4 py-2 font-bold text-hmc-textprimary transition hover:bg-hmc-button-b"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}