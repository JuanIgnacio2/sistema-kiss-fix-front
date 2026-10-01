import FormField from "../FormField";
import Icon from "../Icon";
import ModalShell from "./ModalShell";

export default function EquipmentModal({
  customers,
  equipmentTypes,
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
      title={isEditing ? "Editar equipo" : "Registrar equipo"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit}>
        <FormField label="Cliente">
          <select
            name="customerId"
            defaultValue={defaultValues.customerId ?? defaultValues.idcliente ?? ""}
            required
          >
            <option value="">Seleccionar cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Tipo de equipo">
          <select
            name="deviceTypeId"
            defaultValue={defaultValues.deviceTypeId ?? defaultValues.tipoEquipoId ?? ""}
            required
          >
            <option value="">Seleccionar tipo</option>
            {equipmentTypes.map((equipmentType) => (
              <option key={equipmentType.id} value={equipmentType.id}>
                {equipmentType.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Marca"
          name="brand"
          placeholder="Ej: Apple"
          defaultValue={defaultValues.brand ?? defaultValues.marca ?? ""}
          required
        />
        <FormField
          label="Modelo"
          name="model"
          placeholder="Ej: iPhone 15 Pro"
          defaultValue={defaultValues.model ?? defaultValues.modelo ?? ""}
          required
        />
        <FormField
          label="Numero de serie"
          name="serialNumber"
          defaultValue={defaultValues.serialNumber ?? defaultValues.numeroSerie ?? ""}
        />
        <FormField
          label="Color"
          name="color"
          defaultValue={defaultValues.color ?? ""}
        />
        <FormField
          label="IMEI 1"
          name="imei1"
          defaultValue={defaultValues.imei1 ?? ""}
        />
        <FormField
          label="IMEI 2"
          name="imei2"
          defaultValue={defaultValues.imei2 ?? ""}
        />
        <FormField
          label="Contrasena del equipo"
          name="password"
          defaultValue={defaultValues.password ?? defaultValues.contraseña ?? ""}
        />
        <FormField label="Observaciones">
          <textarea
            name="observations"
            rows="3"
            defaultValue={defaultValues.observations ?? defaultValues.observaciones ?? ""}
          />
        </FormField>
        {error && <small className="customer-empty">{error}</small>}
        <button className="button primary full" disabled={saving}>
          {saving ? "Guardando..." : isEditing ? "Actualizar equipo" : "Guardar equipo"}
          <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}