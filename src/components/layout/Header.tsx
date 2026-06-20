"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, User, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function Header({
  data,
  theme = "light",
}: {
  data?: any;
  theme?: "light" | "dark";
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { itemCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 34); // Adjust based on TopLayer height
  });

  const menuItems = data?.header_menu || [];

  const isDarkTheme = theme === "dark" && !isScrolled;

  return (
    <motion.header
      className={`w-full z-40 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "fixed top-0 bg-shizora-dark/90 backdrop-blur-md py-4 shadow-md"
          : "absolute top-8.5 bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-1">
          <motion.h1
            className={`font-heading text-2xl tracking-[0.3em] uppercase transition-colors duration-300 ${
              isDarkTheme ? "text-shizora-dark" : "text-shizora-gold"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Shizora
          </motion.h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-8">
          {menuItems.map((item: any, index: number) => {
            const href =
              item.menu_text?.toLowerCase() === "home"
                ? "/"
                : `/${item.menu_text?.toLowerCase()}`;
            const isActive =
              pathname === href || (href !== "/" && pathname?.startsWith(href));

            return (
              <Link
                key={index}
                href={href}
                className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 relative group ${
                  isActive
                    ? "text-shizora-gold"
                    : isDarkTheme
                      ? "text-shizora-dark/80 hover:text-shizora-gold"
                      : "text-white/80 hover:text-shizora-gold"
                }`}
              >
                {item.menu_text}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-shizora-gold transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* Icons */}
        <div
          className={`flex-1 flex justify-end space-x-6 items-center ${isDarkTheme ? "text-shizora-dark/90" : "text-white/80"}`}
        >
          <button className="hover:text-shizora-gold transition-colors duration-300">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button className="hover:text-shizora-gold transition-colors duration-300">
            <User size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="hover:text-shizora-gold transition-colors duration-300 relative group"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-shizora-gold text-shizora-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
