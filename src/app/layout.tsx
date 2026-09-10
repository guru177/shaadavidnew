import type { Metadata } from "next";
import { Inter, Michroma, Anek_Malayalam, Noto_Serif_Malayalam } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import Preloader from "@/components/Preloader";
import FloatingMobileCTA from "@/components/FloatingMobileCTA";
import ChatBot from "@/components/ChatBot";
import Providers from "@/components/Providers";
import { getSettings, getSiteUrl } from "@/lib/settings";
import { toAbsoluteImage } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
});
/** Premium modern Malayalam (ITF) — body, UI, buttons */
const anekMalayalam = Anek_Malayalam({
  subsets: ["malayalam", "latin"],
  variable: "--font-malayalam",
  weight: "variable",
  display: "swap",
});
/** Premium display Malayalam — section / page titles */
const notoSerifMalayalam = Noto_Serif_Malayalam({
  subsets: ["malayalam", "latin"],
  variable: "--font-malayalam-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = await getSiteUrl(settings);
  const ogImage = await toAbsoluteImage(settings.seo.ogImage, siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo.title || settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seo.description,
    keywords: settings.seo.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    authors: [{ name: settings.siteName }],
    icons: {
      icon: [{ url: "/logo.png", type: "image/png" }],
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    openGraph: {
      title: settings.seo.ogTitle || settings.seo.title,
      description: settings.seo.ogDescription || settings.seo.description,
      url: siteUrl,
      siteName: settings.siteName,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage.startsWith("https") ? ogImage : undefined,
          type: ogImage.includes(".png")
            ? "image/png"
            : ogImage.includes(".webp")
              ? "image/webp"
              : undefined,
          alt: settings.seo.ogTitle || settings.seo.title || settings.siteName,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.ogTitle || settings.seo.title,
      description: settings.seo.ogDescription || settings.seo.description,
      images: [ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${michroma.variable} ${anekMalayalam.variable} ${notoSerifMalayalam.variable} font-sans antialiased`}
      >
        <Preloader />
        <Providers>
          <SmoothScrolling>{children}</SmoothScrolling>
          <FloatingMobileCTA />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
