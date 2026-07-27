"use client";

import { motion } from "framer-motion";

export default function TopLayer({
  data,
  theme = "light",
}: {
  data: any[];
  theme?: "light" | "dark";
}) {
  const texts = data || [];

  if (!texts.length) return null;

  // Duplicate texts to create a seamless infinite scroll effect
  const repeatedTexts = [...texts, ...texts, ...texts, ...texts];

  return (
    <div
      className={`absolute top-0 left-0 w-full py-2 overflow-hidden flex whitespace-nowrap border-b z-50 ${theme === "dark" ? "bg-shizora-light border-shizora-dark/10" : "bg-[#1c1a17] border-shizora-gold/20"}`}
    >
      <motion.div
        className="flex space-x-12 px-6 items-center uppercase tracking-widest text-[10px] font-medium"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 45,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {repeatedTexts.map((item, index) => (
          <div key={index} className="flex items-center space-x-12">
            <span
              className={
                theme === "dark" ? "text-shizora-dark" : "text-shizora-gold"
              }
            >
              {item.top_layer_text}
            </span>
            <span
              className={`text-xs ${theme === "dark" ? "text-shizora-dark/30" : "text-shizora-gold/50"}`}
            >
              ✦
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
