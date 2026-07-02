"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ComingSoonClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-shizora-dark text-white">
      {/* Background Image with Parallax & Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1615397323783-5c8ab3f27289?q=80&w=2000"
          alt="Shizora Botanical"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-shizora-dark/80 via-shizora-dark/60 to-shizora-dark/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-3xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl tracking-widest text-shizora-gold">
            SHIZORA
          </h1>
        </motion.div>

        {/* Main Typography */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[10px] uppercase tracking-[0.4em] text-shizora-gold font-medium mb-6 block"
        >
          Redefining beauty with nature
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-heading text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1]"
        >
          Something Beautiful <br />
          <span className="italic font-light">is Blooming</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/70 font-light tracking-wide max-w-lg mb-12 text-sm md:text-base leading-relaxed"
        >
          Our digital boutique is currently undergoing a luxurious
          transformation. Join our exclusive waitlist to be the first to
          experience the new standard of botanical skincare.
        </motion.p>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full max-w-md"
        >
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border border-shizora-gold/30 bg-shizora-gold/10 rounded-lg text-shizora-gold text-sm tracking-wide"
            >
              Thank you. You have been added to our exclusive waitlist.
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/5 border border-white/10 focus:border-shizora-gold/50 rounded-full px-6 py-4 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 pr-32"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="absolute right-2 top-2 bottom-2 bg-shizora-gold text-shizora-dark px-6 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300 flex items-center gap-2"
              >
                {status === "loading" ? "..." : "Join"}
              </button>
            </form>
          )}
        </motion.div>

        {/* Footer / Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            &copy; {new Date().getFullYear()} Shizora. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
