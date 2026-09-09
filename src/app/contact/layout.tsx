import { metadataForSeoPage } from "@/lib/seo";

export async function generateMetadata() {
  return metadataForSeoPage("contact");
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
