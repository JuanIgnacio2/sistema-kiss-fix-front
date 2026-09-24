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
  mode = "create",
  defaultValues = {},
  error,
  saving,
  categories = [],
}) {
  const isEditing = mode === "edit";

  return (
    <ModalShell title={isEditing ? "Editar articulo" : "Agregar articulo"} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <FormField label="Nombre del articulo" name="name" placeholder="Ej: Pantalla iPhone 14" defaultValue={defaultValues.name ?? defaultValues.nombre ?? ""} required />
        <FormField label="SKU" name="sku" placeholder="REP-000-01" defaultValue={defaultValues.sku ?? ""} required />
        <FormField label="Marca" name="brand" placeholder="Ej: Apple, Samsung" defaultValue={defaultValues.brand ?? defaultValues.marca ?? ""} required />
        <FormField label="Categoria">
          <select name="categoryId" defaultValue={defaultValues.categoryId ?? defaultValues.categoriaId ?? ""} required>
            <option value="">Seleccionar categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Modelo" name="model" placeholder="Ej: A2890" defaultValue={defaultValues.model ?? defaultValues.modelo ?? ""} />
        <FormField label="Descripcion" name="description" placeholder="Descripcion del articulo" defaultValue={defaultValues.description ?? defaultValues.descripcion ?? ""} />
        <FormField label="Stock inicial" name="stock" type="number" min="0" placeholder="0" defaultValue={defaultValues.stock ?? ""} required />
        <FormField label="Stock minimo" name="minStock" type="number" min="0" placeholder="0" defaultValue={defaultValues.min ?? defaultValues.stockminimo ?? "0"} required />
        <FormField label="Codigo de barras" name="barcode" placeholder="Codigo de barras" defaultValue={defaultValues.barcode ?? defaultValues.codigoBarras ?? ""} />
        <FormField label="Unidad de medida" name="unitMeasure" placeholder="Ej: unidad" defaultValue={defaultValues.unitMeasure ?? defaultValues.unidadMedida ?? "unidad"} />
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
        <label className="admin-toggle">
          <span>Producto activo</span>
          <input name="active" type="checkbox" defaultChecked={defaultValues.active ?? defaultValues.activo ?? true} />
        </label>
        {error && <small className="customer-empty">{error}</small>}
        <button className="button primary full" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Actualizar articulo" : "Guardar articulo"} <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}
