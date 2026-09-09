import type { Metadata } from "next";
import { Inter, Michroma, Anek_Malayalam, Noto_Serif_Malayalam } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import Preloader from "@/components/Preloader";
import FloatingMobileCTA from "@/components/FloatingMobileCTA";
import ChatBot from "@/components/ChatBot";
import Providers from "@/components/Providers";
import { getSettings, getSiteUrl } from "@/lib/settings";

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
  const settings = getSettings();
  const siteUrl = getSiteUrl(settings);
  const ogImage = settings.seo.ogImage?.startsWith("http")
    ? settings.seo.ogImage
    : `${siteUrl}${settings.seo.ogImage?.startsWith("/") ? settings.seo.ogImage : `/${settings.seo.ogImage || "logo.png"}`}`;

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
    openGraph: {
      title: settings.seo.ogTitle || settings.seo.title,
      description: settings.seo.ogDescription || settings.seo.description,
      siteName: settings.siteName,
      images: [{ url: ogImage }],
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
