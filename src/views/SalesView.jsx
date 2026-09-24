import { SalesTable } from "../components/DataTables";

export default function SalesView({ sales, onRowClick }) {
  return <SalesTable sales={sales} onRowClick={onRowClick} />;
}
