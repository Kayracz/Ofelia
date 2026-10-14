
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useProducts } from "../context/useProducts";

function ProductDetail() {
   const { products } = useProducts();
  const { slug } = useParams();
  const { addToCart } = useCart();

  const product = products.find(
    (item) => item.name.toLowerCase() === slug
  );

  if (!product) {
    return (
      <section className="product-not-found">
        <p className="eyebrow">OFELIA COLLECTION</p>
        <h1>Esta pieza no está disponible.</h1>
        <Link to="/productos" className="text-link">
          VOLVER A LA COLECCIÓN ↗
        </Link>
      </section>
    );
  }

  return (
    <div className="product-detail-page">
      <nav className="product-breadcrumb" aria-label="Ruta de navegación">
        <Link to="/">INICIO</Link>
        <span>/</span>
        <Link to="/productos">COLECCIÓN</Link>
        <span>/</span>
        <span>{product.name.toUpperCase()}</span>
      </nav>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-main-image">
            {product.isNew && (
              <span className="detail-new-label">NEW IN</span>
            )}
            <span>PRODUCT IMAGE</span>
            <span className="detail-image-note">
              IMAGEN PRINCIPAL · 01
            </span>
          </div>

          <div className="product-secondary-images">
            <div>
              <span>DETAIL IMAGE 02</span>
            </div>
            <div>
              <span>DETAIL IMAGE 03</span>
            </div>
          </div>
        </div>

        <div className="product-detail-info">
          <p className="eyebrow">
            {product.category === "panolletas"
              ? "SILK SCARF"
              : product.category === "flecos"
                ? "FRINGED SCARF"
                : "SILK TWILLY"}
          </p>

          <h1>{product.name}</h1>

          <p className="product-detail-price">
            {product.price} USD
          </p>

          <div className="product-detail-divider" />

          <p className="product-detail-description">
            {product.description}
          </p>

          <p className="product-detail-note">
            Diseñado para acompañarte en cada ocasión.
            Una pieza versátil para expresar tu propio estilo.
          </p>

          <button
            type="button"
            className="add-to-cart-button"
            onClick={() => addToCart(product)}
          >
            <span>AGREGAR AL CARRITO</span>
            <span>↗</span>
          </button>

          <p className="product-shipping-note">
            ENVÍOS Y ENTREGAS · CONSULTAR POR WHATSAPP
          </p>

          <div className="product-accordions">
            <details>
              <summary>DETALLES DEL PRODUCTO <span>+</span></summary>
              <p>
                Una pieza diseñada para aportar un detalle especial
                a tu estilo. Más información sobre materiales,
                medidas y cuidados estará disponible próximamente.
              </p>
            </details>

            <details>
              <summary>ENVÍOS Y ENTREGAS <span>+</span></summary>
              <p>
                Los detalles de envío, tiempos de entrega y opciones
                de retiro se confirmarán al realizar tu pedido.
              </p>
            </details>

            <details>
              <summary>CUIDADO DE LA PIEZA <span>+</span></summary>
              <p>
                Consulta las instrucciones de cuidado específicas
                de cada pieza antes de limpiarla.
              </p>
            </details>
          </div>

          <Link to="/productos" className="back-to-collection">
            ← VOLVER A LA COLECCIÓN
          </Link>
        </div>
      </section>

      <section className="product-more">
        <p className="eyebrow">DISCOVER MORE</p>
        <h2>También te puede gustar</h2>

        <div className="product-more-grid">
          {products
            .filter((item) => item.id !== product.id)
            .slice(0, 3)
            .map((item) => (
              <Link
                to={`/productos/${item.name.toLowerCase()}`}
                key={item.id}
                className="product-more-card"
              >
                <div className="product-more-placeholder">
                  <span>PRODUCT IMAGE</span>
                </div>
                <div className="product-more-info">
                  <span>{item.name}</span>
                  <span>{item.price} USD</span>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
