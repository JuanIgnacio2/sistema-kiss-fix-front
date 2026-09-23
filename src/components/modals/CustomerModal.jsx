import Icon from "../Icon";
import ModalShell from "./ModalShell";

export default function CustomerModal({
  onSubmit,
  onClose,
  error,
  saving,
}) {
  return (
    <ModalShell title="Agregar cliente" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <label className="field">
          <span>Nombre</span>
          <input name="firstName" placeholder="Nombre" required />
        </label>
        <label className="field">
          <span>Apellido</span>
          <input name="lastName" placeholder="Apellido" required />
        </label>
        <label className="field">
          <span>Telefono <small>(opcional)</small></span>
          <input name="phone" type="tel" placeholder="11 5555 5555" />
        </label>
        <label className="field">
          <span>Red social <small>(opcional)</small></span>
          <input name="socialNetwork" placeholder="Instagram, Facebook o WhatsApp" />
        </label>
        <label className="field">
          <span>Observaciones <small>(opcional)</small></span>
          <textarea name="observations" placeholder="Notas del cliente" rows="3" />
        </label>
        {error && <small className="customer-empty">{error}</small>}
        <button className="button primary full" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cliente"} <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}
