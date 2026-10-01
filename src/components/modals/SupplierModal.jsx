import FormField from "../FormField";
import Icon from "../Icon";
import ModalShell from "./ModalShell";

export default function SupplierModal({
  defaultValues = {},
  error,
  saving,
  onSubmit,
  onClose,
  mode = "create",
}) {
  const isEditing = mode === "edit";

  return (
    <ModalShell
      title={isEditing ? "Editar proveedor" : "Nuevo proveedor"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit}>
        <FormField
          label="Razon social"
          name="razonSocial"
          defaultValue={defaultValues.razonSocial ?? ""}
          required
        />
        <FormField
          label="Nombre de contacto"
          name="nombreContacto"
          defaultValue={defaultValues.nombreContacto ?? ""}
        />
        <FormField
          label="CUIT"
          name="cuit"
          defaultValue={defaultValues.cuit ?? ""}
        />
        <FormField
          label="Telefono"
          name="telefono"
          type="tel"
          defaultValue={defaultValues.telefono ?? ""}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          defaultValue={defaultValues.email ?? ""}
        />
        <FormField
          label="Direccion"
          name="direccion"
          defaultValue={defaultValues.direccion ?? ""}
        />
        <FormField
          label="Localidad"
          name="localidad"
          defaultValue={defaultValues.localidad ?? ""}
        />
        <FormField label="Observaciones">
          <textarea
            name="observaciones"
            rows="3"
            defaultValue={defaultValues.observaciones ?? ""}
          />
        </FormField>
        <label className="admin-toggle">
          <span>Proveedor activo</span>
          <input name="activo" type="checkbox" defaultChecked={defaultValues.activo ?? true} />
        </label>
        {error && <small className="customer-empty">{error}</small>}
        <button className="button primary full" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Actualizar proveedor" : "Guardar proveedor"}
          <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}