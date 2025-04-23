// src/app/layout.tsx (Stable State - Default Font/Size)
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use default Inter font
import "./globals.css";
import { Providers } from './providers';
import { SiteHeader } from './components/SiteHeader';

const inter = Inter({ subsets: ["latin"] }); // Default font setup

export const metadata: Metadata = { title: "Smoothbrain XYZ Playground", description: "Exploring Solana ideas and projects", };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen text-slate-900 dark:text-slate-200`}> {/* Default font and size */}
        <Providers>
          <SiteHeader />
          <main className="container mx-auto p-4 flex-grow">
            {children}
          </main>
          <footer className="w-full mt-auto py-4 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            © {currentYear} smoothbrain.xyz | Made with Next.js
          </footer>
        </Providers>
      </body>
    </html>
  );
}