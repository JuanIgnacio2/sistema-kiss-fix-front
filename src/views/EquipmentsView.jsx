import { useEffect, useState } from "react";
import { createEquipo, getTiposEquipo, getEquipos, updateEquipo } from "../services/endpointAPI";
import Icon from "../components/Icon";
import EquipmentModal from "../components/modals/EquipmentModal";

function responseItems(response) {
  const items = response?.data ?? response;
  const values = items?.value ?? items;
  return Array.isArray(values) ? values : [];
}

function responseItem(response) {
  return response?.data && !Array.isArray(response.data) ? response.data : response;
}

function normalizeEquipment(equipment = {}) {
  return {
    ...equipment,
    id: equipment.id ?? equipment.idEquipo ?? equipment.idEquipos,
    customerId:
      equipment.customerId ?? equipment.idCliente ?? equipment.idcliente ?? equipment.cliente?.id,
    customerName:
      equipment.customerName ??
      equipment.nombreCliente ??
      equipment.clienteNombre ??
      equipment.cliente?.nombreCompleto ??
      equipment.cliente?.nombre ??
      "",
    deviceTypeId:
      equipment.deviceTypeId ?? equipment.idTipo ?? equipment.tipoEquipoId ?? equipment.idTipoEquipo ?? equipment.tipoEquipo?.id,
    deviceTypeName:
      equipment.deviceTypeName ??
      equipment.tipoEquipoNombre ??
      (typeof equipment.tipoEquipo === "string" ? equipment.tipoEquipo : equipment.tipoEquipo?.nombre) ??
      "",
    brand: equipment.brand ?? equipment.marca ?? "",
    model: equipment.model ?? equipment.modelo ?? "",
    serialNumber: equipment.serialNumber ?? equipment.numeroSerie ?? "",
    color: equipment.color ?? "",
    imei1: equipment.imei1 ?? "",
    imei2: equipment.imei2 ?? "",
    password: equipment.password ?? equipment.contraseña ?? equipment.contrasena ?? "",
    observations: equipment.observations ?? equipment.observaciones ?? "",
  };
}

export default function EquipmentsView({ customers, query = "" }) {
  const [equipments, setEquipments] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.allSettled([getEquipos(), getTiposEquipo()]).then(
      ([equipmentsResult, typesResult]) => {
        if (equipmentsResult.status === "fulfilled") {
          setEquipments(responseItems(equipmentsResult.value).map(normalizeEquipment));
        } else {
          setLoadError("No se pudieron cargar los equipos.");
        }

        if (typesResult.status === "fulfilled") {
          setEquipmentTypes(
            responseItems(typesResult.value)
              .map((equipmentType) => ({
                id: equipmentType.id ?? equipmentType.idTipoEquipo ?? equipmentType.idTipo,
                nombre: equipmentType.nombre ?? equipmentType.name ?? "",
              }))
              .filter((equipmentType) => equipmentType.id != null && equipmentType.nombre),
          );
        } else {
          setLoadError("No se pudieron cargar los tipos de equipo.");
        }
      },
    );
  }, []);

  const visibleEquipments = equipments.filter((equipment) =>
    [
      equipment.customerName,
      equipment.deviceTypeName,
      equipment.brand,
      equipment.model,
      equipment.serialNumber,
      equipment.color,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  function closeModal() {
    setModalOpen(false);
    setEditingEquipment(null);
    setError("");
  }

  async function saveEquipment(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const equipment = {
      customerId: Number(form.get("customerId")),
      deviceTypeId: Number(form.get("deviceTypeId")),
      brand: String(form.get("brand") ?? "").trim(),
      model: String(form.get("model") ?? "").trim(),
      serialNumber: String(form.get("serialNumber") ?? "").trim(),
      color: String(form.get("color") ?? "").trim(),
      imei1: String(form.get("imei1") ?? "").trim(),
      imei2: String(form.get("imei2") ?? "").trim(),
      password: String(form.get("password") ?? "").trim(),
      observations: String(form.get("observations") ?? "").trim(),
    };

    setSaving(true);
    setError("");
    try {
      const result = editingEquipment
        ? await updateEquipo(editingEquipment.id, equipment)
        : await createEquipo(equipment);
      const saved = normalizeEquipment({
        ...(editingEquipment ?? {}),
        ...equipment,
        ...responseItem(result),
      });

      setEquipments((currentEquipments) =>
        editingEquipment
          ? currentEquipments.map((item) => item.id === editingEquipment.id ? saved : item)
          : [saved, ...currentEquipments],
      );
      closeModal();
    } catch (saveError) {
      setError(
        saveError.response?.data?.message ||
          saveError.response?.data?.error ||
          "No se pudo guardar el equipo. Intenta nuevamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  function customerName(equipment) {
    if (equipment.customerName) return equipment.customerName;
    const customer = customers.find(
      (item) => String(item.id) === String(equipment.customerId),
    );
    return customer?.name ?? "Sin cliente";
  }

  function equipmentTypeName(equipment) {
    if (equipment.deviceTypeName) return equipment.deviceTypeName;
    return equipmentTypes.find(
      (item) => String(item.id) === String(equipment.deviceTypeId),
    )?.nombre ?? "Sin tipo";
  }

  return (
    <>
      <section className="panel orders-panel">
        <div className="panel-heading">
          <div>
            <h2>Equipos registrados</h2>
            <p className="muted">{equipments.length} equipos en el registro</p>
          </div>
          <button
            className="button primary"
            type="button"
            onClick={() => {
              setEditingEquipment(null);
              setError("");
              setModalOpen(true);
            }}
          >
            <Icon type="plus" /> Nuevo equipo
          </button>
        </div>
        {loadError && <small className="admin-error">{loadError}</small>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>EQUIPO</th>
                <th>CLIENTE</th>
                <th>NUMERO DE SERIE</th>
                <th>COLOR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleEquipments.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    {equipments.length === 0
                      ? "Todavia no hay equipos registrados"
                      : "No se encontraron equipos"}
                  </td>
                </tr>
              ) : (
                visibleEquipments.map((equipment, index) => (
                  <tr key={equipment.id ?? `${equipment.brand}-${equipment.model}-${index}`}>
                    <td>
                      <strong>{equipment.brand} {equipment.model}</strong>
                      <small>{equipmentTypeName(equipment)}</small>
                    </td>
                    <td>{customerName(equipment)}</td>
                    <td>{equipment.serialNumber || "-"}</td>
                    <td>{equipment.color || "-"}</td>
                    <td>
                      <button
                        className="admin-edit-button"
                        type="button"
                        onClick={() => {
                          setEditingEquipment(equipment);
                          setError("");
                          setModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      {modalOpen && (
        <EquipmentModal
          customers={customers}
          equipmentTypes={equipmentTypes}
          defaultValues={editingEquipment ?? {}}
          error={error}
          saving={saving}
          onSubmit={saveEquipment}
          onClose={closeModal}
          mode={editingEquipment ? "edit" : "create"}
        />
      )}
    </>
  );
}