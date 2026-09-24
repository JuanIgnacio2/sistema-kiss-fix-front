import { useEffect, useState } from "react";
import "./App.css";
import {
  createCliente,
  createProducto,
  getCategorias,
  getClientes,
  getProductos,
  updateCliente,
  updateOrden,
  updateProducto,
  updateVenta,
} from "./services/endpointAPI";
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
import GeneralAdministrationView from "./views/GeneralAdministrationView";

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
const initialProducts = [];
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
  ["settings", "Administracion General"],
];

function parseProductAmount(value) {
  if (typeof value === "number") return value;
  return Number(String(value ?? "").replace(/[^\d.-]/g, "")) || 0;
}

function normalizeProduct(product = {}) {
  const cost = parseProductAmount(product.precioCosto ?? product.cost);
  const price = parseProductAmount(product.precioVenta ?? product.price);
  const gain = price - cost;
  const utilityPercentage = cost > 0 ? (gain / cost) * 100 : 0;

  return {
    ...product,
    id: product.id ?? product.idProducto ?? product.idArticulo,
    name: product.name ?? product.nombre ?? "",
    sku: product.sku ?? product.codigo ?? "",
    brand: product.brand ?? product.marca ?? "",
    stock: Number(product.stock ?? 0),
    min: Number(product.min ?? product.stockminimo ?? product.stockMinimo ?? 0),
    cost: formatCurrency(cost),
    price: formatCurrency(price),
    utility: `${utilityPercentage.toLocaleString("es-AR", { maximumFractionDigits: 2 })}%`,
    gain: formatCurrency(gain),
  };
}

function productResponseItem(response) {
  return response?.data && !Array.isArray(response.data) ? response.data : response;
}

function normalizeCategory(category = {}) {
  return {
    id: category.id ?? category.idCatProducto ?? category.idCategoria,
    nombre: category.nombre ?? category.name ?? "",
  };
}

function App() {
  const [active, setActive] = useState("Resumen");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [productCategories, setProductCategories] = useState([]);
  const [sales, setSales] = useState(initialSales);
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState("");
  const [orderCustomer, setOrderCustomer] = useState("");
  const [customers, setCustomers] = useState([
    ...new Set(initialOrders.map((order) => order.customer)),
  ]);
  const [customerRows, setCustomerRows] = useState([]);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [productCost, setProductCost] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [customerReturnToOrder, setCustomerReturnToOrder] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [customerSaving, setCustomerSaving] = useState(false);
  const [productError, setProductError] = useState("");
  const [productSaving, setProductSaving] = useState(false);
  const [saleError, setSaleError] = useState("");
  const [saleSaving, setSaleSaving] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSaving, setOrderSaving] = useState(false);
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
            nombre: customer.nombre || customer.firstName || customer.nombres || "",
            apellido: customer.apellido || customer.lastName || customer.apellidos || "",
            name: customer.fullName || customer.nombreCompleto || name || "Sin nombre",
            email: customer.email || customer.correo,
            phone: customer.phone || customer.telefono || customer.celular,
            telefono: customer.telefono || customer.phone || customer.celular || "",
            redSocial: customer.redSocial || customer.redsocial || customer.socialNetwork || "",
            observaciones: customer.observaciones || customer.observations || "",
          };
        });

        setCustomerRows(normalizedCustomers);
        setCustomers(normalizedCustomers.map((customer) => customer.name));
      })
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    getProductos()
      .then((response) => {
        const data = Array.isArray(response) ? response : response?.data;
        if (!Array.isArray(data)) return;
        setProducts(data.map(normalizeProduct));
      })
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    getCategorias()
      .then((response) => {
        const data = Array.isArray(response) ? response : response?.data;
        if (!Array.isArray(data)) return;
        setProductCategories(data.map(normalizeCategory).filter((category) => category.nombre));
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
  const customerModalDefaults =
    customerRows.find(
      (customer) =>
        String(customer.id ?? customer.idCliente ?? customer.codigo) ===
        String(editingCustomerId ?? ""),
    ) ?? {};
  const productModalDefaults =
    products.find(
      (product) =>
        String(product.idArticulo ?? product.id ?? product.sku) ===
        String(editingProductId ?? ""),
    ) ?? {};
  const saleModalDefaults =
    sales.find(
      (sale) => String(sale.idVenta ?? sale.id) === String(editingSaleId ?? ""),
    ) ?? {};
  const orderModalDefaults =
    orders.find((order) => String(order.idOrden ?? order.id) === String(editingOrderId ?? "")) ?? {};
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

  async function updateOrder(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const orderCode = String(form.get("orderCode") ?? "").trim();
    const customer = String(form.get("customer") ?? "").trim();
    const entryDate = String(form.get("entryDate") ?? "").trim();
    const initialBudget = Number(form.get("initialBudget") ?? 0);
    const device = String(form.get("device") ?? "").trim();
    const issue = String(form.get("issue") ?? "").trim();
    const status = String(form.get("status") ?? "").trim();

    setOrderSaving(true);
    setOrderError("");

    try {
      await updateOrden(editingOrderId, {
        orderCode,
        customer,
        entryDate,
        initialBudget,
        device,
        issue,
        status,
      });

      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          if (String(order.idOrden ?? order.id) !== String(editingOrderId)) return order;

          return {
            ...order,
            id: orderCode || order.id,
            idOrden: order.idOrden,
            customer,
            entryDate,
            initialBudget,
            device,
            issue,
            status,
            price: formatCurrency(initialBudget),
          };
        }),
      );
      setOrderCustomer("");
      setEditingOrderId(null);
      setModal(null);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      setOrderError(
        backendMessage || "No se pudo actualizar la orden. Intenta nuevamente.",
      );
    } finally {
      setOrderSaving(false);
    }
  }
  async function addCustomer(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nombre = String(form.get("nombre") ?? form.get("firstName") ?? "").trim();
    const apellido = String(form.get("apellido") ?? form.get("lastName") ?? "").trim();
    const telefono = String(form.get("telefono") ?? form.get("phone") ?? "").trim();
    const redSocial = String(form.get("redSocial") ?? form.get("socialNetwork") ?? "").trim();
    const observaciones = String(form.get("observaciones") ?? form.get("observations") ?? "").trim();

    const cliente = {
      nombre,
      apellido,
      telefono: telefono || null,
      redSocial: redSocial || null,
      observaciones: observaciones || null,
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

  async function updateCustomer(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nombre = String(form.get("nombre") ?? "").trim();
    const apellido = String(form.get("apellido") ?? "").trim();
    const telefono = String(form.get("telefono") ?? "").trim();
    const redSocial = String(form.get("redSocial") ?? "").trim();
    const observaciones = String(form.get("observaciones") ?? "").trim();

    const cliente = {
      nombre,
      apellido,
      telefono: telefono || null,
      redSocial: redSocial || null,
      observaciones: observaciones || null,
    };

    setCustomerSaving(true);
    setCustomerError("");

    try {
      await updateCliente(editingCustomerId, cliente);

      const updatedName = `${nombre} ${apellido}`.trim();
      setCustomerRows((currentCustomers) =>
        currentCustomers.map((item) => {
          const itemId = item.id ?? item.idCliente ?? item.codigo;
          if (String(itemId) !== String(editingCustomerId)) return item;

          return {
            ...item,
            id: itemId,
            nombre,
            apellido,
            name: updatedName || item.name || "Sin nombre",
            phone: telefono || item.phone || "",
            telefono: telefono || item.telefono || "",
            redSocial: redSocial || item.redSocial || "",
            observaciones: observaciones || item.observaciones || "",
            email: item.email || "",
          };
        }),
      );

      setCustomers((currentCustomers) =>
        currentCustomers.map((customerName) => {
          const currentCustomer = customerRows.find(
            (item) =>
              String(item.id ?? item.idCliente ?? item.codigo) === String(editingCustomerId),
          );
          if (!currentCustomer) return customerName;
          return customerName === currentCustomer.name ? updatedName || customerName : customerName;
        }),
      );

      setModal(null);
      setEditingCustomerId(null);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      setCustomerError(
        backendMessage || "No se pudo actualizar el cliente. Intenta nuevamente.",
      );
    } finally {
      setCustomerSaving(false);
    }
  }

  async function addProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const sku = String(form.get("sku") ?? "").trim();
    const brand = String(form.get("brand") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const categoryId = Number(form.get("categoryId") ?? 0);
    const model = String(form.get("model") ?? "").trim();
    const stock = Number(form.get("stock") ?? 0);
    const minStock = Number(form.get("minStock") ?? 0);
    const cost = Number(form.get("cost"));
    const price = Number(form.get("price"));
    const barcode = String(form.get("barcode") ?? "").trim();
    const unitMeasure = String(form.get("unitMeasure") ?? "").trim();
    const active = form.get("active") === "on";
    setProductSaving(true);
    setProductError("");

    try {
      const createdProduct = await createProducto({
        name,
        sku,
        brand,
        description,
        categoryId,
        model,
        stock,
        minStock,
        cost,
        price,
        barcode,
        unitMeasure,
        active,
      });
      const savedProduct = productResponseItem(createdProduct) || {
        name,
        sku,
        brand,
        description,
        categoryId,
        model,
        stock,
        minStock,
        cost,
        price,
        barcode,
        unitMeasure,
        active,
      };
      setProducts((currentProducts) => [normalizeProduct(savedProduct), ...currentProducts]);
      setProductCost("");
      setProductPrice("");
      setModal(null);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      setProductError(backendMessage || "No se pudo crear el articulo. Intenta nuevamente.");
    } finally {
      setProductSaving(false);
    }
  }

  async function updateProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const sku = String(form.get("sku") ?? "").trim();
    const brand = String(form.get("brand") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const categoryId = Number(form.get("categoryId") ?? 0);
    const model = String(form.get("model") ?? "").trim();
    const stock = Number(form.get("stock") ?? 0);
    const minStock = Number(form.get("minStock") ?? 0);
    const cost = Number(form.get("cost") ?? 0);
    const price = Number(form.get("price") ?? 0);
    const barcode = String(form.get("barcode") ?? "").trim();
    const unitMeasure = String(form.get("unitMeasure") ?? "").trim();
    const active = form.get("active") === "on";
    const productId = editingProductId;

    setProductSaving(true);
    setProductError("");

    try {
      const updatedProduct = await updateProducto(productId, {
        name,
        sku,
        brand,
        description,
        categoryId,
        model,
        stock,
        minStock,
        cost,
        price,
        barcode,
        unitMeasure,
        active,
      });
      const currentProduct = products.find(
        (product) => String(product.idArticulo ?? product.id ?? product.sku) === String(productId),
      );
      const savedProduct = productResponseItem(updatedProduct) || {
        ...currentProduct,
        name,
        sku,
        brand,
        description,
        categoryId,
        model,
        stock,
        minStock,
        cost,
        price,
        barcode,
        unitMeasure,
        active,
      };

      setProducts((currentProducts) =>
        currentProducts.map((product) => {
          const currentId = product.idArticulo ?? product.id ?? product.sku;
          if (String(currentId) !== String(productId)) return product;

          return normalizeProduct({ ...product, ...savedProduct });
        }),
      );
      setProductCost("");
      setProductPrice("");
      setEditingProductId(null);
      setModal(null);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      setProductError(
        backendMessage || "No se pudo actualizar el articulo. Intenta nuevamente.",
      );
    } finally {
      setProductSaving(false);
    }
  }

  async function updateSale(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item = String(form.get("sale") ?? "").trim();
    const quantity = Number(form.get("quantity") ?? 0);
    const unitPrice = Number(form.get("unitPrice") ?? 0);
    const amount = Number(form.get("amount") ?? quantity * unitPrice);

    setSaleSaving(true);
    setSaleError("");

    try {
      await updateVenta(editingSaleId, {
        item,
        quantity,
        unitPrice,
        total: amount,
      });

      setSales((currentSales) =>
        currentSales.map((sale) => {
          if (String(sale.idVenta ?? sale.id) !== String(editingSaleId)) return sale;

          return {
            ...sale,
            item,
            quantity,
            unitPrice: formatCurrency(unitPrice),
            total: formatCurrency(amount),
          };
        }),
      );
      setEditingSaleId(null);
      setModal(null);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      setSaleError(
        backendMessage || "No se pudo actualizar la venta. Intenta nuevamente.",
      );
    } finally {
      setSaleSaving(false);
    }
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
    ) : modal === "order-edit" ? (
      <OrderModal
        onSubmit={updateOrder}
        onClose={() => {
          setModal(null);
          setEditingOrderId(null);
          setOrderCustomer("");
          setOrderError("");
        }}
        orderCustomer={orderCustomer}
        onCustomerChange={(event) => setOrderCustomer(event.target.value)}
        customerResults={customerResults}
        onAddCustomer={() => {
          setCustomerReturnToOrder(true);
          setModal("customer");
        }}
        mode="edit"
        defaultValues={orderModalDefaults}
        error={orderError}
        saving={orderSaving}
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
        categories={productCategories}
      />
    ) : modal === "product-edit" ? (
      <ProductModal
        onSubmit={updateProduct}
        onClose={() => {
          setModal(null);
          setEditingProductId(null);
          setProductCost("");
          setProductPrice("");
          setProductError("");
        }}
        productCost={productCost}
        productPrice={productPrice}
        onCostChange={(event) => setProductCost(event.target.value)}
        onPriceChange={(event) => setProductPrice(event.target.value)}
        formatCurrency={formatCurrency}
        mode="edit"
        defaultValues={productModalDefaults}
        error={productError}
        saving={productSaving}
        categories={productCategories}
      />
    ) : modal === "sale-edit" ? (
      <SaleModal
        onSubmit={updateSale}
        onClose={() => {
          setModal(null);
          setEditingSaleId(null);
          setSaleError("");
        }}
        mode="edit"
        defaultValues={{
          ...saleModalDefaults,
          unitPrice: String(saleModalDefaults.unitPrice ?? "").replace(/\D/g, ""),
          amount: String(saleModalDefaults.total ?? "").replace(/\D/g, ""),
        }}
        error={saleError}
        saving={saleSaving}
      />
    ) : modal === "customer" ? (
      <CustomerModal
        onSubmit={addCustomer}
        onClose={() => setModal(null)}
        error={customerError}
        saving={customerSaving}
      />
    ) : modal === "customer-edit" ? (
      <CustomerModal
        onSubmit={updateCustomer}
        onClose={() => {
          setModal(null);
          setEditingCustomerId(null);
          setCustomerError("");
        }}
        error={customerError}
        saving={customerSaving}
        mode="edit"
        defaultValues={customerModalDefaults}
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
            {active !== "Administracion General" && (
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
            )}
          </div>
          {isSummary ? (
            <DashboardView
              lowStock={lowStock}
              filteredOrders={filteredOrders}
              setActive={setActive}
            />
          ) : active === "Administracion General" ? (
            <GeneralAdministrationView />
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
                <ProductsView
                  products={products}
                  onRowClick={(product) => {
                    const selectedId = product.idArticulo ?? product.id ?? product.sku;
                    const parseAmount = (value) => String(value ?? "").replace(/\D/g, "");
                    setEditingProductId(selectedId);
                    setProductCost(parseAmount(product.cost));
                    setProductPrice(parseAmount(product.price));
                    setProductError("");
                    setModal("product-edit");
                  }}
                />
              ) : active === "Ventas" ? (
                <SalesView
                  sales={sales}
                  onRowClick={(sale) => {
                    setEditingSaleId(sale.idVenta ?? sale.id);
                    setSaleError("");
                    setModal("sale-edit");
                  }}
                />
              ) : active === "Clientes" ? (
                <CustomersView
                  customers={filteredCustomers}
                  totalCustomers={customerRows.length}
                  onRowClick={(customer) => {
                    const selectedId = customer.id ?? customer.idCliente ?? customer.codigo;
                    setEditingCustomerId(selectedId);
                    setCustomerError("");
                    setModal("customer-edit");
                  }}
                />
              ) : (
                <OrdersView
                  orders={filteredOrders}
                  onRowClick={(order) => {
                    setEditingOrderId(order.idOrden ?? order.id);
                    setOrderCustomer(order.customer ?? order.cliente ?? "");
                    setOrderError("");
                    setModal("order-edit");
                  }}
                />
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
