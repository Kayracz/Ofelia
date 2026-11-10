
import { createContext } from "react";
import type {
  Product,
  ProductVariant,
} from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface CartContextType {
  items: CartItem[];

  addToCart: (
    product: Product,
    variant?: ProductVariant
  ) => void;

  removeFromCart: (
    productId: number,
    variantLabel?: string
  ) => void;

  increaseQuantity: (
    productId: number,
    variantLabel?: string
  ) => void;

  decreaseQuantity: (
    productId: number,
    variantLabel?: string
  ) => void;

  clearCart: () => void;

  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<
  CartContextType | undefined
>(undefined);
