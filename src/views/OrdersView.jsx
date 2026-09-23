import { OrderTable } from "../components/DataTables";

export default function OrdersView({ orders }) {
  return <OrderTable orders={orders} />;
}
