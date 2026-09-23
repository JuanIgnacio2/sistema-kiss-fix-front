import { OrderTable } from "../components/DataTables";

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

function ArrowIcon() {
  return <span className="icon icon-arrow" aria-hidden="true">↗</span>;
}

export default function DashboardView({ lowStock, filteredOrders, setActive }) {
  return (
    <>
      <section className="metrics">
        <Metric label="Ventas del dia" value="$ 486.500" trend="+12,8%" note="vs. ayer" type="up" icon="↗" />
        <Metric label="Ordenes abiertas" value="12" trend="3" note="listas para entregar" type="neutral" icon="⌁" />
        <Metric label="Ganancia estimada" value="$ 218.300" trend="+8,4%" note="este mes" type="up" icon="$" />
        <Metric label="Stock critico" value={String(lowStock.length)} trend="Reponer" note="articulos" type="warning" icon="!" />
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
              <div className="grid-lines"><i /><i /><i /><i /></div>
              <svg viewBox="0 0 620 190" preserveAspectRatio="none" aria-label="Grafico de ventas">
                <defs>
                  <linearGradient id="gold-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#cba45d" stopOpacity=".27" />
                    <stop offset="1" stopColor="#cba45d" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 145 C55 139, 70 115, 115 125 S170 155, 215 104 S270 110, 310 80 S375 108, 410 91 S455 62, 500 82 S560 52, 620 30 L620 190 L0 190 Z" fill="url(#gold-fill)" />
                <path d="M0 145 C55 139, 70 115, 115 125 S170 155, 215 104 S270 110, 310 80 S375 108, 410 91 S455 62, 500 82 S560 52, 620 30" fill="none" stroke="#d8b36a" strokeWidth="3" />
              </svg>
              <div className="x-axis">
                <span>Lun 05</span><span>Mar 06</span><span>Mie 07</span><span>Jue 08</span><span>Vie 09</span><span>Sab 10</span><span>Dom 11</span>
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
            <button className="text-button" onClick={() => setActive("Stock")}>
              Ver todo <ArrowIcon />
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
                <span className="stock-count">{product.stock} unid.</span>
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
          <button className="text-button" onClick={() => setActive("Ordenes de reparacion")}>
            Ver todas <ArrowIcon />
          </button>
        </div>
        <OrderTable orders={filteredOrders} />
      </section>
    </>
  );
}
