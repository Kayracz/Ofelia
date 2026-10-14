
import { Link } from "react-router-dom";
import { useProducts } from "../context/useProducts";

function AdminDashboard() {
  const { products } = useProducts();
  const newProducts = products.filter((product) => product.isNew).length;

  const categories = new Set(products.map((product) => product.category));

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">YOUR WORKSPACE</p>
          <h1>Dashboard</h1>
          <p>Bienvenida a la administración de OFELIA.</p>
        </div>

        <Link to="/admin/productos/nuevo" className="admin-primary-button">
          <span>+</span> NUEVO PRODUCTO
        </Link>
      </div>

      <section className="admin-stats">
        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>PRODUCTOS</span>
            <span className="admin-stat-icon">◇</span>
          </div>
          <strong>{products.length.toString().padStart(2, "0")}</strong>
          <p>Productos de prueba</p>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>NEW IN</span>
            <span className="admin-stat-icon">✳</span>
          </div>
          <strong>{newProducts.toString().padStart(2, "0")}</strong>
          <p>Marcados como novedades</p>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>CATEGORÍAS</span>
            <span className="admin-stat-icon">▦</span>
          </div>
          <strong>{categories.size.toString().padStart(2, "0")}</strong>
          <p>Categorías con productos</p>
        </article>

        <article className="admin-stat-card">
          <div className="admin-stat-top">
            <span>PEDIDOS</span>
            <span className="admin-stat-icon">▤</span>
          </div>
          <strong>—</strong>
          <p>Pendiente de conectar backend</p>
        </article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">YOUR COLLECTION</p>
            <h2>Productos</h2>
          </div>

          <Link to="/admin/productos" className="admin-text-link">
            VER TODOS ↗
          </Link>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-product-table">
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>CATEGORÍA</th>
                <th>PRECIO</th>
                <th>ESTADO</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-cell">
                      <div className="admin-product-thumb">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <strong>{product.name}</strong>
                        <span>ID: {product.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    {product.category === "panolletas"
                      ? "Pañoletas"
                      : product.category === "flecos"
                        ? "Flecos"
                        : "Twillys"}
                  </td>

                  <td>{product.price} USD</td>

                  <td>
                    <span className="admin-product-status">
                      <span />
                      Activo
                    </span>
                    {product.isNew && (
                      <span className="admin-new-tag">NEW</span>
                    )}
                  </td>

                  <td>
                    <Link
                      to={`/admin/productos/editar/${product.id}`}
                      className="admin-row-action"
                      aria-label={`Editar ${product.name}`}
                    >
                      ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="admin-demo-note">
          Vista previa con datos locales. Los cambios todavía no se guardan
          en una base de datos.
        </p>
      </section>

      <section className="admin-quick-actions">
        <Link to="/admin/productos/nuevo" className="admin-quick-card">
          <span>01</span>
          <div>
            <h3>Crear producto</h3>
            <p>Añade una nueva pieza a la colección.</p>
          </div>
          <span className="admin-quick-arrow">↗</span>
        </Link>

        <Link to="/admin/productos" className="admin-quick-card">
          <span>02</span>
          <div>
            <h3>Gestionar colección</h3>
            <p>Consulta y organiza tus productos.</p>
          </div>
          <span className="admin-quick-arrow">↗</span>
        </Link>

        <Link to="/admin/pedidos" className="admin-quick-card">
          <span>03</span>
          <div>
            <h3>Consultar pedidos</h3>
            <p>Prepara el seguimiento de las compras.</p>
          </div>
          <span className="admin-quick-arrow">↗</span>
        </Link>
      </section>
    </div>
  );
}

export default AdminDashboard;
