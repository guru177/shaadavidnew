"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ConfirmedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  shippingEnabled?: boolean;
  shippingCharge?: number;
}

interface CartContextType {
  cart: ConfirmedProduct[];
  addToCart: (product: Omit<ConfirmedProduct, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartShipping: number;
  cartGrandTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function shippingForCart(cart: ConfirmedProduct[]) {
  const seen = new Set<string>();
  let total = 0;
  for (const item of cart) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    if (item.shippingEnabled) {
      total += Math.max(0, Number(item.shippingCharge) || 0);
    }
  }
  return Math.round(total * 100) / 100;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ConfirmedProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedCart = localStorage.getItem("ecom_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        console.error("Failed to parse cart data");
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ecom_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product: Omit<ConfirmedProduct, "quantity">, quantity = 1) => {
    const addQty = Math.max(1, quantity);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                ...product,
                quantity: item.quantity + addQty,
              }
            : item
        );
      }
      return [...prev, { ...product, quantity: addQty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartShipping = shippingForCart(cart);
  const cartGrandTotal = cartTotal + cartShipping;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartShipping,
        cartGrandTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
