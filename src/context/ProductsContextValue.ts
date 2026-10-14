
import { createContext } from "react";
import type { Product } from "../data/products";

type NewProduct = Omit<Product, "id">;

export interface ProductsContextValue {
  products: Product[];
  addProduct: (product: NewProduct) => Product;
  updateProduct: (id: number, product: NewProduct) => void;
  deleteProduct: (id: number) => void;
}

export const ProductsContext =
  createContext<ProductsContextValue | undefined>(undefined);
