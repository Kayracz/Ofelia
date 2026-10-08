import {
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

import type { Product } from "../data/products";

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
      payload: Product;
    }
  | {
      type: "REMOVE_ITEM";
      payload: number;
    }
  | {
      type: "INCREASE_QUANTITY";
      payload: number;
    }
  | {
      type: "DECREASE_QUANTITY";
      payload: number;
    }
  | {
      type: "CLEAR_CART";
    };

const initialState: CartState = {
  items: [],
};

function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.payload.id
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
        items: [
          ...state.items,
          {
            product: action.payload,
            quantity: 1,
          },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.payload
        ),
      };

    case "INCREASE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload
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
            item.product.id === action.payload
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
    initialState,
    () => {
      const savedCart = localStorage.getItem("ofelia-cart");

      if (!savedCart) {
        return initialState;
      }

      try {
        return JSON.parse(savedCart);
      } catch {
        return initialState;
      }
    }
  );

  useEffect(() => {
    localStorage.setItem(
      "ofelia-cart",
      JSON.stringify(state)
    );
  }, [state]);

  const addToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: product,
    });
  };

  const removeFromCart = (productId: number) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: productId,
    });
  };

  const increaseQuantity = (productId: number) => {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: productId,
    });
  };

  const decreaseQuantity = (productId: number) => {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: productId,
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