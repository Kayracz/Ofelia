
import { Link, useSearchParams } from "react-router-dom";
import { products } from "../data/products";

const categories = [
  { label: "TODOS", value: "" },
  { label: "NEW IN", value: "new" },
  { label: "PAÑOLETAS", value: "panolletas" },
  { label: "FLECOS", value: "flecos" },
  { label: "TWILLYS", value: "twillys" },
];

function Products() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("categoria") ?? "";
  const isNew = searchParams.get("new") === "true";

  const filteredProducts = products.filter((product) => {
    if (category && product.category !== category) {
      return false;
    }

    if (isNew && !product.isNew) {
      return false;
    }

    return true;
  });

  const activeFilter = isNew ? "new" : category;

  return (
    <section className="catalog-page">
      <div className="catalog-heading">
        <p className="eyebrow">THE OFELIA COLLECTION</p>
        <h1>Silk, in your own way.</h1>
        <p>
          Piezas para llevar, regalar y hacer tuyas.
        </p>
      </div>

      <div className="catalog-toolbar">
        <nav className="catalog-filters" aria-label="Filtrar productos">
          {categories.map((item) => {
            const isActive = activeFilter === item.value;

            const to =
              item.value === "new"
                ? "/productos?new=true"
                : item.value
                  ? `/productos?categoria=${item.value}`
                  : "/productos";

            return (
              <Link
                key={item.label}
                to={to}
                className={isActive ? "is-active" : ""}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="catalog-count">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "PIEZA" : "PIEZAS"}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="catalog-grid">
          {filteredProducts.map((product, index) => (
            <Link
              to={`/productos/${product.name.toLowerCase()}`}
              className="catalog-product"
              key={product.id}
            >
              <div className="catalog-image-placeholder">
                {product.isNew && (
                  <span className="catalog-new-label">NEW</span>
                )}

                <span className="catalog-placeholder-label">
                  PRODUCT IMAGE
                </span>

                <span className="catalog-product-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="catalog-product-info">
                <h2>{product.name}</h2>
                <p>{product.price} USD</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <h2>Próximamente</h2>
          <p>Estamos preparando nuevas piezas para ti.</p>
          <Link to="/productos" className="text-link">
            VER TODA LA COLECCIÓN ↗
          </Link>
        </div>
      )}
    </section>
  );
}

export default Products;
