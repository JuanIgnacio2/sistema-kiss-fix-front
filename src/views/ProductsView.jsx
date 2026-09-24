import { ProductTable } from "../components/DataTables";

export default function ProductsView({ products, onRowClick }) {
  return <ProductTable products={products} onRowClick={onRowClick} />;
}
