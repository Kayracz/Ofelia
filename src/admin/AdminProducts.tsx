
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/useProducts";

function AdminProducts() {
  const { products, deleteProduct } = useProducts();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: number, name: string) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${name}"?`
    );

    if (!confirmed || deletingId !== null) return;

    setError("");
    setDeletingId(id);

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("No se pudo eliminar el producto:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto. Inténtalo de nuevo."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="admin-products-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CATÁLOGO</span>
          <h1>Productos</h1>
          <p>Gestiona los productos de tu tienda OFELIA.</p>
        </div>

        <Link
          to="/admin/productos/nuevo"
          className="admin-primary-button"
        >
          + Nuevo producto
        </Link>
      </div>

      {error && (
        <p className="admin-upload-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-products-toolbar">
        <input
          type="search"
          placeholder="Buscar producto por nombre..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Buscar productos"
        />

        <span>
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-name">
                    {product.imageUrl ? (
                      <div className="admin-product-thumbnail">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      </div>
                    ) : (
                      <span className="admin-product-placeholder">
                        O
                      </span>
                    )}

                    <span>{product.name}</span>
                  </div>
                </td>

                <td>
                  {product.category === "panolletas"
                    ? "Pañolletas"
                    : product.category === "flecos"
                      ? "Flecos"
                      : "Twillys"}
                </td>

                <td>
                  {product.price.toLocaleString("es-BO", {
                    style: "currency",
                    currency: "BOB",
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td>
                  {product.isNew ? (
                    <span className="admin-status admin-status-new">
                      New In
                    </span>
                  ) : (
                    <span className="admin-status">Publicado</span>
                  )}
                </td>

                <td>
                  <div className="admin-row-actions">
                    <Link
                      to={`/admin/productos/editar/${product.id}`}
                      className="admin-text-action"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      className="admin-delete-action"
                      onClick={() =>
                        void handleDelete(product.id, product.name)
                      }
                      disabled={deletingId !== null}
                    >
                      {deletingId === product.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-empty-state">
                  {products.length === 0
                    ? "Todavía no tienes productos."
                    : "No encontramos productos con ese nombre."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminProducts;
