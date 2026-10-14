import { Link } from "react-router-dom";
import { useProducts } from "../context/useProducts";

function Home() {
  const { products } = useProducts();

  const newProducts = products
    .filter((product) => product.isNew)
    .slice(0, 4);

  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-image-placeholder">
          <span>EDITORIAL IMAGE</span>
          <span>1600 × 1100</span>
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">THE ART OF SILK</p>
          <h1>OFELIA</h1>
          <p className="hero-subtitle">Arte en seda</p>
          <Link to="/productos" className="text-link hero-link">
            SHOP THE COLLECTION <span>↗</span>
          </Link>
        </div>

        <span className="hero-index">01 / OFELIA COLLECTION</span>
      </section>

      <section className="home-new section-spacing">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DISCOVER OUR SELECTION</p>
            <h2>New in</h2>
          </div>

          <Link to="/productos?new=true" className="text-link">
            VIEW ALL <span>↗</span>
          </Link>
        </div>

        {newProducts.length > 0 ? (
          <div className="home-product-grid">
            {newProducts.map((product, index) => (
              <Link
                to={`/productos/${product.name.toLowerCase()}`}
                className="home-product"
                key={product.id}
              >
                <div className="product-image-placeholder">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="home-product-image"
                      loading="lazy"
                    />
                  ) : (
                    <span>PRODUCT IMAGE</span>
                  )}

                  <span className="home-product-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>
                    Bs {product.price.toLocaleString("es-BO")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="home-new-empty">
            Próximamente descubrirás nuevas piezas de OFELIA.
          </p>
        )}
      </section>

      <section className="home-story section-spacing">
        <div className="story-image-placeholder">
          <span>OFELIA'S STORY</span>
        </div>

        <div className="story-content">
          <p className="eyebrow">THE STORY BEHIND THE NAME</p>
          <h2>Una historia llamada Ofelia.</h2>
          <p>
            Inspirada en nuestra abuela Ofelia, nace una marca
            que celebra la belleza de los detalles, la expresión
            personal y el arte de llevar seda.
          </p>
          <p>
            Diseños creados con cariño para acompañarte
            y convertirse en parte de tu propia historia.
          </p>
          <Link to="/nosotras" className="text-link">
            CONOCE NUESTRA HISTORIA <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="home-styling section-spacing">
        <div className="styling-heading">
          <p className="eyebrow">ENDLESS WAYS TO WEAR</p>
          <h2>How to wear it</h2>
          <p>Un pañuelo. Infinitas maneras de expresarte.</p>
        </div>

        <div className="styling-grid">
          {[
            "Around the neck",
            "In your hair",
            "On your bag",
            "As a top",
          ].map((style, index) => (
            <div className="styling-item" key={style}>
              <div className="styling-image-placeholder">
                <span>STYLING {String(index + 1).padStart(2, "0")}</span>
              </div>
              <p>{style}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-community">
        <p className="eyebrow">A WORLD OF OUR OWN</p>
        <h2>Discover the world of Ofelia.</h2>
        <p>
          Inspiración, seda y pequeños detalles que hacen
          cada día especial.
        </p>

        <div className="community-links">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
          >
            INSTAGRAM ↗
          </a>

          <a
            href="https://wa.me/59170000000"
            target="_blank"
            rel="noreferrer"
          >
            WHATSAPP ↗
          </a>

          <Link to="/productos">SHOP OFELIA ↗</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
