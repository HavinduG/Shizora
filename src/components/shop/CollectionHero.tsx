"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CollectionHero({ bgImage }: { bgImage: string }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden mb-16 md:mb-24 pt-[80px]"
    >
      {/* Parallax Background Image */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={bgImage}
          alt="Botanical Collection"
          className="w-full h-full object-cover opacity-90"
        />
        {/* Soft luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-shizora-light/90 via-shizora-light/60 to-transparent" />
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[10px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-4 block"
          >
            CURATED PURITY
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark mb-6 leading-tight"
          >
            The Botanical <br />
            <span className="italic">Awakening</span> Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-sm md:text-base text-shizora-dark/70 tracking-wide font-light max-w-md leading-relaxed"
          >
            Formulated with rare organic extracts to illuminate and restore
            your natural vitality.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
