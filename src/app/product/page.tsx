import { redirect } from "next/navigation";
import { getDefaultProduct } from "@/lib/products";

export default async function ProductIndexPage() {
  const product = await getDefaultProduct();
  if (product?.slug) redirect(`/product/${product.slug}`);
  redirect("/shop");
}
