import { metadataForSeoPage } from "@/lib/seo";

export async function generateMetadata() {
  return await metadataForSeoPage("contact");
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
