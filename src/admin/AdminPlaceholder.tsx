
import { Link, useLocation } from "react-router-dom";

function AdminPlaceholder() {
  const location = useLocation();

  const isOrders = location.pathname.startsWith("/admin/pedidos");

  const title = isOrders ? "Pedidos" : "Productos";
  const description = isOrders
    ? "Aquí gestionaremos los pedidos, clientes y estados de pago."
    : "Aquí podrás buscar, crear, editar y organizar los productos de OFELIA.";

  return (
    <section className="admin-placeholder">
      <p className="admin-eyebrow">ADMIN STUDIO / {title.toUpperCase()}</p>
      <h1>{title}</h1>
      <p>{description}</p>

      {isOrders ? (
        <span className="admin-coming-soon">BACKEND PENDIENTE</span>
      ) : (
        <Link to="/admin/productos/nuevo" className="admin-primary-button">
          + NUEVO PRODUCTO
        </Link>
      )}

      <Link to="/admin" className="admin-text-link">
        ← VOLVER AL DASHBOARD
      </Link>
    </section>
  );
}

export default AdminPlaceholder;
