import { useEffect, useState } from "react";
import { getCustomerOrders } from "../../api/adminAPI";
import OrdersTable from "../../components/adminPageComponents/orders/OrdersTable";

export default function OrdersOverviewPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true);
        const data = await getCustomerOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (isLoading) {
    return <div className="p-4 text-hmc-a">Loading orders...</div>;
  }

  return (
    <div className="p-4 h-full">
      <h1 className="mb-4 text-xl font-bold text-hmc-textprimary">Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}