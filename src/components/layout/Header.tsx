"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { User, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useSession, signOut } from "next-auth/react";

export default function Header({
  data,
  theme = "light",
  forceSolid = false,
}: {
  data?: any;
  theme?: "light" | "dark";
  forceSolid?: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { itemCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const { data: session } = useSession();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 34); // Adjust based on TopLayer height
  });

  const menuItems = data?.header_menu || [];

  const isDarkTheme = theme === "dark" && !isScrolled && !forceSolid;

  return (
    <motion.header
      className={`w-full z-40 transition-all duration-300 ease-in-out ${
        isScrolled || forceSolid
          ? "fixed top-0 bg-shizora-dark/90 backdrop-blur-md py-4 shadow-md"
          : "absolute top-8.5 bg-transparent py-6"
      }`}
      initial={forceSolid ? { y: 0 } : { y: -100 }}
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
            let href = "/";
            const text = item.menu_text?.toLowerCase();
            if (text === "home") href = "/";
            else if (text === "shop") href = "/collections";
            else if (text === "our story") href = "/about";
            else href = `/${text}`;

            const isActive =
              pathname === href || (href !== "/" && pathname?.startsWith(href));

            return (
              <Link
                key={index}
                href={href}
                className={`text-[12px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 relative group ${
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

        {/* Icons & Mobile Toggle */}
        <div
          className={`flex-1 flex justify-end space-x-5 md:space-x-6 items-center ${isDarkTheme ? "text-shizora-dark/90" : "text-white/80"}`}
        >
          {session ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-[10px] uppercase tracking-widest truncate max-w-[100px] hover:text-shizora-gold transition-colors duration-300"
              >
                {(session.user as any)?.firstName ||
                  session.user?.name ||
                  "Account"}
              </Link>
              <button
                onClick={() => signOut()}
                className="hover:text-shizora-gold transition-colors duration-300"
                title="Sign Out"
              >
                <LogOut size={16} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:text-shizora-gold transition-colors duration-300 hidden md:block"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
          )}
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden hover:text-shizora-gold transition-colors duration-300 ml-2 relative z-50"
          >
            {isMobileMenuOpen ? (
              <X size={22} strokeWidth={1.5} className="text-shizora-dark" />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Blur Overlay (Covers the rest of the screen) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed inset-0 top-[100px] z-30 bg-black/40 backdrop-blur-md md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* The Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 w-full bg-[#FDFCFB]/95 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-t border-shizora-gold/10 overflow-hidden md:hidden z-40 rounded-b-3xl"
            >
              {/* Soft gold inner glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-shizora-gold/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Mobile Menu Links */}
              <nav className="flex flex-col py-10 px-10 gap-8 relative z-10">
                {menuItems.map((item: any, index: number) => {
                  let href = "/";
                  const text = item.menu_text?.toLowerCase();
                  if (text === "home") href = "/";
                  else if (text === "shop") href = "/collections";
                  else if (text === "our story") href = "/about";
                  else href = `/${text}`;

                  const isActive =
                    pathname === href ||
                    (href !== "/" && pathname?.startsWith(href));

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-base uppercase tracking-[0.25em] transition-all duration-300 relative group font-medium block ${
                          isActive
                            ? "text-shizora-gold translate-x-2"
                            : "text-shizora-dark/80 hover:text-shizora-gold hover:translate-x-2"
                        }`}
                      >
                        {item.menu_text}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-6 pt-8 border-t border-shizora-gold/10 flex flex-col gap-6"
                >
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs uppercase tracking-[0.25em] text-shizora-dark/50 hover:text-shizora-gold transition-colors duration-300"
                      >
                        Account (
                        {(session.user as any)?.firstName || session.user?.name}
                        )
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          signOut();
                        }}
                        className="text-xs uppercase tracking-[0.25em] text-left text-shizora-dark/50 hover:text-shizora-gold transition-colors duration-300"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs uppercase tracking-[0.25em] text-shizora-dark/50 hover:text-shizora-gold transition-colors duration-300"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs uppercase tracking-[0.25em] text-shizora-dark/50 hover:text-shizora-gold transition-colors duration-300"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                  <Link
                    href="#"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs uppercase tracking-[0.25em] text-shizora-dark/50 hover:text-shizora-gold transition-colors duration-300"
                  >
                    Support
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
