"use client";

import React, { useState } from "react";
import BuyNowButton from "./BuyNowButton";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import { getStockQty, isProductInStock } from "@/lib/stock";
import { getPrimaryImage } from "@/lib/media";

type Props = {
  product: Product;
};

export default function ProductInfo({ product }: Props) {
  const descriptionParts = product.description.split("\n\n");
  const stockQty = getStockQty(product);
  const available = isProductInStock(product);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const thumb = getPrimaryImage(product.images);

  const clampedQty = Math.min(Math.max(1, qty), Math.max(1, stockQty || 1));

  return (
    <>
      <h1 className="text-xl md:text-[22px] font-medium text-[#0c1622] leading-relaxed mb-2 font-malayalam">
        {product.title}
      </h1>
      {product.variantLabel && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#395c80]">
          {product.variantLabel}
        </p>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-[#395c80] text-white px-3 py-1 rounded-full text-sm font-medium">
          {product.rating}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-500 font-malayalam">
          {product.ratingCount.toLocaleString("en-IN")} റേറ്റിംഗുകളും{" "}
          {product.reviewCount.toLocaleString("en-IN")} റിവ്യൂകളും
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-8 border-b border-gray-100 pb-8">
        <span className="text-[#395c80] text-[13px] font-bold tracking-wide uppercase font-malayalam">
          പ്രത്യേക വില
        </span>
        <div className="flex items-end gap-3">
          <span className="text-[34px] font-medium text-[#0c1622] leading-none">₹{product.price}</span>
          <span className="text-base text-gray-500 line-through mb-[2px]">₹{product.mrp}</span>
          <span className="text-[15px] font-bold text-[#395c80] mb-[2px] font-malayalam">
            {product.discountPercent}% കിഴിവ്
          </span>
        </div>
        {available ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-sm font-semibold ring-1 ring-inset ring-emerald-600/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In stock
            </span>
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-[#0c1622]">{stockQty}</span> available
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 text-sm font-semibold ring-1 ring-inset ring-rose-600/20 w-fit">
            Out of stock
          </span>
        )}

        {product.shippingEnabled && Number(product.shippingCharge) > 0 ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#395c80]/25 bg-[linear-gradient(135deg,#f0f5fa_0%,#e8eef5_100%)] px-4 py-3 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#29425e] text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l1.5 9h15L21 8M3 8h18M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" />
                <circle cx="8" cy="19" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="16" cy="19" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#395c80]">
                Shipping charge
              </p>
              <p className="mt-0.5 text-base font-bold text-[#0c1622] font-malayalam">
                ഷിപ്പിംഗ്{" "}
                <span className="text-[#29425e]">₹{Number(product.shippingCharge).toFixed(0)}</span>
                <span className="ml-1.5 text-sm font-medium text-gray-500">added at checkout</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                Free shipping
              </p>
              <p className="mt-0.5 text-base font-bold text-emerald-900 font-malayalam">
                സൗജന്യ ഷിപ്പിംഗ്
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="py-6">
        <h2 className="text-lg font-medium text-[#0c1622] mb-4 font-malayalam">ഉൽപ്പന്ന വിവരണം</h2>
        <div className="text-[#0c1622] leading-[1.8] text-[15px] font-malayalam space-y-4">
          {descriptionParts.map((part, idx) => (
            <p key={idx}>{part}</p>
          ))}
        </div>

        {available && (
          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Qty</span>
            <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white">
              <button
                type="button"
                className="px-3 py-2 text-lg font-semibold text-[#0c1622]"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold">{clampedQty}</span>
              <button
                type="button"
                className="px-3 py-2 text-lg font-semibold text-[#0c1622]"
                onClick={() => setQty((q) => Math.min(stockQty, q + 1))}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col xs:flex-row flex-wrap gap-2.5 md:gap-4">
          <BuyNowButton
            productId={product.id}
            productName={product.titleEn}
            price={product.price}
            image={thumb}
            disabled={!available}
            quantity={clampedQty}
            shippingEnabled={Boolean(product.shippingEnabled)}
            shippingCharge={Number(product.shippingCharge) || 0}
          />
          <button
            type="button"
            disabled={!available}
            onClick={() =>
              addToCart(
                {
                  id: product.id,
                  name: product.titleEn,
                  price: product.price,
                  image: thumb,
                  shippingEnabled: Boolean(product.shippingEnabled),
                  shippingCharge: Number(product.shippingCharge) || 0,
                },
                clampedQty
              )
            }
            className="inline-flex w-full xs:w-auto xs:flex-1 md:flex-none items-center justify-center rounded-full border-2 border-[#0c1622] px-6 py-3.5 sm:py-3 text-sm font-bold text-[#0c1622] transition hover:bg-[#0c1622] hover:text-white disabled:opacity-40"
          >
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}
