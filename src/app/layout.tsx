import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { getHomePageData } from "@/lib/data";
import { CartProvider } from "@/lib/cart-context";
import CartSidebar from "@/components/shop/CartSidebar";
import AuthProvider from "@/components/auth/AuthProvider";

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
  icons: {
    icon: "https://web.shizora.com/wp-content/uploads/2026/06/Gemini_Generated_Image_pf22xnpf22xnpf22.png",
  },
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
        <AuthProvider>
          <CartProvider>
            {children}
            <Footer data={data.acf} />
            <CartSidebar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
