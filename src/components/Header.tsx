import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

function Header() {
  const { totalItems } = useCart();

  return (
    <header>
      <div>
        <Link to="/">OFELIA</Link>

        <nav>
          <Link to="/productos?new=true">NEW IN</Link>

          <Link to="/productos?categoria=panolletas">
            PAÑOLETAS
          </Link>

          <Link to="/productos?categoria=flecos">
            FLECOS
          </Link>

          <Link to="/productos?categoria=twillys">
            TWILLYS
          </Link>

          <Link to="/nosotras">NOSOTRAS</Link>
        </nav>

        <div>
          <Link to="/carrito">
            CARRITO ({totalItems})
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;