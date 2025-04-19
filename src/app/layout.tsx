// src/app/layout.tsx

import Link from 'next/link'; // Import the Link component
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or your chosen font import
import "./globals.css";

const inter = Inter({ subsets: ["latin"] }); // Or your chosen font setup

export const metadata: Metadata = {
  title: "My Solana Playground", // You can change the default title here
  description: "Exploring Solana ideas", // And the description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Ensure font class is applied correctly */}
      <body className={inter.className}>

        {/* START: Simple Header Navigation */}
        <header className="bg-slate-700 text-white p-4 shadow-md"> {/* Basic Styling */}
          <nav className="container mx-auto flex gap-6"> {/* Adjust spacing with gap-x */}
            <Link href="/" className="hover:text-slate-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-slate-300">
              About
            </Link>
            {/* --- Blog link added here --- */}
            <Link href="/blog" className="hover:text-slate-300">
              Blog
            </Link>
            {/* -------------------------- */}
            {/* We can add a link to a 'Projects' page here later */}
          </nav>
        </header>
        {/* END: Simple Header Navigation */}

        {/* The main content of your current page renders here */}
        <main className="container mx-auto p-4"> {/* Padding/centering for page content */}
          {children}
        </main>

        {/* Optional Footer can go here */}
        {/* <footer className="text-center mt-8 p-4 text-gray-500 border-t">Site Footer</footer> */}

      </body>
    </html>
  );
}