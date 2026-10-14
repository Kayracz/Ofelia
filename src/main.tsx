
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SiteImagesProvider } from "./context/SiteImagesContext";

import App from "./App";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
   <BrowserRouter>
    <ProductsProvider>
      <SiteImagesProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </SiteImagesProvider>
    </ProductsProvider>
  </BrowserRouter>
  </StrictMode>
);
