import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { ThemeInitializerScript } from "@/shared/theme/ThemeInitializerScript";
import "./globals.css";

const sansFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const displaySansFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diego Sousa | Portfolio de Design",
  description:
    "Portfolio profissional com projetos de design, branding e produto digital de Diego Sousa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sansFont.variable} ${displaySansFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeInitializerScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
