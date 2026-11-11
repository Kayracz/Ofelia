
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "../data/products";

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

function normalizeProduct(product: Product): Product {
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
  const [products, setProducts] = useState<Product[]>([]);

  // Load products exclusively from MongoDB
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const apiProducts = await getProducts();

        if (cancelled) return;

        setProducts(apiProducts.map(normalizeProduct));
      } catch (error) {
        console.error(
          "Could not load products from the API:",
          error
        );

        if (!cancelled) {
          setProducts([]);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Add product
  async function addProduct(
    product: NewProduct
  ): Promise<Product> {
    const createdProduct = await createProduct(product);

    const normalizedProduct =
      normalizeProduct(createdProduct);

    setProducts((current) => [
      normalizedProduct,
      ...current,
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
