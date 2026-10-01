import { useEffect, useState } from "react";
import { createProveedor, getProveedores, updateProveedor } from "../services/endpointAPI";
import Icon from "../components/Icon";
import SupplierModal from "../components/modals/SupplierModal";

function responseItems(response) {
  const items = response?.data ?? response;
  const values = items?.value ?? items;
  return Array.isArray(values) ? values : [];
}

function responseItem(response) {
  const item = response?.data ?? response;
  return item?.value ?? item;
}

function normalizeSupplier(supplier = {}) {
  return {
    ...supplier,
    id: supplier.id ?? supplier.idProveedor ?? supplier.proveedorId,
    razonSocial: supplier.razonSocial ?? supplier.nombre ?? supplier.businessName ?? "",
    nombreContacto: supplier.nombreContacto ?? supplier.contacto ?? supplier.name ?? "",
    cuit: supplier.cuit ?? supplier.taxId ?? "",
    telefono: supplier.telefono ?? supplier.phone ?? "",
    email: supplier.email ?? "",
    direccion: supplier.direccion ?? supplier.address ?? "",
    localidad: supplier.localidad ?? supplier.city ?? "",
    observaciones: supplier.observaciones ?? supplier.observations ?? "",
    activo: supplier.activo ?? supplier.active ?? true,
  };
}

export default function SuppliersView({ query = "" }) {
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProveedores()
      .then((response) => setSuppliers(responseItems(response).map(normalizeSupplier)))
      .catch(() => setLoadError("No se pudieron cargar los proveedores."));
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    [
      supplier.razonSocial,
      supplier.nombreContacto,
      supplier.cuit,
      supplier.telefono,
      supplier.email,
      supplier.localidad,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  function closeModal() {
    setModalOpen(false);
    setEditingSupplier(null);
    setError("");
  }

  async function saveSupplier(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supplier = {
      razonSocial: String(form.get("razonSocial") ?? "").trim(),
      nombreContacto: String(form.get("nombreContacto") ?? "").trim(),
      cuit: String(form.get("cuit") ?? "").trim(),
      telefono: String(form.get("telefono") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      direccion: String(form.get("direccion") ?? "").trim(),
      localidad: String(form.get("localidad") ?? "").trim(),
      observaciones: String(form.get("observaciones") ?? "").trim(),
      activo: form.get("activo") === "on",
    };

    setSaving(true);
    setError("");
    try {
      const result = editingSupplier
        ? await updateProveedor(editingSupplier.id, supplier)
        : await createProveedor(supplier);
      const savedSupplier = normalizeSupplier({
        ...(editingSupplier ?? {}),
        ...supplier,
        ...responseItem(result),
      });

      setSuppliers((currentSuppliers) =>
        editingSupplier
          ? currentSuppliers.map((item) => item.id === editingSupplier.id ? savedSupplier : item)
          : [savedSupplier, ...currentSuppliers],
      );
      closeModal();
    } catch (saveError) {
      setError(
        saveError.response?.data?.message ||
          saveError.response?.data?.error ||
          "No se pudo guardar el proveedor. Intenta nuevamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="panel orders-panel">
        <div className="panel-heading">
          <div>
            <h2>Proveedores registrados</h2>
            <p className="muted">{suppliers.length} proveedores en el registro</p>
          </div>
          <button
            className="button primary"
            type="button"
            onClick={() => {
              setEditingSupplier(null);
              setError("");
              setModalOpen(true);
            }}
          >
            <Icon type="plus" /> Nuevo proveedor
          </button>
        </div>
        {loadError && <small className="admin-error">{loadError}</small>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>RAZON SOCIAL</th>
                <th>CONTACTO</th>
                <th>CUIT</th>
                <th>TELEFONO</th>
                <th>EMAIL</th>
                <th>ESTADO</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    {suppliers.length === 0
                      ? "Todavia no hay proveedores registrados"
                      : "No se encontraron proveedores"}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier, index) => (
                  <tr key={supplier.id ?? `${supplier.razonSocial}-${index}`}>
                    <td>
                      <strong>{supplier.razonSocial}</strong>
                      <small>{supplier.localidad || supplier.direccion || ""}</small>
                    </td>
                    <td>{supplier.nombreContacto || "-"}</td>
                    <td>{supplier.cuit || "-"}</td>
                    <td>{supplier.telefono || "-"}</td>
                    <td>{supplier.email || "-"}</td>
                    <td>
                      <span className={supplier.activo ? "stock-ok" : "stock-low"}>
                        {supplier.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin-edit-button"
                        type="button"
                        onClick={() => {
                          setEditingSupplier(supplier);
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
        <SupplierModal
          defaultValues={editingSupplier ?? {}}
          error={error}
          saving={saving}
          onSubmit={saveSupplier}
          onClose={closeModal}
          mode={editingSupplier ? "edit" : "create"}
        />
      )}
    </>
  );
}