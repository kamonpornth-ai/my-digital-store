"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image_url?: string;
};

type CartItem = Product & { quantity: number };
type CartState = { items: CartItem[]; totalItems: number; };

type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }; // 🌟 เพิ่มคำสั่งล้างตะกร้า

interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void; // 🌟 ส่งออกคำสั่ง
}

const initialState: CartState = { items: [], totalItems: 0 };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) => item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item),
          totalItems: state.totalItems + 1,
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }], totalItems: state.totalItems + 1 };
    }
    case "REMOVE_FROM_CART": {
      const itemToRemove = state.items.find((item) => item.id === action.payload);
      return { ...state, items: state.items.filter((item) => item.id !== action.payload), totalItems: state.totalItems - (itemToRemove?.quantity || 0) };
    }
    case "UPDATE_QUANTITY": {
      const itemToUpdate = state.items.find((item) => item.id === action.payload.id);
      if (!itemToUpdate) return state;
      const diff = action.payload.quantity - itemToUpdate.quantity;
      return { ...state, items: state.items.map((item) => item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item), totalItems: state.totalItems + diff };
    }
    case "CLEAR_CART": {
      return initialState; // 🌟 ล้างตะกร้าให้เกลี้ยง
    }
    default: return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const addToCart = (product: Product) => dispatch({ type: "ADD_TO_CART", payload: product });
  const removeFromCart = (id: number) => dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const updateQuantity = (id: number, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("Error using CartContext");
  return context;
};