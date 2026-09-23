import FormField from "../FormField";
import Icon from "../Icon";
import ModalShell from "./ModalShell";

export default function SaleModal({ onSubmit, onClose }) {
  return (
    <ModalShell title="Registrar venta" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <FormField label="Articulo o servicio" name="sale" placeholder="Busca en el catalogo" required />
        <FormField label="Cantidad" name="quantity" type="number" min="1" placeholder="1" required />
        <FormField label="Precio unitario" name="unitPrice" type="number" min="0" placeholder="$ 0" required />
        <FormField label="Monto total" name="amount" type="number" min="0" placeholder="$ 0" required />
        <button className="button primary full">
          Confirmar venta <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}
