
import { Routes, Route } from "react-router-dom";

import StoreLayout from "./layouts/StoreLayout";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminPlaceholder from "./admin/AdminPlaceholder";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:slug" element={<ProductDetail />} />
        <Route path="/nosotras" element={<About />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmacion" element={<OrderConfirmation />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="productos" element={<AdminPlaceholder />} />
        <Route path="productos/nuevo" element={<AdminPlaceholder />} />
        <Route path="productos/editar/:id" element={<AdminPlaceholder />} />
        <Route path="pedidos" element={<AdminPlaceholder />} />
      </Route>
    </Routes>
  );
}

export default App;
