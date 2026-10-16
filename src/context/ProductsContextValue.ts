
import { createContext } from "react";
import type { Product } from "../data/products";

type NewProduct = Omit<Product, "id">;

export interface ProductsContextValue {
  products: Product[];
  addProduct: (product: NewProduct) => Promise<Product>;
  updateProduct: (
    id: number,
    product: NewProduct
  ) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const ProductsContext =
  createContext<ProductsContextValue | undefined>(undefined);
