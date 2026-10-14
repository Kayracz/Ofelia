import { useState } from "react";
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

  const galleryImages = product
    ? product.images?.length
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : []
    : [];

  const [activeImage, setActiveImage] = useState(() => 0);

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

  const categoryLabel =
    product.category === "panolletas"
      ? "SILK SCARF"
      : product.category === "flecos"
        ? "FRINGED SCARF"
        : "SILK TWILLY";

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
            {galleryImages.length > 0 ? (
              <img
                src={galleryImages[activeImage] ?? galleryImages[0]}
                alt={`${product.name} - fotografía ${activeImage + 1}`}
                className="product-detail-image"
              />
            ) : (
              <span>PRODUCT IMAGE</span>
            )}

            {product.isNew && (
              <span className="detail-new-label">NEW IN</span>
            )}

            <span className="detail-image-note">
              {`IMAGEN · ${String(activeImage + 1).padStart(2, "0")}`}
            </span>
          </div>

          {galleryImages.length > 1 && (
            <div
              className="product-secondary-images"
              aria-label="Galería de fotografías"
            >
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={`product-thumbnail ${
                    activeImage === index ? "is-active" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Ver fotografía ${index + 1}`}
                  aria-pressed={activeImage === index}
                >
                  <img
                    src={image}
                    alt={`${product.name}, vista ${index + 1}`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <p className="eyebrow">{categoryLabel}</p>

          <h1>{product.name}</h1>

          <p className="product-detail-price">
            Bs {product.price.toLocaleString("es-BO")}
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
              <summary>
                DETALLES DEL PRODUCTO <span>+</span>
              </summary>
              <p>
                Una pieza diseñada para aportar un detalle especial
                a tu estilo. Consulta la descripción para conocer
                los detalles disponibles de cada diseño.
              </p>
            </details>

            <details>
              <summary>
                ENVÍOS Y ENTREGAS <span>+</span>
              </summary>
              <p>
                Los detalles de envío, tiempos de entrega y opciones
                de retiro se confirmarán al realizar tu pedido.
              </p>
            </details>

            <details>
              <summary>
                CUIDADO DE LA PIEZA <span>+</span>
              </summary>
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
            .map((item) => {
              const itemImage =
                item.images?.[0] || item.imageUrl || "";

              return (
                <Link
                  to={`/productos/${item.name.toLowerCase()}`}
                  key={item.id}
                  className="product-more-card"
                >
                  <div className="product-more-placeholder">
                    {itemImage ? (
                      <img
                        src={itemImage}
                        alt={item.name}
                        className="product-more-image"
                        loading="lazy"
                      />
                    ) : (
                      <span>PRODUCT IMAGE</span>
                    )}
                  </div>

                  <div className="product-more-info">
                    <span>{item.name}</span>
                    <span>
                      Bs {item.price.toLocaleString("es-BO")}
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
