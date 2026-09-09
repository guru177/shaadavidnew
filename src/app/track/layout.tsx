import { metadataForSeoPage } from "@/lib/seo";

export async function generateMetadata() {
  return metadataForSeoPage("track");
}

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
