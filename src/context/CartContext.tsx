
import {
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

import type {
  Product,
  ProductVariant,
} from "../data/products";

import {
  CartContext,
  type CartItem,
} from "./CartContextValue";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: CartItem;
    }
  | {
      type: "REMOVE_ITEM";
      payload: {
        productId: number;
        variantLabel?: string;
      };
    }
  | {
      type: "INCREASE_QUANTITY";
      payload: {
        productId: number;
        variantLabel?: string;
      };
    }
  | {
      type: "DECREASE_QUANTITY";
      payload: {
        productId: number;
        variantLabel?: string;
      };
    }
  | {
      type: "CLEAR_CART";
    };

const STORAGE_KEY = "ofelia-cart";

const initialState: CartState = {
  items: [],
};

// Identify a product and its selected size
function isSameCartItem(
  item: CartItem,
  productId: number,
  variantLabel?: string
): boolean {
  return (
    item.product.id === productId &&
    (item.variant?.label ?? "") === (variantLabel ?? "")
  );
}

// Restore existing saved carts safely
function getInitialState(): CartState {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);

    if (!savedCart) return initialState;

    const parsed = JSON.parse(savedCart);

    if (!Array.isArray(parsed.items)) {
      return initialState;
    }

    return {
      items: parsed.items
        .filter(
          (item: CartItem) =>
            item &&
            item.product &&
            typeof item.product.id === "number" &&
            typeof item.quantity === "number" &&
            item.quantity > 0
        )
        .map((item: CartItem) => ({
          ...item,
          variant: item.variant
            ? {
                label: item.variant.label,
                price: Number(item.variant.price),
              }
            : undefined,
        })),
    };
  } catch (error) {
    console.error(
      "Error loading saved cart:",
      error
    );

    return initialState;
  }
}

function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = action.payload;

      const existingItem = state.items.find((item) =>
        isSameCartItem(
          item,
          newItem.product.id,
          newItem.variant?.label
        )
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            isSameCartItem(
              item,
              newItem.product.id,
              newItem.variant?.label
            )
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !isSameCartItem(
              item,
              action.payload.productId,
              action.payload.variantLabel
            )
        ),
      };

    case "INCREASE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          isSameCartItem(
            item,
            action.payload.productId,
            action.payload.variantLabel
          )
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            isSameCartItem(
              item,
              action.payload.productId,
              action.payload.variantLabel
            )
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    getInitialState
  );

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch (error) {
      console.error(
        "Error saving cart:",
        error
      );
    }
  }, [state]);

  // Add product with optional size variation
  const addToCart = (
    product: Product,
    variant?: ProductVariant
  ) => {
    const selectedProduct: Product = {
      ...product,
      price: variant
        ? Number(variant.price)
        : product.price,
    };

    window.dispatchEvent(
  new CustomEvent("ofelia:cart-added", {
    detail: {
      name: product.name,
    },
  })
);

    dispatch({
      type: "ADD_ITEM",
      payload: {
        product: selectedProduct,
        quantity: 1,
        variant: variant
          ? {
              label: variant.label,
              price: Number(variant.price),
            }
          : undefined,
      },
    });
  };

  const removeFromCart = (
    productId: number,
    variantLabel?: string
  ) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: {
        productId,
        variantLabel,
      },
    });
  };

  const increaseQuantity = (
    productId: number,
    variantLabel?: string
  ) => {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: {
        productId,
        variantLabel,
      },
    });
  };

  const decreaseQuantity = (
    productId: number,
    variantLabel?: string
  ) => {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: {
        productId,
        variantLabel,
      },
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });
  };

  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = state.items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
