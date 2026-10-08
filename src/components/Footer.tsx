import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>

      <div>

        <div>
          <h2>OFELIA</h2>

          <p>
            Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
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
            Lorem ipsum dolor sit amet.
          </p>

          <p>
            WhatsApp
          </p>

          <p>
            Instagram
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