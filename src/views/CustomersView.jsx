import { CustomerTable } from "../components/DataTables";

export default function CustomersView({ customers, totalCustomers, onRowClick }) {
  return (
    <CustomerTable
      customers={customers}
      totalCustomers={totalCustomers}
      onRowClick={onRowClick}
    />
  );
}
