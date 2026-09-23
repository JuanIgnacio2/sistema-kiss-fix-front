import { CustomerTable } from "../components/DataTables";

export default function CustomersView({ customers, totalCustomers }) {
  return (
    <CustomerTable
      customers={customers}
      totalCustomers={totalCustomers}
    />
  );
}
