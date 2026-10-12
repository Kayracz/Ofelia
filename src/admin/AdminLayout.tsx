
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: "⌂", end: true },
  { label: "Productos", to: "/admin/productos", icon: "◇" },
  { label: "Pedidos", to: "/admin/pedidos", icon: "▤" },
];

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-shell">
      {menuOpen && (
        <button
          type="button"
          className="admin-mobile-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <NavLink
          to="/admin"
          className="admin-brand"
          onClick={() => setMenuOpen(false)}
        >
          OFELIA
          <span>ADMIN STUDIO</span>
        </NavLink>

        <div className="admin-nav-label">WORKSPACE</div>

        <nav className="admin-navigation">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-nav-icon">{link.icon}</span>
              <span>{link.label}</span>
              <span className="admin-nav-arrow">↗</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <span className="admin-status-dot" />
          <div>
            <strong>OFELIA STORE</strong>
            <span>Panel de gestión</span>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-button"
            aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className="admin-topbar-title">
            <span>OFELIA</span>
            <span>/</span>
            <span>ADMIN STUDIO</span>
          </div>

          <span className="admin-preview-label">PROTOTIPO</span>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
