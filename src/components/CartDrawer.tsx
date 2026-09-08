"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CartCheckoutModal from "@/components/CartCheckoutModal";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!isCartOpen && !checkoutOpen) return null;

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-[2100] flex justify-end">
          <div className="absolute inset-0 bg-[#0c1622]/45" onClick={() => setIsCartOpen(false)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-[#0c1622]">Your cart</h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm text-gray-500">Cart is empty. Browse the shop to add books.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-xl border border-gray-100 p-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                      <Image src={item.image || "/product.webp"} alt="" fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#0c1622]">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="h-7 w-7 rounded border"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          className="h-7 w-7 rounded border"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-xs text-rose-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 p-5">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-[#0c1622]">₹{cartTotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutOpen(true);
                }}
                className="flex w-full items-center justify-center rounded-full bg-[#0c1622] px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
              >
                Checkout
              </button>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-2 w-full text-center text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <CartCheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
