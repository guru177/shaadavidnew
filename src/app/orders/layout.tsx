import { metadataForSeoPage } from "@/lib/seo";

export async function generateMetadata() {
  return metadataForSeoPage("orders");
}

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
