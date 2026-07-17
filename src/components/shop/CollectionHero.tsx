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
        <div className="absolute inset-0 bg-gradient-to-b from-shizora-light/40 via-shizora-light/50 to-shizora-light" />
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10 flex flex-col items-center text-center mt-12">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-shizora-gold font-medium mb-6 block"
          >
            CURATED JAPANESE SKINCARE
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark mb-8 leading-[1.1] max-w-3xl mx-auto"
          >
            Discover the <br />
            <span className="italic">Shizora </span> Japanese Skincare
            Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-sm md:text-base text-shizora-dark/70 tracking-wide font-light max-w-2xl mx-auto leading-relaxed"
          >
            Explore premium Japanese skincare for facial and intimate care,
            featuring silk sericin moisturisers, lightweight hydration and
            thoughtfully formulated everyday essentials for women in the UAE.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
