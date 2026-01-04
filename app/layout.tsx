import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Thai, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
  weight: ["100", "300", "400", "500", "700", "900"],
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-kr",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "PROMPTY",
  description: "AI Social Content & Planning Studio",
};

import LanguageProvider from "./components/LanguageProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${notoSansThai.variable} ${notoSansJP.variable} ${notoSansKR.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
