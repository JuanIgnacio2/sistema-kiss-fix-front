import { OrderTable } from "../components/DataTables";

export default function OrdersView({ orders, onRowClick }) {
  return <OrderTable orders={orders} onRowClick={onRowClick} />;
}
