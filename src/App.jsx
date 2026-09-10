import { useState } from "react";
import "./App.css";

const initialOrders = [
  {
    id: "KF-2408-018",
    customer: "Lucia Fernandez",
    device: "iPhone 13 Pro",
    issue: "No enciende",
    status: "En reparacion",
    price: "$ 185.000",
    technician: "Martin R.",
  },
  {
    id: "KF-2408-017",
    customer: "Tomas Ruiz",
    device: "MacBook Air M1",
    issue: "Cambio de bateria",
    status: "Listo para retirar",
    price: "$ 240.000",
    technician: "Sofia L.",
  },
  {
    id: "KF-2408-016",
    customer: "Valentina Soto",
    device: "PlayStation 5",
    issue: "Limpieza y mantenimiento",
    status: "Esperando repuesto",
    price: "$ 95.000",
    technician: "Martin R.",
  },
  {
    id: "KF-2408-015",
    customer: "Diego Molina",
    device: "Samsung S22",
    issue: "Pantalla rota",
    status: "Entregado",
    price: "$ 210.000",
    technician: "Nicolas G.",
  },
];
const initialProducts = [
  {
    name: "Pantalla iPhone 13 Pro",
    sku: "REP-IP13P-01",
    stock: 2,
    min: 3,
    cost: "$ 112.000",
    price: "$ 185.000",
  },
  {
    name: "Bateria MacBook Air M1",
    sku: "REP-MBA1-04",
    stock: 1,
    min: 2,
    cost: "$ 150.000",
    price: "$ 240.000",
  },
  {
    name: "Conector USB-C universal",
    sku: "REP-USBC-12",
    stock: 8,
    min: 5,
    cost: "$ 4.500",
    price: "$ 12.000",
  },
  {
    name: "Pasta termica premium",
    sku: "INS-TERM-02",
    stock: 14,
    min: 5,
    cost: "$ 3.200",
    price: "$ 8.500",
  },
];
const initialSales = [
  {
    id: "V-0004",
    item: "Pantalla iPhone 13 Pro",
    quantity: 1,
    unitPrice: "$ 185.000",
    total: "$ 185.000",
  },
  {
    id: "V-0003",
    item: "Pasta termica premium",
    quantity: 2,
    unitPrice: "$ 8.500",
    total: "$ 17.000",
  },
];
const navItems = [
  ["grid", "Resumen"],
  ["wrench", "Ordenes de reparacion"],
  ["cart", "Ventas"],
  ["box", "Stock"],
  ["users", "Clientes"],
];
function Icon({ type }) {
  const icons = {
    grid: "▦",
    wrench: "⌁",
    cart: "⊞",
    box: "◫",
    users: "◌",
    search: "⌕",
    bell: "◔",
    plus: "+",
    arrow: "↗",
    close: "×",
  };
  return (
    <span className={`icon icon-${type}`} aria-hidden="true">
      {icons[type]}
    </span>
  );
}
function Field({ label, customerOptions = [], ...props }) {
  return label === "Equipo" ? (
    <>
      <label className="field">
        <span>Codigo de orden</span>
        <input name="orderCode" defaultValue="KF-2408-019" readOnly />
      </label>
      <label className="field">
        <span>Fecha de ingreso</span>
        <input name="entryDate" type="date" required />
      </label>
      <label className="field">
        <span>Presupuesto inicial</span>
        <input
          name="initialBudget"
          type="number"
          min="0"
          placeholder="0"
          required
        />
      </label>
      <label className="field">
        <span>{label}</span>
        <input {...props} />
      </label>
    </>
  ) : label === "Nombre" ? (
    <>
      <label className="field">
        <span>Buscar cliente</span>
        <input
          name="customer"
          list="customer-options"
          minLength="3"
          placeholder="Escribe al menos 3 letras"
          autoComplete="off"
        />
        <datalist id="customer-options">
          {customerOptions.map((customer) => (
            <option key={customer} value={customer} />
          ))}
        </datalist>
      </label>
      <label className="field">
        <span>Nombre</span>
        <input name="firstName" placeholder="Nombre" required />
      </label>
      <label className="field">
        <span>Apellido</span>
        <input name="lastName" placeholder="Apellido" required />
      </label>
      <label className="field">
        <span>Telefono</span>
        <input name="phone" type="tel" placeholder="11 5555 5555" required />
      </label>
      <label className="field">
        <span>Articulo</span>
        <select name="article" defaultValue="">
          <option value="" disabled>
            Selecciona un articulo
          </option>
          {initialProducts.map((product) => (
            <option key={product.sku} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Cantidad</span>
        <input
          name="quantity"
          type="number"
          min="1"
          defaultValue="1"
          required
        />
      </label>
      <label className="field">
        <span>Precio unitario</span>
        <input
          name="unitPrice"
          type="number"
          min="0"
          placeholder="$ 0"
          required
        />
      </label>
      <label className="field">
        <span>
          Redes sociales <small>(opcional)</small>
        </span>
        <input
          name="socialNetworks"
          placeholder="Instagram, Facebook o WhatsApp"
        />
      </label>
    </>
  ) : label === "Apellido" ? null : (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
function Metric({ label, value, trend, note, type, icon }) {
  return (
    <div className="metric">
      <div className={`metric-icon ${type}`}>{icon}</div>
      <div>
        <p className="metric-label">{label}</p>
        <strong>{value}</strong>
        <p className={`metric-trend ${type}`}>
          <span>{trend}</span> {note}
        </p>
      </div>
    </div>
  );
}
function OrderTable({ orders }) {
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
function formatCurrency(value) {
  return `$ ${value.toLocaleString("es-AR")}`;
}
function ProductTable({ products }) {
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
function SalesTable({ sales }) {
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

function App() {
  const [active, setActive] = useState("Resumen");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [sales, setSales] = useState(initialSales);
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState("");
  const [orderCustomer, setOrderCustomer] = useState("");
  const [customers, setCustomers] = useState([
    ...new Set(initialOrders.map((order) => order.customer)),
  ]);
  const [productCost, setProductCost] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [customerReturnToOrder, setCustomerReturnToOrder] = useState(false);
  const customerResults =
    orderCustomer.trim().length >= 3
      ? customers.filter((customer) =>
          customer.toLowerCase().includes(orderCustomer.trim().toLowerCase()),
        )
      : [];
  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.device}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const lowStock = products.filter((product) => product.stock <= product.min);
  function createOrder(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setOrders([
      {
        id: form.get("orderCode"),
        customer: form.get("customer"),
        entryDate: form.get("entryDate"),
        initialBudget: Number(form.get("initialBudget")),
        device: form.get("device"),
        issue: form.get("issue"),
        status: form.get("status"),
        price: "$ 0",
        technician: "Sin asignar",
      },
      ...orders,
    ]);
    setModal(null);
  }
  function addCustomer(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customer =
      form.get("customer") ||
      `${form.get("firstName")} ${form.get("lastName")}`;
    setCustomers((currentCustomers) =>
      currentCustomers.includes(customer)
        ? currentCustomers
        : [customer, ...currentCustomers],
    );
    setOrderCustomer(customer);
    setModal(customerReturnToOrder ? "order" : null);
    setCustomerReturnToOrder(false);
  }
  function addProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cost = Number(form.get("cost"));
    const price = Number(form.get("price"));
    const gain = price - cost;
    const utilityPercentage = cost > 0 ? (gain / cost) * 100 : 0;
    setProducts([
      {
        name: form.get("name"),
        brand: form.get("brand"),
        sku: form.get("sku"),
        stock: Number(form.get("stock")),
        min: 3,
        cost: formatCurrency(cost),
        price: formatCurrency(price),
        utility: `${utilityPercentage.toLocaleString("es-AR", { maximumFractionDigits: 2 })}%`,
        gain: formatCurrency(gain),
      },
      ...products,
    ]);
    setProductCost("");
    setProductPrice("");
    setModal(null);
  }
  function createSale(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const quantity = Number(form.get("quantity"));
    const unitPrice = Number(form.get("unitPrice"));
    setSales([
      {
        id: `V-${String(sales.length + 5).padStart(4, "0")}`,
        item: form.get("sale"),
        quantity,
        unitPrice: `$ ${unitPrice.toLocaleString("es-AR")}`,
        total: `$ ${(quantity * unitPrice).toLocaleString("es-AR")}`,
      },
      ...sales,
    ]);
    setModal(null);
  }
  const isSummary = active === "Resumen";
  return (
    <div className={sidebarOpen ? "app-shell" : "app-shell sidebar-collapsed"}>
      <aside className="sidebar">
        <div className="brand">
          <button
            className="menu-toggle side-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Contraer menu" : "Abrir menu"}
            aria-expanded={sidebarOpen}
          >
            <span />
            <span />
            <span />
          </button>
          <div>
            <strong>KISS FIX</strong>
            <small>Servicio tecnico</small>
          </div>
        </div>
        <div className="nav-label">GESTION</div>
        <nav>
          {navItems.map(([icon, label]) => (
            <button
              key={label}
              className={active === label ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActive(label);
                setSidebarOpen(false);
              }}
              title={label}
            >
              <Icon type={icon} />
              <span className="nav-label-text">{label}</span>
              {label === "Ordenes de reparacion" && (
                <b>
                  {
                    orders.filter((order) => order.status === "En reparacion")
                      .length
                  }
                </b>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="avatar">MR</span>
          <div>
            <strong>Martin Rojas</strong>
            <small>Administrador</small>
          </div>
          <span className="dots">•••</span>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            KISS FIX <span>/</span> {active}
          </div>
          <div className="top-actions">
            <label className="search">
              <Icon type="search" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar orden, cliente..."
              />
            </label>
            <button className="icon-button" title="Notificaciones">
              <Icon type="bell" />
              <i />
            </button>
            <span className="top-avatar">MR</span>
          </div>
        </header>
        <div className="content-wrap">
          <div className="page-heading">
            <div>
              <p className="eyebrow">JUEVES, 08 DE AGOSTO DE 2024</p>
              <h1>{isSummary ? "Buenos dias, Martin" : active}</h1>
              <p className="muted">
                {isSummary
                  ? "Este es el estado de tu negocio hoy."
                  : `Gestiona tus ${active.toLowerCase()} desde aqui.`}
              </p>
            </div>
            <div className="heading-actions">
              <button
                className="button secondary"
                onClick={() => setModal("sale")}
              >
                <Icon type="cart" /> Registrar venta
              </button>
              <button
                className="button primary"
                onClick={() =>
                  setModal(
                    active === "Stock"
                      ? "product"
                      : active === "Clientes"
                        ? "customer"
                        : "order",
                  )
                }
              >
                <Icon type="plus" />{" "}
                {active === "Stock"
                  ? "Nuevo articulo"
                  : active === "Clientes"
                    ? "Nuevo cliente"
                    : "Nueva orden"}
              </button>
            </div>
          </div>
          {isSummary ? (
            <>
              <section className="metrics">
                <Metric
                  label="Ventas del dia"
                  value="$ 486.500"
                  trend="+12,8%"
                  note="vs. ayer"
                  type="up"
                  icon="↗"
                />
                <Metric
                  label="Ordenes abiertas"
                  value="12"
                  trend="3"
                  note="listas para entregar"
                  type="neutral"
                  icon="⌁"
                />
                <Metric
                  label="Ganancia estimada"
                  value="$ 218.300"
                  trend="+8,4%"
                  note="este mes"
                  type="up"
                  icon="$"
                />
                <Metric
                  label="Stock critico"
                  value={String(lowStock.length)}
                  trend="Reponer"
                  note="articulos"
                  type="warning"
                  icon="!"
                />
              </section>
              <section className="dashboard-grid">
                <div className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Rendimiento de ventas</h2>
                      <p className="muted">Ingresos de los ultimos 7 dias</p>
                    </div>
                    <select>
                      <option>Esta semana</option>
                      <option>Este mes</option>
                    </select>
                  </div>
                  <div className="chart">
                    <div className="y-axis">
                      <span>$600k</span>
                      <span>$400k</span>
                      <span>$200k</span>
                      <span>$0</span>
                    </div>
                    <div className="chart-area">
                      <div className="grid-lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <svg
                        viewBox="0 0 620 190"
                        preserveAspectRatio="none"
                        aria-label="Grafico de ventas"
                      >
                        <defs>
                          <linearGradient
                            id="gold-fill"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="0"
                              stopColor="#cba45d"
                              stopOpacity=".27"
                            />
                            <stop
                              offset="1"
                              stopColor="#cba45d"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 145 C55 139, 70 115, 115 125 S170 155, 215 104 S270 110, 310 80 S375 108, 410 91 S455 62, 500 82 S560 52, 620 30 L620 190 L0 190 Z"
                          fill="url(#gold-fill)"
                        />
                        <path
                          d="M0 145 C55 139, 70 115, 115 125 S170 155, 215 104 S270 110, 310 80 S375 108, 410 91 S455 62, 500 82 S560 52, 620 30"
                          fill="none"
                          stroke="#d8b36a"
                          strokeWidth="3"
                        />
                      </svg>
                      <div className="x-axis">
                        <span>Lun 05</span>
                        <span>Mar 06</span>
                        <span>Mie 07</span>
                        <span>Jue 08</span>
                        <span>Vie 09</span>
                        <span>Sab 10</span>
                        <span>Dom 11</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="panel stock-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Stock critico</h2>
                      <p className="muted">Requiere reposicion</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setActive("Stock")}
                    >
                      Ver todo <Icon type="arrow" />
                    </button>
                  </div>
                  <div className="stock-list">
                    {lowStock.map((product) => (
                      <div className="stock-row" key={product.sku}>
                        <span className="product-icon">◫</span>
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.sku}</small>
                        </div>
                        <span className="stock-count">
                          {product.stock} unid.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <section className="panel orders-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Ordenes recientes</h2>
                    <p className="muted">Ultimas reparaciones registradas</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setActive("Ordenes de reparacion")}
                  >
                    Ver todas <Icon type="arrow" />
                  </button>
                </div>
                <OrderTable orders={filteredOrders} />
              </section>
            </>
          ) : (
            <section className="panel orders-panel">
              <div className="panel-heading">
                <div>
                  <h2>{active}</h2>
                  <p className="muted">
                    {active === "Stock"
                      ? `${products.length} articulos en catalogo`
                      : active === "Ventas"
                        ? `${sales.length} ventas registradas`
                        : `${orders.length} ordenes registradas`}
                  </p>
                </div>
              </div>
              {active === "Stock" ? (
                <ProductTable products={products} />
              ) : active === "Ventas" ? (
                <SalesTable sales={sales} />
              ) : (
                <OrderTable orders={filteredOrders} />
              )}
            </section>
          )}
        </div>
      </main>
      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setModal(null)
          }
        >
          <div className="modal">
            <button className="modal-close" onClick={() => setModal(null)}>
              <Icon type="close" />
            </button>
            <p className="eyebrow">KISS FIX / NUEVO REGISTRO</p>
            <h2>
              {modal === "order"
                ? "Nueva orden de reparacion"
                : modal === "product"
                  ? "Agregar articulo"
                  : modal === "customer"
                    ? "Agregar cliente"
                    : "Registrar venta"}
            </h2>
            {modal === "order" ? (
              <form onSubmit={createOrder}>
                <div className="field">
                  <div className="field-heading">
                    <span>Cliente</span>
                    <button
                      type="button"
                      className="add-customer-button"
                      onClick={() => setModal("customer")}
                    >
                      <Icon type="plus" /> Agregar cliente
                    </button>
                  </div>
                  <input
                    name="customer"
                    value={orderCustomer}
                    onChange={(event) => setOrderCustomer(event.target.value)}
                    placeholder="Nombre completo"
                    required
                  />
                  {customerResults.length > 0 && (
                    <div className="customer-results">
                      {customerResults.map((customer) => (
                        <button
                          type="button"
                          key={customer}
                          onClick={() => setOrderCustomer(customer)}
                        >
                          {customer}
                        </button>
                      ))}
                    </div>
                  )}
                  {orderCustomer.length >= 3 &&
                    customerResults.length === 0 && (
                      <small className="customer-empty">
                        No se encontraron clientes
                      </small>
                    )}
                </div>
                <Field
                  label="Equipo"
                  name="device"
                  placeholder="Marca y modelo"
                  required
                />
                <Field
                  label="Falla reportada"
                  name="issue"
                  placeholder="Describe el problema"
                  required
                />
                <label className="field">
                  <span>Estado de reparacion</span>
                  <select name="status" defaultValue="En diagnostico">
                    <option>En diagnostico</option>
                    <option>En reparacion</option>
                    <option>Esperando repuesto</option>
                    <option>Listo para retirar</option>
                    <option>Entregado</option>
                  </select>
                </label>
                <button className="button primary full">
                  Crear orden <Icon type="arrow" />
                </button>
              </form>
            ) : modal === "product" ? (
              <form onSubmit={addProduct}>
                <Field
                  label="Nombre del articulo"
                  name="name"
                  placeholder="Ej: Pantalla iPhone 14"
                  required
                />
                <Field
                  label="SKU"
                  name="sku"
                  placeholder="REP-000-01"
                  required
                />
                <Field
                  label="Marca"
                  name="brand"
                  placeholder="Ej: Apple, Samsung"
                  required
                />
                <Field
                  label="Stock inicial"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                />
                <label className="field">
                  <span>Precio de costo</span>
                  <input
                    name="cost"
                    type="number"
                    min="0"
                    placeholder="$ 0"
                    value={productCost}
                    onChange={(event) => setProductCost(event.target.value)}
                    required
                  />
                </label>
                <label className="field">
                  <span>Precio de venta</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    placeholder="$ 0"
                    value={productPrice}
                    onChange={(event) => setProductPrice(event.target.value)}
                    required
                  />
                </label>
                <label className="field">
                  <span>Utilidad (%)</span>
                  <input
                    value={
                      Number(productCost) > 0 && productPrice !== ""
                        ? `${(((Number(productPrice) - Number(productCost)) / Number(productCost)) * 100).toLocaleString("es-AR", { maximumFractionDigits: 2 })}%`
                        : ""
                    }
                    placeholder="0%"
                    readOnly
                  />
                </label>
                <label className="field">
                  <span>Ganancia</span>
                  <input
                    value={
                      productCost !== "" && productPrice !== ""
                        ? formatCurrency(Number(productPrice) - Number(productCost))
                        : ""
                    }
                    placeholder="$ 0"
                    readOnly
                  />
                </label>
                <button className="button primary full">
                  Guardar articulo <Icon type="arrow" />
                </button>
              </form>
            ) : modal === "customer" ? (
              <form onSubmit={addCustomer}>
                <Field
                  label="Nombre"
                  name="firstName"
                  placeholder="Nombre"
                  required
                />
                <Field
                  label="Apellido"
                  name="lastName"
                  placeholder="Apellido"
                  required
                />
                <button className="button primary full">
                  Usar cliente <Icon type="arrow" />
                </button>
              </form>
            ) : (
              <form onSubmit={createSale}>
                <Field
                  label="Articulo o servicio"
                  name="sale"
                  placeholder="Busca en el catalogo"
                  required
                />
                <Field
                  label="Cantidad"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  required
                />
                <Field
                  label="Precio unitario"
                  name="unitPrice"
                  type="number"
                  min="0"
                  placeholder="$ 0"
                  required
                />
                <Field
                  label="Monto total"
                  name="amount"
                  type="number"
                  min="0"
                  placeholder="$ 0"
                  required
                />
                <button className="button primary full">
                  Confirmar venta <Icon type="arrow" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
