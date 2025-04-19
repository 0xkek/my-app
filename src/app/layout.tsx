// src/app/layout.tsx (Moving Providers wrapper higher)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import the Wallet Providers component
import { Providers } from './providers';
// Import the SiteHeader component (path should be correct now)
import { SiteHeader } from './components/SiteHeader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smoothbrain XYZ Playground",
  description: "Exploring Solana ideas and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Providers now wraps Header, Main, and Footer */}
        <Providers>
          {/* SiteHeader is now INSIDE Providers */}
          <SiteHeader />

          {/* Main page content */}
          <main className="container mx-auto p-4 flex-grow">
            {children} {/* Children are also inside Providers */}
          </main>

          {/* Footer is also technically inside Providers now */}
          <footer className="w-full mt-auto py-4 text-center text-sm text-slate-500 border-t border-slate-200 bg-slate-50">
            © {currentYear} smoothbrain.xyz | Made with Next.js
          </footer>
        </Providers> {/* Closing Providers tag */}
      </body>
    </html>
  );
}