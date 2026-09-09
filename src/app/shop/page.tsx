import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getActiveProducts, getStockQty } from "@/lib/products";
import { getPrimaryImage } from "@/lib/media";
import { metadataForSeoPage } from "@/lib/seo";

export async function generateMetadata() {
  return await metadataForSeoPage("shop");
}

export default async function ShopPage() {
  const products = await getActiveProducts();

  // Single product store: Products nav goes straight to the detail page
  if (products.length === 1 && products[0].slug) {
    redirect(`/product/${products[0].slug}`);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F9FB] pt-[120px] md:pt-[140px] pb-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#395c80]">Shop</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c1622] md:text-4xl">
            Learning companions
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            English through Malayalam — books that build everyday speaking confidence.
          </p>

          {products.length === 0 ? (
            <p className="mt-16 text-center text-gray-500">No products available yet.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const stock = getStockQty(product);
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group overflow-hidden rounded-2xl border border-[#29425e]/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-[4/5] bg-[#0c1622]/5">
                      {(() => {
                        const thumb = getPrimaryImage(product.images, "");
                        return thumb ? (
                          <Image
                            src={thumb}
                            alt={product.titleEn}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width:768px) 100vw, 33vw"
                          />
                        ) : null;
                      })()}
                    </div>
                    <div className="p-5">
                      {product.variantLabel && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#395c80]">
                          {product.variantLabel}
                        </p>
                      )}
                      <h2 className="mt-1 text-lg font-semibold text-[#0c1622]">{product.titleEn}</h2>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.shortDescription}</p>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-xl font-semibold text-[#0c1622]">₹{Number(product.price).toFixed(0)}</p>
                          {product.mrp > product.price && (
                            <p className="text-xs text-gray-400 line-through">₹{Number(product.mrp).toFixed(0)}</p>
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold ${stock > 0 ? "text-emerald-700" : "text-rose-600"}`}
                        >
                          {stock > 0 ? "In stock" : "Sold out"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
