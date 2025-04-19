// src/app/layout.tsx

import Link from 'next/link'; // Import the Link component
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or your chosen font import
import "./globals.css";

// Ensure your font setup here matches your project (Inter, Geist Sans, etc.)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Solana Playground", // Customize your site title
  description: "Exploring Solana ideas and projects", // Customize your site description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ensure 'return' is followed immediately by '(' if JSX spans multiple lines
  return (
    <html lang="en">
      {/* Apply font class to body or html tag as needed */}
      <body className={inter.className}>

        {/* START: Header Navigation */}
        <header className="bg-slate-700 text-white p-4 shadow-md">
          <nav className="container mx-auto flex flex-wrap gap-x-6 gap-y-2"> {/* Added flex-wrap and gap-y for responsiveness */}
            <Link href="/" className="hover:text-slate-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-slate-300">
              About
            </Link>
            <Link href="/blog" className="hover:text-slate-300">
              Blog
            </Link>
            <Link href="/projects" className="hover:text-slate-300">
              Projects
            </Link>
          </nav>
        </header>
        {/* END: Header Navigation */}

        {/* Main page content renders here */}
        <main className="container mx-auto p-4">
          {children}
        </main>

        {/* Optional Footer */}
        {/* <footer className="text-center mt-8 p-4 text-gray-500 border-t">Site Footer Content</footer> */}

      </body>
    </html>
  ); // Ensure this closing parenthesis and potential semicolon are correct
}