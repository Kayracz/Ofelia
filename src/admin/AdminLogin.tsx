
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminService";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await adminLogin(password);
      navigate("/admin", { replace: true });
    } catch {
      setError("No se pudo iniciar sesión. Revisa tu contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ofelia-login-page">
      <LinkBackToStore />

      <section className="ofelia-login-card">
        <div className="ofelia-login-brand">
          <span className="ofelia-login-logo">OFELIA</span>
          <span className="ofelia-login-brand-subtitle">
            ADMIN STUDIO
          </span>
        </div>

        <div className="ofelia-login-divider" />

        <div className="ofelia-login-heading">
          <p className="ofelia-login-eyebrow">
            PRIVATE ACCESS · OFELIA STORE
          </p>

          <h1>Bienvenida de nuevo.</h1>

          <p>
            Inicia sesión para gestionar tu tienda,
            tus productos y tus pedidos.
          </p>
        </div>

        <form
          className="ofelia-login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="admin-password">
            Contraseña de administrador
          </label>

          <div className="ofelia-login-input-wrap">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Introduce tu contraseña"
              required
              autoFocus
            />

            <button
              type="button"
              className="ofelia-login-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showPassword ? "OCULTAR" : "MOSTRAR"}
            </button>
          </div>

          {error && (
            <div className="ofelia-login-error" role="alert">
              <span>!</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="ofelia-login-submit"
            disabled={loading || !password.trim()}
          >
            <span>
              {loading ? "VERIFICANDO ACCESO..." : "INICIAR SESIÓN"}
            </span>

            {!loading && <span>↗</span>}
          </button>
        </form>

        <div className="ofelia-login-footer">
          <span>OFELIA</span>
          <span>ACCESO EXCLUSIVO PARA ADMINISTRADORES</span>
        </div>
      </section>

      <p className="ofelia-login-copyright">
        © OFELIA STORE · ADMIN STUDIO
      </p>
    </main>
  );
}

function LinkBackToStore() {
  return (
    <a href="/" className="ofelia-login-back">
      ← VOLVER A LA TIENDA
    </a>
  );
}

export default AdminLogin;
