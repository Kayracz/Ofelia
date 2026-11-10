
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  products as initialProducts,
  type Product,
} from "../data/products";

import { getProducts } from "../services/productService";

import {
  createProduct,
  updateProductApi,
  deleteProductApi,
} from "../services/adminService";

import {
  ProductsContext,
  type ProductsContextValue,
} from "./ProductsContextValue";

const STORAGE_KEY = "ofelia-products";

interface ProductVariant {
  label: string;
  price: number;
}

type ProductWithVariants = Product & {
  variants?: ProductVariant[];
};

type NewProduct = Omit<Product, "id"> & {
  variants?: ProductVariant[];
};

interface ProductsProviderProps {
  children: ReactNode;
}

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
    console.error(
      "No se pudieron cargar los productos:",
      error
    );
  }

  return initialProducts;
}

function normalizeProduct(
  product: Product
): Product {
  const productWithVariants =
    product as ProductWithVariants;

  return {
    ...product,
    variants: Array.isArray(productWithVariants.variants)
      ? productWithVariants.variants.map((variant) => ({
          label: variant.label,
          price: Number(variant.price),
        }))
      : [],
  };
}

export function ProductsProvider({
  children,
}: ProductsProviderProps) {
  const [products, setProducts] =
    useState<Product[]>(getInitialProducts);

  // Load products from MongoDB API
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const apiProducts = await getProducts();

        if (cancelled) return;

        setProducts(
          apiProducts.map(normalizeProduct)
        );
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

  // Save products in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
      );
    } catch (error) {
      console.error(
        "No se pudieron guardar los productos localmente:",
        error
      );
    }
  }, [products]);

  // Add product
  async function addProduct(
    product: NewProduct
  ): Promise<Product> {
    const createdProduct = await createProduct(product);

    const normalizedProduct =
      normalizeProduct(createdProduct);

    setProducts((current) => [
      ...current,
      normalizedProduct,
    ]);

    return normalizedProduct;
  }

  // Update product
  async function updateProduct(
    id: number,
    updatedProduct: NewProduct
  ): Promise<void> {
    const savedProduct = await updateProductApi(
      id,
      updatedProduct
    );

    const normalizedProduct =
      normalizeProduct(savedProduct);

    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? normalizedProduct
          : product
      )
    );
  }

  // Delete product
  async function deleteProduct(
    id: number
  ): Promise<void> {
    await deleteProductApi(id);

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
