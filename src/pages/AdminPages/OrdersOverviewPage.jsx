import { useEffect, useState } from "react";
import { getCustomerOrders } from "../../api/adminAPI";
import OrdersTable from "../../components/adminPageComponents/orders/OrdersTable";
import { PageContainer, AdminPageHeader } from "../../components/Resuables";

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
    return <PageContainer bg="admin"><div className="text-hmc-textprimary">Loading orders...</div></PageContainer>;
  }

  return (
    <PageContainer bg="admin">
      <AdminPageHeader title="Orders Overview" />
      <OrdersTable orders={orders} />
    </PageContainer>
  );
}