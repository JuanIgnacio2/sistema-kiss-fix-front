import { ProductTable } from "../components/DataTables";

export default function ProductsView({ products }) {
  return <ProductTable products={products} />;
}
