
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken } from "../services/adminService";

function RequireAdmin() {
  const location = useLocation();
  const token = getAdminToken();

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default RequireAdmin;
