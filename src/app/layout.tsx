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
  title: "TestiQA - Testing the Software for your Business",
  description: "TestiQA software testing services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${michroma.variable} ${notoSansMalayalam.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
