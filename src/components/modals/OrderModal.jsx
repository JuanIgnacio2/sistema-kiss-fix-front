import FormField from "../FormField";
import Icon from "../Icon";
import ModalShell from "./ModalShell";

export default function OrderModal({
  onSubmit,
  onClose,
  orderCustomer,
  onCustomerChange,
  customerResults,
  onAddCustomer,
}) {
  return (
    <ModalShell title="Nueva orden de reparacion" onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className="field">
          <div className="field-heading">
            <span>Cliente</span>
            <button
              type="button"
              className="add-customer-button"
              onClick={onAddCustomer}
            >
              <Icon type="plus" /> Agregar cliente
            </button>
          </div>
          <input
            name="customer"
            value={orderCustomer}
            onChange={onCustomerChange}
            placeholder="Nombre completo"
            required
          />
          {customerResults.length > 0 && (
            <div className="customer-results">
              {customerResults.map((customer) => (
                <button
                  type="button"
                  key={customer}
                  onClick={() => onCustomerChange({ target: { value: customer } })}
                >
                  {customer}
                </button>
              ))}
            </div>
          )}
          {orderCustomer.length >= 3 && customerResults.length === 0 && (
            <small className="customer-empty">No se encontraron clientes</small>
          )}
        </div>
        <FormField
          label="Codigo de orden"
          name="orderCode"
          defaultValue="KF-2408-019"
          readOnly
        />
        <FormField label="Fecha de ingreso" name="entryDate" type="date" required />
        <FormField
          label="Presupuesto inicial"
          name="initialBudget"
          type="number"
          min="0"
          placeholder="0"
          required
        />
        <FormField label="Equipo" name="device" placeholder="Marca y modelo" required />
        <FormField label="Falla reportada" name="issue" placeholder="Describe el problema" required />
        <FormField label="Estado de reparacion">
          <select name="status" defaultValue="En diagnostico">
            <option>En diagnostico</option>
            <option>En reparacion</option>
            <option>Esperando repuesto</option>
            <option>Listo para retirar</option>
            <option>Entregado</option>
          </select>
        </FormField>
        <button className="button primary full">
          Crear orden <Icon type="arrow" />
        </button>
      </form>
    </ModalShell>
  );
}
