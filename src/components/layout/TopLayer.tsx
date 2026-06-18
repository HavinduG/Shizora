"use client";

import { motion } from "framer-motion";

export default function TopLayer({ data }: { data: any[] }) {
  const texts = data || [];

  if (!texts.length) return null;

  // Duplicate texts to create a seamless infinite scroll effect
  const repeatedTexts = [...texts, ...texts, ...texts, ...texts];

  return (
    <div className="absolute top-0 left-0 w-full bg-[#1c1a17] text-shizora-gold py-2 overflow-hidden flex whitespace-nowrap border-b border-shizora-gold/20 z-50">
      <motion.div
        className="flex space-x-12 px-6 items-center uppercase tracking-widest text-[10px] font-medium"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {repeatedTexts.map((item, index) => (
          <div key={index} className="flex items-center space-x-12">
            <span>{item.top_layer_text}</span>
            <span className="text-shizora-gold/50 text-xs">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
