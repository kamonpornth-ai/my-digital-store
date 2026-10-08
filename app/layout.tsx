import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { CartProvider } from "@/context/CartContext"; // นำเข้ากล่องสมองตะกร้า

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Store",
  description: "Cross-Platform E-Commerce",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#1e3a8a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* เอา CartProvider มาครอบแอปทั้งหมด */}
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pb-24 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}