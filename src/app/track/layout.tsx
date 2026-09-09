import { metadataForSeoPage } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata() {
  return await metadataForSeoPage("track");
}

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
