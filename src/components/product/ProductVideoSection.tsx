import HomeVideoGallery from "@/components/home/HomeVideoGallery";
import type { Product } from "@/types/product";
import { normalizeProductVideos } from "@/lib/youtube";

/** Product-detail videos from this product only (admin product form). */
export default function ProductVideoSection({ product }: { product: Product }) {
  const videos = normalizeProductVideos(product.videos);
  if (!videos.length) return null;
  return (
    <>
      <div className="w-full h-px bg-gray-100 my-8 md:my-16" />
      <HomeVideoGallery videos={videos} variant="product" />
    </>
  );
}
