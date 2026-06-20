"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ContactHero({ data }: { data: any }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const bgImage =
    data?.contact_background?.url ||
    "https://images.unsplash.com/photo-1615397323783-5c8ab3f27289?q=80&w=2000";
  const title1 = data?.contact_title_1 || "Concierge and Inquiries";
  const title2 =
    data?.contact_title_2 ||
    "Our dedicated Shizora Concierge is available to assist you with personalized recommendations, ritual guidance, and any questions regarding your luminous journey.";

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[60vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden pt-[80px]"
    >
      {/* Parallax Background Image */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={bgImage}
          alt={data?.contact_background?.alt || "Contact Shizora"}
          className="w-full h-full object-cover opacity-90"
        />
        {/* Soft luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-shizora-light/30 via-shizora-light/50 to-shizora-light" />
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-4xl mt-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-[10px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-6 block"
        >
          CONTACT US
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark mb-8 leading-[1.1] max-w-3xl"
        >
          {title1}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-sm md:text-base text-shizora-dark/70 tracking-wide font-light max-w-2xl leading-relaxed mx-auto"
        >
          {title2}
        </motion.p>
      </div>
    </section>
  );
}
