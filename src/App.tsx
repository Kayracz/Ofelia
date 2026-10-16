
import { Routes, Route, useParams } from "react-router-dom";

import StoreLayout from "./layouts/StoreLayout";

import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import RequireAdmin from "./admin/RequireAdmin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";
import AdminProductForm from "./admin/AdminProductForm";
import AdminSiteImages from "./admin/AdminSiteImages";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function AdminProductFormRoute() {
  const { id } = useParams();

  return <AdminProductForm key={id ?? "new"} />;
}

function App() {
  return (
    <Routes>
      {/* Inicio de sesión */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Administración protegida */}
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="pedidos" element={<AdminOrders />} />          
          <Route path="productos" element={<AdminProducts />} />
          <Route path="imagenes" element={<AdminSiteImages />} />

          <Route
            path="productos/nuevo"
            element={<AdminProductFormRoute />}
          />

          <Route
            path="productos/editar/:id"
            element={<AdminProductFormRoute />}
          />
        </Route>
      </Route>

      {/* Tienda pública */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Products />} />

        <Route
          path="/productos/:slug"
          element={<ProductDetail key={window.location.pathname} />}
        />

        <Route path="/nosotras" element={<About />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmacion" element={<OrderConfirmation />} />
      </Route>
    </Routes>
  );
}

export default App;
