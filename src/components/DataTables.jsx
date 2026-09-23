import { formatCurrency } from "../utils/formatCurrency";

export function OrderTable({ orders }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ORDEN</th>
            <th>CLIENTE</th>
            <th>EQUIPO</th>
            <th>ESTADO</th>
            <th>TECNICO</th>
            <th>PRECIO</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <strong className="order-id">{order.id}</strong>
                <small>{order.issue}</small>
              </td>
              <td>{order.customer}</td>
              <td>{order.device}</td>
              <td>
                <span
                  className={`status ${order.status.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {order.status}
                </span>
              </td>
              <td>{order.technician}</td>
              <td>
                <strong>{order.price}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductTable({ products }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ARTICULO</th>
            <th>SKU</th>
            <th>STOCK</th>
            <th>COSTO</th>
            <th>PRECIO VENTA</th>
            <th>STOCK VALUADO</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const unitCost = Number(product.cost.replace(/\D/g, ""));
            return (
              <tr key={product.sku}>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>{product.sku}</td>
                <td>
                  <span
                    className={
                      product.stock <= product.min ? "stock-low" : "stock-ok"
                    }
                  >
                    {product.stock} unidades
                  </span>
                </td>
                <td>{product.cost}</td>
                <td>
                  <strong>{product.price}</strong>
                </td>
                <td>
                  <strong>{formatCurrency(product.stock * unitCost)}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SalesTable({ sales }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>VENTA</th>
            <th>ARTICULO O SERVICIO</th>
            <th>CANTIDAD</th>
            <th>PRECIO UNITARIO</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>
                <strong className="order-id">{sale.id}</strong>
              </td>
              <td>{sale.item}</td>
              <td>{sale.quantity}</td>
              <td>
                <strong>{sale.unitPrice}</strong>
              </td>
              <td>
                <strong>{sale.total}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CustomerTable({ customers, totalCustomers }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>CLIENTE</th>
            <th>EMAIL</th>
            <th>TELEFONO</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="4">
                {totalCustomers === 0
                  ? "No hay clientes cargados"
                  : "No se encontraron clientes"}
              </td>
            </tr>
          ) : (
            customers.map((customer, index) => (
              <tr key={customer.id ?? customer.email ?? index}>
                <td>{customer.id ?? "-"}</td>
                <td>
                  <strong>{customer.name}</strong>
                </td>
                <td>{customer.email || "-"}</td>
                <td>{customer.phone || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

