import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import {
  createCategoria,
  createEstado,
  createTipoEquipo,
  getCategorias,
  getEstados,
  getTiposEquipo,
  updateCategoria,
  updateEstado,
  updateTipoEquipo,
} from "../services/endpointAPI";

const initialSettings = {
  businessName: "KISS FIX",
  phone: "11 4567 8901",
  email: "contacto@kissfix.com",
  address: "Av. Corrientes 1234, CABA",
  currency: "ARS - Peso argentino",
  lowStockAlert: "3",
  defaultStatus: "En diagnostico",
  notifications: true,
};

function responseItems(response) {
  const items = response?.data ?? response;
  const values = items?.value ?? items;
  return Array.isArray(values) ? values : [];
}

function responseItem(response) {
  return response?.data && !Array.isArray(response.data) ? response.data : response;
}

function normalizeStatus(status) {
  return {
    ...status,
    id: status.id ?? status.idEstado ?? status.idEstadoOrden,
    nombre: status.nombre ?? status.name ?? "",
  };
}

function normalizeCategory(category) {
  return {
    ...category,
    id: category.id ?? category.idCatProducto ?? category.idCategoria,
    nombre: category.nombre ?? category.name ?? "",
  };
}

function normalizeEquipmentType(equipmentType) {
  return {
    ...equipmentType,
    id: equipmentType.id ?? equipmentType.idTipoEquipo ?? equipmentType.idTipo,
    nombre: equipmentType.nombre ?? equipmentType.name ?? "",
  };
}

export default function GeneralAdministrationView() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);
  const [repairStatuses, setRepairStatuses] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newEquipmentType, setNewEquipmentType] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingEquipmentType, setEditingEquipmentType] = useState(null);
  const [statusError, setStatusError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [equipmentTypeError, setEquipmentTypeError] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);
  const [equipmentTypeSaving, setEquipmentTypeSaving] = useState(false);

  useEffect(() => {
    Promise.allSettled([getEstados(), getCategorias(), getTiposEquipo()]).then(
      ([statusesResult, categoriesResult, equipmentTypesResult]) => {
        if (statusesResult.status === "fulfilled") {
          const statuses = responseItems(statusesResult.value)
            .map(normalizeStatus)
            .filter((status) => status.nombre);
          setRepairStatuses(statuses);
        }

        if (categoriesResult.status === "fulfilled") {
          const categories = responseItems(categoriesResult.value)
            .map(normalizeCategory)
            .filter((category) => category.nombre);
          setProductCategories(categories);
        }

        if (equipmentTypesResult.status === "fulfilled") {
          const equipmentTypes = responseItems(equipmentTypesResult.value)
            .map(normalizeEquipmentType)
            .filter((equipmentType) => equipmentType.nombre);
          setEquipmentTypes(equipmentTypes);
        }
      },
    );
  }, []);

  function updateSetting(event) {
    const { name, type, checked, value } = event.target;
    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  }

  function saveSettings(event) {
    event.preventDefault();
    setSaved(true);
  }

  async function saveStatus(event) {
    event.preventDefault();
    const value = newStatus.trim();
    if (!value) return;

    setStatusSaving(true);
    setStatusError("");
    try {
      const savedStatus = editingStatus
        ? await updateEstado(editingStatus.id, { ...editingStatus, nombre: value })
        : await createEstado({ nombre: value });
      const normalizedStatus = normalizeStatus(
        responseItem(savedStatus) || { ...editingStatus, nombre: value },
      );

      setRepairStatuses((currentStatuses) => {
        if (!editingStatus) return [...currentStatuses, normalizedStatus];
        return currentStatuses.map((status) =>
          status.id === editingStatus.id ? normalizedStatus : status,
        );
      });
      setNewStatus("");
      setEditingStatus(null);
    } catch (error) {
      setStatusError(error.response?.data?.message || "No se pudo guardar el estado.");
    } finally {
      setStatusSaving(false);
    }
  }

  async function saveCategory(event) {
    event.preventDefault();
    const value = newCategory.trim();
    if (!value) return;

    setCategorySaving(true);
    setCategoryError("");
    try {
      const savedCategory = editingCategory
        ? await updateCategoria(editingCategory.id, { ...editingCategory, nombre: value })
        : await createCategoria({ nombre: value });
      const normalizedCategory = normalizeCategory(
        responseItem(savedCategory) || { ...editingCategory, nombre: value },
      );

      setProductCategories((currentCategories) => {
        if (!editingCategory) return [...currentCategories, normalizedCategory];
        return currentCategories.map((category) =>
          category.id === editingCategory.id ? normalizedCategory : category,
        );
      });
      setNewCategory("");
      setEditingCategory(null);
    } catch (error) {
      setCategoryError(error.response?.data?.message || "No se pudo guardar la categoria.");
    } finally {
      setCategorySaving(false);
    }
  }

  async function saveEquipmentType(event) {
    event.preventDefault();
    const value = newEquipmentType.trim();
    if (!value) return;

    setEquipmentTypeSaving(true);
    setEquipmentTypeError("");
    try {
      const savedEquipmentType = editingEquipmentType
        ? await updateTipoEquipo(editingEquipmentType.id, { ...editingEquipmentType, nombre: value })
        : await createTipoEquipo({ nombre: value });
      const normalizedEquipmentType = normalizeEquipmentType(
        responseItem(savedEquipmentType) || { ...editingEquipmentType, nombre: value },
      );

      setEquipmentTypes((currentEquipmentTypes) => {
        if (!editingEquipmentType) return [...currentEquipmentTypes, normalizedEquipmentType];
        return currentEquipmentTypes.map((equipmentType) =>
          equipmentType.id === editingEquipmentType.id ? normalizedEquipmentType : equipmentType,
        );
      });
      setNewEquipmentType("");
      setEditingEquipmentType(null);
    } catch (error) {
      setEquipmentTypeError(error.response?.data?.message || "No se pudo guardar el tipo de equipo.");
    } finally {
      setEquipmentTypeSaving(false);
    }
  }

  return (
    <section className="admin-grid">
      <form className="panel admin-card" onSubmit={saveSettings}>
        <div className="panel-heading">
          <div>
            <h2>Datos del negocio</h2>
            <p className="muted">Informacion que identifica a tu servicio tecnico.</p>
          </div>
          <span className="admin-card-icon"><Icon type="settings" /></span>
        </div>
        <div className="admin-form">
          <label className="field">
            <span>Nombre comercial</span>
            <input name="businessName" value={settings.businessName} onChange={updateSetting} required />
          </label>
          <label className="field">
            <span>Telefono</span>
            <input name="phone" value={settings.phone} onChange={updateSetting} />
          </label>
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" value={settings.email} onChange={updateSetting} />
          </label>
          <label className="field">
            <span>Direccion</span>
            <input name="address" value={settings.address} onChange={updateSetting} />
          </label>
        </div>
        <button className="button primary admin-save" type="submit">
          <Icon type="check" /> Guardar cambios
        </button>
        {saved && <small className="admin-saved">Cambios guardados correctamente</small>}
      </form>

      <div className="panel admin-card">
        <div className="panel-heading">
          <div>
            <h2>Preferencias del sistema</h2>
            <p className="muted">Define los valores iniciales para tu operacion.</p>
          </div>
          <span className="admin-card-icon"><Icon type="sliders" /></span>
        </div>
        <div className="admin-form">
          <label className="field">
            <span>Moneda</span>
            <select name="currency" value={settings.currency} onChange={updateSetting}>
              <option>ARS - Peso argentino</option>
              <option>USD - Dolar estadounidense</option>
            </select>
          </label>
          <label className="field">
            <span>Alerta de stock bajo</span>
            <input name="lowStockAlert" type="number" min="0" value={settings.lowStockAlert} onChange={updateSetting} />
          </label>
          <label className="field">
            <span>Estado inicial de orden</span>
            <select name="defaultStatus" value={settings.defaultStatus} onChange={updateSetting}>
              <option>En diagnostico</option>
              <option>En reparacion</option>
              <option>Esperando repuesto</option>
            </select>
          </label>
          <label className="admin-toggle">
            <span>
              <strong>Notificaciones activas</strong>
              <small>Recibir avisos de stock y reparaciones.</small>
            </span>
            <input name="notifications" type="checkbox" checked={settings.notifications} onChange={updateSetting} />
          </label>
        </div>
      </div>

      <div className="panel admin-card admin-account">
        <div className="panel-heading">
          <div>
            <h2>Cuenta y seguridad</h2>
            <p className="muted">Administra el acceso al panel.</p>
          </div>
          <span className="admin-card-icon"><Icon type="lock" /></span>
        </div>
        <div className="account-row">
          <span className="avatar">MR</span>
          <div>
            <strong>Martin Rojas</strong>
            <small>Administrador</small>
          </div>
          <button className="button secondary" type="button">Cambiar contrasena</button>
        </div>
      </div>

      <div className="panel admin-card">
        <div className="panel-heading">
          <div>
            <h2>Estados de reparacion</h2>
            <p className="muted">Personaliza el recorrido de cada orden.</p>
          </div>
          <span className="admin-card-icon"><Icon type="wrench" /></span>
        </div>
        <form className="admin-inline-form" onSubmit={saveStatus}>
          <input
            value={newStatus}
            onChange={(event) => setNewStatus(event.target.value)}
            placeholder="Ej: Esperando aprobacion"
            aria-label="Nombre del estado"
            required
          />
          <button className="button primary" type="submit" disabled={statusSaving}>
            <Icon type={editingStatus === null ? "plus" : "check"} />
            {statusSaving ? "Guardando..." : editingStatus === null ? "Agregar" : "Guardar"}
          </button>
        </form>
        {statusError && <small className="admin-error">{statusError}</small>}
        <div className="admin-list">
          {repairStatuses.map((status, index) => (
            <div className="admin-list-row" key={status.id ?? `${status.nombre}-${index}`}>
              <span>{status.nombre}</span>
              <button
                className="admin-edit-button"
                type="button"
                title={`Editar ${status.nombre}`}
                onClick={() => {
                  setEditingStatus(status);
                  setNewStatus(status.nombre);
                }}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel admin-card">
        <div className="panel-heading">
          <div>
            <h2>Categorias de producto</h2>
            <p className="muted">Ordena el catalogo por tipo de articulo.</p>
          </div>
          <span className="admin-card-icon"><Icon type="box" /></span>
        </div>
        <form className="admin-inline-form" onSubmit={saveCategory}>
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="Ej: Accesorios"
            aria-label="Nombre de la categoria"
            required
          />
          <button className="button primary" type="submit" disabled={categorySaving}>
            <Icon type={editingCategory === null ? "plus" : "check"} />
            {categorySaving ? "Guardando..." : editingCategory === null ? "Agregar" : "Guardar"}
          </button>
        </form>
        {categoryError && <small className="admin-error">{categoryError}</small>}
        <div className="admin-list">
          {productCategories.map((category, index) => (
            <div className="admin-list-row" key={category.id ?? `${category.nombre}-${index}`}>
              <span>{category.nombre}</span>
              <button
                className="admin-edit-button"
                type="button"
                title={`Editar ${category.nombre}`}
                onClick={() => {
                  setEditingCategory(category);
                  setNewCategory(category.nombre);
                }}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel admin-card">
        <div className="panel-heading">
          <div>
            <h2>Tipos de equipos</h2>
            <p className="muted">Administra las clases de equipos que ingresan al servicio.</p>
          </div>
          <span className="admin-card-icon"><Icon type="box" /></span>
        </div>
        <form className="admin-inline-form" onSubmit={saveEquipmentType}>
          <input
            value={newEquipmentType}
            onChange={(event) => setNewEquipmentType(event.target.value)}
            placeholder="Ej: Celular"
            aria-label="Nombre del tipo de equipo"
            required
          />
          <button className="button primary" type="submit" disabled={equipmentTypeSaving}>
            <Icon type={editingEquipmentType === null ? "plus" : "check"} />
            {equipmentTypeSaving ? "Guardando..." : editingEquipmentType === null ? "Agregar" : "Guardar"}
          </button>
        </form>
        {equipmentTypeError && <small className="admin-error">{equipmentTypeError}</small>}
        <div className="admin-list">
          {equipmentTypes.length === 0 ? (
            <div className="admin-list-row">No hay tipos de equipos cargados</div>
          ) : (
            equipmentTypes.map((equipmentType, index) => (
              <div className="admin-list-row" key={equipmentType.id ?? `${equipmentType.nombre}-${index}`}>
                <span>{equipmentType.nombre}</span>
                <button
                  className="admin-edit-button"
                  type="button"
                  title={`Editar ${equipmentType.nombre}`}
                  onClick={() => {
                    setEditingEquipmentType(equipmentType);
                    setNewEquipmentType(equipmentType.nombre);
                  }}
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
