
import { useCallback, useEffect, useState } from "react";
import {
  getAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
} from "../services/orderAdminService";

const statusLabels: Record<AdminOrder["status"], string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  cancelado: "Cancelado",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 2,
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("No se pudieron cargar los pedidos.");
      }
    } finally {
      setLoading(false);
    }
  }, []);


useEffect(() => {
  let cancelled = false;

  async function fetchOrders() {
    try {
      const data = await getAdminOrders();

      if (!cancelled) {
        setOrders(data);
        setError("");
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los pedidos."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  void fetchOrders();

  return () => {
    cancelled = true;
  };
}, []);


  async function handleStatusChange(
    order: AdminOrder,
    status: AdminOrder["status"]
  ) {
    if (status === order.status) return;

    setUpdatingId(order._id);
    setError("");

    try {
      await updateAdminOrderStatus(order._id, status);

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id ? { ...item, status } : item
        )
      );
    } catch {
      setError(
        `No se pudo actualizar el pedido ${order.orderNumber}. Comprueba tu sesión y la conexión con el servidor.`
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="admin-orders-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">ADMIN STUDIO / PEDIDOS</p>
          <h1>Pedidos</h1>
          <p>Gestiona las compras, los clientes y los estados de los pedidos.</p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={() => void loadOrders()}
          disabled={loading}
        >
          {loading ? "Cargando..." : "↻ Actualizar"}
        </button>
      </div>

      <div className="admin-orders-summary">
        <div>
          <span>Total de pedidos</span>
          <strong>{orders.length}</strong>
        </div>
        <div>
          <span>Pendientes</span>
          <strong>
            {orders.filter((order) => order.status === "pendiente").length}
          </strong>
        </div>
        <div>
          <span>Pagados</span>
          <strong>
            {orders.filter((order) => order.status === "pagado").length}
          </strong>
        </div>
      </div>

      {error && (
        <div className="admin-orders-message error" role="alert">
          {error}
          <button type="button" onClick={() => void loadOrders()}>
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-orders-message">
          Cargando pedidos...
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-orders-empty">
          <span>01 / PEDIDOS</span>
          <h2>Aún no hay pedidos.</h2>
          <p>Los pedidos registrados en la tienda aparecerán aquí.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <article className="admin-order-card" key={order._id}>
              <div className="admin-order-top">
                <div>
                  <span className="admin-order-label">PEDIDO</span>
                  <h2>{order.orderNumber}</h2>
                  <p>{formatDate(order.createdAt)}</p>
                </div>

                <span
                  className={`admin-order-status status-${order.status}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="admin-order-details">
                <div>
                  <span className="admin-order-label">CLIENTE</span>
                  <strong>
                    {order.customer.name} {order.customer.lastName}
                  </strong>
                  <p>{order.customer.email}</p>
                  <p>{order.customer.phone}</p>
                </div>

                <div>
                  <span className="admin-order-label">ENTREGA</span>
                  <strong>
                    {order.delivery.method === "envio"
                      ? "Envío a domicilio"
                      : "Retiro"}
                  </strong>
                  <p>
                    {order.delivery.city}, {order.delivery.department}
                  </p>
                  {order.delivery.address && <p>{order.delivery.address}</p>}
                  {order.delivery.reference && (
                    <p>Referencia: {order.delivery.reference}</p>
                  )}
                </div>
              </div>

              <div className="admin-order-items">
                <span className="admin-order-label">PRODUCTOS</span>
                {order.items.map((item, index) => (
                  <div
                    className="admin-order-item"
                    key={`${item.productId}-${index}`}
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <strong>
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="admin-order-footer">
                <div>
                  <span className="admin-order-label">TOTAL</span>
                  <strong className="admin-order-total">
                    {formatPrice(order.totalPrice)}
                  </strong>
                </div>

                <label className="admin-order-status-control">
                  Estado del pedido
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(event) =>
                      void handleStatusChange(
                        order,
                        event.target.value as AdminOrder["status"]
                      )
                    }
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {updatingId === order._id && (
                    <span>Guardando cambio...</span>
                  )}
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminOrders;
