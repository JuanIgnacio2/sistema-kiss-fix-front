import FormField from "../FormField";
import Icon from "../Icon";
import ModalShell from "./ModalShell";

export default function ProductModal({
  onSubmit,
  onClose,
  productCost,
  productPrice,
  onCostChange,
  onPriceChange,
  formatCurrency,
}) {
  return (
    <ModalShell title="Agregar articulo" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <FormField label="Nombre del articulo" name="name" placeholder="Ej: Pantalla iPhone 14" required />
        <FormField label="SKU" name="sku" placeholder="REP-000-01" required />
        <FormField label="Marca" name="brand" placeholder="Ej: Apple, Samsung" required />
        <FormField label="Stock inicial" name="stock" type="number" min="0" placeholder="0" required />
        <FormField label="Precio de costo">
          <input name="cost" type="number" min="0" placeholder="$ 0" value={productCost} onChange={onCostChange} required />
        </FormField>
        <FormField label="Precio de venta">
          <input name="price" type="number" min="0" placeholder="$ 0" value={productPrice} onChange={onPriceChange} required />
        </FormField>
        <FormField label="Utilidad (%)">
          <input
            value={Number(productCost) > 0 && productPrice !== "" ? `${(((Number(productPrice) - Number(productCost)) / Number(productCost)) * 100).toLocaleString("es-AR", { maximumFractionDigits: 2 })}%` : ""}
            placeholder="0%"
            readOnly
          />
        </FormField>
        <FormField label="Ganancia">
          <input
            value={productCost !== "" && productPrice !== "" ? formatCurrency(Number(productPrice) - Number(productCost)) : ""}
            placeholder="$ 0"
            readOnly
          />
        </FormField>
        <button className="button primary full">
          Guardar articulo <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}
