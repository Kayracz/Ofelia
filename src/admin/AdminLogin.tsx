
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminService";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    <main className="admin-form-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">OFELIA</span>
          <h1>Administración</h1>
          <p>Inicia sesión para gestionar tu tienda.</p>
        </div>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <label>
          Contraseña de administrador
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p role="alert">{error}</p>}

        <button
          type="submit"
          className="admin-primary-button"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;
