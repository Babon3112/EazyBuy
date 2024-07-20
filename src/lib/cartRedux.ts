"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}

interface CartState {
  products: Product[];
  quantity: number;
  total: number;
}

const initialState: CartState = {
  products: [],
  quantity: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingProductIndex = state.products.findIndex(
        (product) =>
          product.productId === action.payload.productId &&
          product.color === action.payload.color &&
          product.size === action.payload.size
      );

      if (existingProductIndex !== -1) {
        state.products[existingProductIndex].quantity +=
          action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
      state.quantity += action.payload.quantity;
      state.total += action.payload.price * action.payload.quantity;
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; color: string; size: string }>
    ) => {
      const productIndex = state.products.findIndex(
        (product) =>
          product.productId === action.payload.productId &&
          product.color === action.payload.color &&
          product.size === action.payload.size
      );

      if (productIndex !== -1) {
        const product = state.products[productIndex];
        state.quantity -= product.quantity;
        state.total -= product.price * product.quantity;
        state.products.splice(productIndex, 1);
      }
    },
    incrementQuantity: (
      state,
      action: PayloadAction<{ productId: string; color: string; size: string }>
    ) => {
      const productIndex = state.products.findIndex(
        (product) =>
          product.productId === action.payload.productId &&
          product.color === action.payload.color &&
          product.size === action.payload.size
      );

      if (productIndex !== -1) {
        state.products[productIndex].quantity += 1;
        state.total += state.products[productIndex].price;
        state.quantity += 1;
      }
    },
    decrementQuantity: (
      state,
      action: PayloadAction<{ productId: string; color: string; size: string }>
    ) => {
      const productIndex = state.products.findIndex(
        (product) =>
          product.productId === action.payload.productId &&
          product.color === action.payload.color &&
          product.size === action.payload.size
      );

      if (productIndex !== -1) {
        if (state.products[productIndex].quantity > 1) {
          state.products[productIndex].quantity -= 1;
          state.total -= state.products[productIndex].price;
          state.quantity -= 1;
        }
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
