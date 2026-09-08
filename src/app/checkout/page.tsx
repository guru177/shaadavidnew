"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

/** Legacy /checkout → open cart drawer flow instead of a separate page. */
export default function CheckoutPage() {
  const router = useRouter();
  const { setIsCartOpen, cartCount } = useCart();

  useEffect(() => {
    if (cartCount > 0) setIsCartOpen(true);
    router.replace(cartCount > 0 ? "/shop" : "/shop");
  }, [cartCount, router, setIsCartOpen]);

  return (
    <main className="flex min-h-screen items-center justify-center text-sm text-gray-500">
      Opening checkout…
    </main>
  );
}
