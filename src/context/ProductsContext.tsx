 
import { useEffect, useState, type ReactNode } from "react";

import {
  products as initialProducts,
  type Product,
} from "../data/products";

import { getProducts } from "../services/productService";

import {
  ProductsContext,
  type ProductsContextValue,
} from "./ProductsContextValue";

const STORAGE_KEY = "ofelia-products";

type NewProduct = Omit<Product, "id">;

function getInitialProducts(): Product[] {
  try {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts) {
      const parsed: unknown = JSON.parse(savedProducts);

      if (Array.isArray(parsed)) {
        return parsed as Product[];
      }
    }
  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
  }

  return initialProducts;
}

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>(getInitialProducts);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const apiProducts = await getProducts();

        if (cancelled) return;

        const normalizedProducts: Product[] = apiProducts.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          isNew: product.isNew,
          description: product.description,
          imageUrl: product.imageUrl,
          images: product.images,
        }));

        setProducts(normalizedProducts);
      } catch (error) {
        console.error(
          "No se pudieron cargar los productos de la API. Se conserva el catálogo local.",
          error
        );
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("No se pudieron guardar los productos:", error);
    }
  }, [products]);

  function addProduct(product: NewProduct): Product {
    const newId =
      products.length > 0
        ? Math.max(...products.map((item) => item.id)) + 1
        : 1;

    const newProduct: Product = {
      ...product,
      id: newId,
    };

    setProducts((current) => [...current, newProduct]);

    return newProduct;
  }

  function updateProduct(id: number, updatedProduct: NewProduct) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...updatedProduct, id } : product
      )
    );
  }

  function deleteProduct(id: number) {
    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  }

  const value: ProductsContextValue = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
