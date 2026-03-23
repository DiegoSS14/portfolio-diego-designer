import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { AuthAccessButton } from "@/modules/auth/presentation/components/AuthAccessButton";
import { TopLeftHomeButton } from "@/modules/navigation/presentation/components/TopLeftHomeButton";
import { ThemeToggleButton } from "@/modules/portfolio/presentation/components/ThemeToggleButton";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";

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
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <div className="fixed top-5 left-5 z-50 md:top-8 md:left-8">
            <TopLeftHomeButton />
          </div>
          <div className="fixed top-5 right-5 z-50 flex items-center gap-3 md:top-8 md:right-8">
            <AuthAccessButton />
            <ThemeToggleButton />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
