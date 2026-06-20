import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { getHomePageData } from "@/lib/data";
import { CartProvider } from "@/lib/cart-context";
import CartSidebar from "@/components/shop/CartSidebar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shizora | Botanical Luxury, Delivered",
  description:
    "Redefining beauty with nature. Discover a new standard of luxury skincare.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch data for layout components (like Footer)
  const data = await getHomePageData();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-black text-white"
      >
        <CartProvider>
          {children}
          <Footer data={data.acf} />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
