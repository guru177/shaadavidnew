import type { Metadata } from "next";
import { Inter, Michroma, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const michroma = Michroma({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-michroma"
});
const notoSansMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-malayalam"
});

export const metadata: Metadata = {
  title: "Shaa David | The Complete Guide to English",
  description: "Learn spoken English fluently through Malayalam without grammatical fears. Shaa David's expert techniques will make you confident in English.",
  keywords: ["Shaa David", "Spoken English Malayalam", "Learn English Malayalam"],
  authors: [{ name: "Shaa David" }],


};

import SmoothScrolling from "@/components/SmoothScrolling";
import Preloader from "@/components/Preloader";
import FloatingMobileCTA from "@/components/FloatingMobileCTA";
import ChatBot from "@/components/ChatBot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${michroma.variable} ${notoSansMalayalam.variable} font-sans antialiased max-[1020px]:pb-[88px]`}>
        <Preloader />
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
        <FloatingMobileCTA />
        <ChatBot />
      </body>
    </html>
  );
}
