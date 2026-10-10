
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "NEW IN", to: "/productos?new=true" },
    { label: "PAÑOLETAS", to: "/productos?categoria=panolletas" },
    { label: "FLECOS", to: "/productos?categoria=flecos" },
    { label: "TWILLYS", to: "/productos?categoria=twillys" },
    { label: "NOSOTRAS", to: "/nosotras" },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <Link
          to="/"
          className="header-logo"
          aria-label="Ofelia, inicio"
          onClick={closeMenu}
        >
          OFELIA
        </Link>

        <nav className="desktop-navigation" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/carrito"
          className="header-cart"
          aria-label={`Carrito, ${totalItems} productos`}
          onClick={closeMenu}
        >
          <svg
            viewBox="0 0 24 24"
            width="21"
            height="21"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 4h2l2.1 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20.5 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>

          <span className="cart-count">{totalItems}</span>
        </Link>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-navigation ${menuOpen ? "is-open" : ""}`}
        aria-label="Navegación móvil"
        aria-hidden={!menuOpen}
      >
        {navLinks.map((link, index) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span className="mobile-nav-number">
              0{index + 1}
            </span>
            <span>{link.label}</span>
            <span className="mobile-nav-arrow">↗</span>
          </Link>
        ))}

        <div className="mobile-menu-footer">
          <span>THE ART OF SILK</span>
          <span>OFELIA © 2026</span>
        </div>
      </nav>

      {menuOpen && (
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}

export default Header;
