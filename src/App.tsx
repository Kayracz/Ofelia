import { Routes, Route } from "react-router-dom";

import StoreLayout from "./layouts/StoreLayout";

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

        <Route
          path="/"
          element={<Home />}
        />

         <Route path="/home" element={<Home />} />

        <Route
          path="/productos"
          element={<Products />}
        />

        <Route
          path="/productos/:slug"
          element={<ProductDetail />}
        />

        <Route
          path="/nosotras"
          element={<About />}
        />

        <Route
          path="/carrito"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/confirmacion"
          element={<OrderConfirmation />}
        />

      </Route>

    </Routes>
  );
}

export default App;