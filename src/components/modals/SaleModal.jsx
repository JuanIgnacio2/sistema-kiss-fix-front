import FormField from "../FormField";
import Icon from "../Icon";
import ModalShell from "./ModalShell";

export default function SaleModal({
  onSubmit,
  onClose,
  mode = "create",
  defaultValues = {},
  error,
  saving,
}) {
  const isEditing = mode === "edit";

  return (
    <ModalShell title={isEditing ? "Editar venta" : "Registrar venta"} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <FormField label="Articulo o servicio" name="sale" placeholder="Busca en el catalogo" defaultValue={defaultValues.item ?? defaultValues.articulo ?? ""} required />
        <FormField label="Cantidad" name="quantity" type="number" min="1" placeholder="1" defaultValue={defaultValues.quantity ?? defaultValues.cantidad ?? ""} required />
        <FormField label="Precio unitario" name="unitPrice" type="number" min="0" placeholder="$ 0" defaultValue={defaultValues.unitPrice ?? defaultValues.precioUnitario ?? ""} required />
        <FormField label="Monto total" name="amount" type="number" min="0" placeholder="$ 0" defaultValue={defaultValues.amount ?? defaultValues.montoTotal ?? defaultValues.total ?? ""} required />
        {error && <small className="customer-empty">{error}</small>}
        <button className="button primary full" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Actualizar venta" : "Confirmar venta"} <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}
