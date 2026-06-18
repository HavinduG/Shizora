"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, User, ShoppingBag } from "lucide-react";

export default function Header({ data }: { data: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 34); // Adjust based on TopLayer height
  });

  const menuItems = data?.header_menu || [];

  return (
    <motion.header
      className={`w-full z-40 transition-all duration-300 ease-in-out ${
        isScrolled ? "fixed top-0 bg-shizora-dark/90 backdrop-blur-md py-4 shadow-md" : "absolute top-8.5 bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex-1">
          <motion.h1 
            className="text-shizora-gold font-heading text-2xl tracking-[0.3em] uppercase"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Shizora
          </motion.h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-8">
          {menuItems.map((item: any, index: number) => (
            <Link 
              key={index} 
              href={item.menu_url || "#"} 
              className="text-white/80 hover:text-shizora-gold text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 relative group"
            >
              {item.menu_text}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-shizora-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex-1 flex justify-end space-x-6 items-center">
          <button className="text-white/80 hover:text-shizora-gold transition-colors duration-300">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button className="text-white/80 hover:text-shizora-gold transition-colors duration-300">
            <User size={18} strokeWidth={1.5} />
          </button>
          <button className="text-white/80 hover:text-shizora-gold transition-colors duration-300 relative">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-shizora-gold text-shizora-dark text-[8px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
