// src/app/layout.tsx (Corrected Providers location AND text-lg)

import type { Metadata } from "next";
// Use the Outfit font import
import { Outfit } from "next/font/google";
// Import the global styles
import "./globals.css";
// Import the Wallet Providers component
import { Providers } from './providers';
// Import the SiteHeader component (using correct path for your structure)
import { SiteHeader } from './components/SiteHeader';

const outfit = Outfit({ subsets: ["latin"] });

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
      {/* Apply font, base text color, AND base text size */}
      <body className={`${outfit.className} flex flex-col min-h-screen text-slate-900 dark:text-slate-200 text-lg`}>

        {/* Providers MUST wrap components needing wallet context (Header, Children) */}
        <Providers> {/* <--- CORRECT location for Providers START */}

          <SiteHeader /> {/* Header is now INSIDE Providers */}

          <main className="container mx-auto p-4 flex-grow">
            {children} {/* Children are also inside Providers */}
          </main>

          <footer className="w-full mt-auto py-4 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
             {/* Footer is also inside Providers (this is fine) */}
            © {currentYear} smoothbrain.xyz | Made with Next.js
          </footer>

        </Providers> {/* <--- CORRECT location for Providers END */}

      </body>
    </html>
  );
}