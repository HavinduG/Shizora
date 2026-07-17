"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";

export default function LockedPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Admin@12345") {
      // Set access cookie and reload to let middleware clear the block
      document.cookie = "site_unlocked=true; path=/; max-age=86400";
      window.location.href = "/";
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <main className="min-h-screen bg-shizora-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-shizora-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-shizora-light rounded-3xl p-10 md:p-12 shadow-2xl text-center relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-shizora-gold/10 flex items-center justify-center text-shizora-gold">
            <LockKeyhole size={28} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl text-shizora-dark mb-3">
          Private Access
        </h1>
        <p className="text-shizora-dark/60 text-sm mb-10 font-light leading-relaxed">
          The Shizora experience is currently locked for public visibility.
          Please enter your password to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter Password"
              className={`w-full bg-[#F5F4F0] border ${
                error ? "border-red-400" : "border-transparent"
              } focus:border-shizora-gold/30 rounded-lg px-5 py-4 text-center text-sm text-shizora-dark placeholder:text-shizora-dark/40 outline-none transition-all duration-300`}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-3 font-medium"
              >
                Incorrect password. Please try again.
              </motion.p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#0A1612] text-white px-8 py-4 rounded-lg text-sm font-medium tracking-widest uppercase hover:bg-shizora-gold transition-colors duration-300"
          >
            Enter
          </button>
        </form>
      </motion.div>
    </main>
  );
}
