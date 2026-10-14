import { Routes, Route, useParams } from "react-router-dom";

import StoreLayout from "./layouts/StoreLayout";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminPlaceholder from "./admin/AdminPlaceholder";
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
      {/* ADMINISTRACIÓN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="pedidos" element={<AdminPlaceholder />} />
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

      {/* TIENDA PÚBLICA */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Products />} />

        <Route
          path="/productos/:slug"
          element={
            <ProductDetail key={window.location.pathname} />
          }
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