import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>

      <div>

        <div>
          <h2>OFELIA</h2>

          <p>
          THE OFELIA COLLECTION
          </p>
        </div>

        <div>
          <h3>SHOP</h3>

          <Link to="/productos">
            Productos
          </Link>

          <Link to="/productos?new=true">
            New In
          </Link>

          <Link to="/productos?categoria=panolletas">
            Pañoletas
          </Link>

          <Link to="/productos?categoria=flecos">
            Flecos
          </Link>

          <Link to="/productos?categoria=twillys">
            Twillys
          </Link>
        </div>

        <div>
          <h3>OFELIA</h3>

          <Link to="/nosotras">
            Sobre Nosotros
          </Link>

          <Link to="/carrito">
            Carrito
          </Link>
        </div>


      <div>
        <h3>CONTACTO</h3>

        <p>
          <a
            href="https://www.tiktok.com/@weareofelia"
            target="_blank"
            rel="noopener noreferrer"
          >
            TikTok
          </a>
        </p>

        <p>
          <a
            href="https://wa.me/59175086484"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </p>

        <p>
          <a
            href="https://www.instagram.com/weareofelia/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </p>
      </div>


      </div>

      <div>
        © 2026 OFELIA
      </div>

    </footer>
  );
}

export default Footer;