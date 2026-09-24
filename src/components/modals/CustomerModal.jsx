import Icon from "../Icon";
import ModalShell from "./ModalShell";

export default function CustomerModal({
  onSubmit,
  onClose,
  error,
  saving,
  mode = "create",
  defaultValues = {},
}) {
  const isEditing = mode === "edit";

  return (
    <ModalShell title={isEditing ? "Editar cliente" : "Agregar cliente"} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <label className="field">
          <span>Nombre</span>
          <input
            name="nombre"
            placeholder="Nombre"
            required
            defaultValue={defaultValues.nombre ?? defaultValues.name ?? ""}
          />
        </label>
        <label className="field">
          <span>Apellido</span>
          <input
            name="apellido"
            placeholder="Apellido"
            required
            defaultValue={defaultValues.apellido ?? defaultValues.lastName ?? ""}
          />
        </label>
        <label className="field">
          <span>Telefono <small>(opcional)</small></span>
          <input
            name="telefono"
            type="tel"
            placeholder="11 5555 5555"
            defaultValue={defaultValues.telefono ?? defaultValues.phone ?? ""}
          />
        </label>
        <label className="field">
          <span>Red social <small>(opcional)</small></span>
          <input
            name="redSocial"
            placeholder="Instagram, Facebook o WhatsApp"
            defaultValue={defaultValues.redSocial ?? defaultValues.socialNetwork ?? ""}
          />
        </label>
        <label className="field">
          <span>Observaciones <small>(opcional)</small></span>
          <textarea
            name="observaciones"
            placeholder="Notas del cliente"
            rows="3"
            defaultValue={defaultValues.observaciones ?? defaultValues.observations ?? ""}
          />
        </label>
        {error && <small className="customer-empty">{error}</small>}
        <button className="button primary full" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Actualizar cliente" : "Guardar cliente"} <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}
