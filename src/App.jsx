import { useEffect, useState } from "react";
import "./App.css";
import { createCliente, getClientes } from "./services/endpointAPI";
import { formatCurrency } from "./utils/formatCurrency";
import Icon from "./components/Icon";
import CustomerModal from "./components/modals/CustomerModal";
import OrderModal from "./components/modals/OrderModal";
import ProductModal from "./components/modals/ProductModal";
import SaleModal from "./components/modals/SaleModal";
import CustomersView from "./views/CustomersView";
import DashboardView from "./views/DashboardView";
import OrdersView from "./views/OrdersView";
import ProductsView from "./views/ProductsView";
import SalesView from "./views/SalesView";

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
  const [customerRows, setCustomerRows] = useState([]);
  const [productCost, setProductCost] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [customerReturnToOrder, setCustomerReturnToOrder] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [customerSaving, setCustomerSaving] = useState(false);
  useEffect(() => {
    getClientes()
      .then((response) => {
        const data = Array.isArray(response) ? response : response?.data;
        if (!Array.isArray(data)) return;

        const normalizedCustomers = data.map((customer) => {
          if (typeof customer === "string") {
            return { name: customer };
          }

          const name = [
            customer.name || customer.nombre || customer.firstName || customer.nombres,
            customer.lastName || customer.apellido || customer.apellidos,
          ]
            .filter(Boolean)
            .join(" ");

          return {
            id: customer.id ?? customer.idCliente ?? customer.codigo,
            name: customer.fullName || customer.nombreCompleto || name || "Sin nombre",
            email: customer.email || customer.correo,
            phone: customer.phone || customer.telefono || customer.celular,
          };
        });

        setCustomerRows(normalizedCustomers);
        setCustomers(normalizedCustomers.map((customer) => customer.name));
      })
      .catch(() => undefined);
  }, []);
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
  const filteredCustomers = customerRows.filter((customer) =>
    `${customer.name} ${customer.email || ""} ${customer.phone || ""}`
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
  async function addCustomer(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cliente = {
      nombre: form.get("firstName").trim(),
      apellido: form.get("lastName").trim(),
      telefono: form.get("phone").trim() || null,
      redSocial: form.get("socialNetwork").trim() || null,
      observaciones: form.get("observations").trim() || null,
    };

    setCustomerSaving(true);
    setCustomerError("");

    try {
      const createdCustomer = await createCliente(cliente);
      const customerName = `${cliente.nombre} ${cliente.apellido}`;
      const savedCustomer = {
        ...(createdCustomer || {}),
        name: customerName,
        phone: createdCustomer?.telefono || cliente.telefono,
      };

      setCustomerRows((currentCustomers) => [
        savedCustomer,
        ...currentCustomers,
      ]);
      setCustomers((currentCustomers) =>
        currentCustomers.includes(customerName)
          ? currentCustomers
          : [customerName, ...currentCustomers],
      );
      setOrderCustomer(customerName);
      setModal(customerReturnToOrder ? "order" : null);
      setCustomerReturnToOrder(false);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      setCustomerError(
        backendMessage || "No se pudo registrar el cliente. Intenta nuevamente.",
      );
    } finally {
      setCustomerSaving(false);
    }
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
  const modalContent =
    modal === "order" ? (
      <OrderModal
        onSubmit={createOrder}
        onClose={() => setModal(null)}
        orderCustomer={orderCustomer}
        onCustomerChange={(event) => setOrderCustomer(event.target.value)}
        customerResults={customerResults}
        onAddCustomer={() => {
          setCustomerReturnToOrder(true);
          setModal("customer");
        }}
      />
    ) : modal === "product" ? (
      <ProductModal
        onSubmit={addProduct}
        onClose={() => setModal(null)}
        productCost={productCost}
        productPrice={productPrice}
        onCostChange={(event) => setProductCost(event.target.value)}
        onPriceChange={(event) => setProductPrice(event.target.value)}
        formatCurrency={formatCurrency}
      />
    ) : modal === "customer" ? (
      <CustomerModal
        onSubmit={addCustomer}
        onClose={() => setModal(null)}
        error={customerError}
        saving={customerSaving}
      />
    ) : (
      <SaleModal onSubmit={createSale} onClose={() => setModal(null)} />
    );
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
            <DashboardView
              lowStock={lowStock}
              filteredOrders={filteredOrders}
              setActive={setActive}
            />
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
                        : active === "Clientes"
                          ? `${customerRows.length} clientes cargados`
                        : `${orders.length} ordenes registradas`}
                  </p>
                </div>
              </div>
              {active === "Stock" ? (
                <ProductsView products={products} />
              ) : active === "Ventas" ? (
                <SalesView sales={sales} />
              ) : active === "Clientes" ? (
                <CustomersView
                  customers={filteredCustomers}
                  totalCustomers={customerRows.length}
                />
              ) : (
                <OrdersView orders={filteredOrders} />
              )}
            </section>
          )}
        </div>
      </main>
      {modal && modalContent}
    </div>
  );
}
export default App;
