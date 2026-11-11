
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken, adminLogout } from "../services/adminService";

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];

    if (!payload) return true;

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = JSON.parse(atob(base64));

    if (typeof decoded.exp !== "number") return true;

    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function RequireAdmin() {
  const location = useLocation();
  const token = getAdminToken();

  if (!token || isTokenExpired(token)) {
    if (token) {
      adminLogout();
    }

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
          sessionExpired: Boolean(token),
        }}
      />
    );
  }

  return <Outlet />;
}

export default RequireAdmin;
