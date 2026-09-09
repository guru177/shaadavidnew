import { metadataForSeoPage } from "@/lib/seo";

export async function generateMetadata() {
  return metadataForSeoPage("checkout");
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
