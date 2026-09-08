import { redirect } from "next/navigation";
import { getDefaultProduct } from "@/lib/products";

export default function ProductIndexPage() {
  const product = getDefaultProduct();
  if (product?.slug) redirect(`/product/${product.slug}`);
  redirect("/shop");
}
