import { SalesTable } from "../components/DataTables";

export default function SalesView({ sales }) {
  return <SalesTable sales={sales} />;
}
