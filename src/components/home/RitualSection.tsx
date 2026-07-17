"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RitualSection({
  data,
  rituals,
}: {
  data: any;
  rituals: any[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const title1 = data.guide_title_1 || "GUIDED RITUALS";
  const title2 = data.guide_title_2 || "Elevate Japanese Skincare Ritual";
  const description =
    data.guide_title_description ||
    "Transform your daily routine into a moment of mindful luxury with our guided skincare rituals";

  // Safely extract rituals
  const mainRitual = rituals[0];
  const subRituals = rituals.slice(1, 3);

  // Format the title to make "Japanese Skincare Ritual" gold and italic
  const formatTitle = (title: string) => {
    if (!title) return null;
    const parts = title.split(/(Japanese Skincare Ritual)/i);
    return parts.map((part: string, index: number) =>
      part.toLowerCase() === "japanese skincare ritual" ? (
        <span key={index} className="italic text-shizora-gold font-light">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative bg-[#e8ded0] py-16 lg:py-20 px-6 lg:px-12 w-full overflow-hidden">
      <div className="container mx-auto max-w-[1400px]" ref={containerRef}>
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-4 block">
                {title1}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark mb-4 leading-[1.1] tracking-wide"
            >
              {formatTitle(title2)}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xs md:text-sm text-shizora-dark/70 font-sans tracking-wide leading-relaxed"
            >
              {description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hidden lg:flex items-center gap-6">
              <span className="text-shizora-dark/60 text-[10px] uppercase tracking-[0.2em] font-bold">
                EXPLORE ALL RITUALS
              </span>
              <Link
                href="/rituals"
                className="w-12 h-12 rounded-full border border-shizora-gold/30 flex items-center justify-center text-shizora-dark hover:bg-shizora-dark hover:text-white hover:border-shizora-dark transition-all duration-500 group cursor-pointer"
              >
                <ArrowRight
                  size={18}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bento Box Grid */}
        {mainRitual && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Main Featured Ritual (Left) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:h-[450px]"
            >
              <Link
                href={`/rituals/${mainRitual.slug}`}
                className="relative block w-full h-full overflow-hidden group rounded-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_-10px_rgba(203,168,99,0.2)] transition-all duration-700"
              >
                {/* Image with smooth zoom on hover */}
                <img
                  src={
                    mainRitual.acf?.blog_image?.url ||
                    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000"
                  }
                  alt={mainRitual.title?.rendered}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Inner Gold Frame (Luxury Finishing) */}
                <div className="absolute inset-4 border border-white/20 group-hover:border-shizora-gold/50 z-20 transition-colors duration-700 pointer-events-none rounded-sm" />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-shizora-dark/95 via-shizora-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 z-10" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-10 md:p-14 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out z-30">
                  <span className="text-[9px] text-white/70 uppercase tracking-[0.4em] mb-5 block font-medium">
                    AWAKEN
                  </span>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white mb-5 drop-shadow-2xl tracking-wide">
                    {mainRitual.title?.rendered}
                  </h3>
                  <p className="text-sm md:text-base text-white/80 line-clamp-2 max-w-md mb-8 font-light tracking-wide">
                    {mainRitual.acf?.blog_short_description}
                  </p>
                  <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white hover:text-shizora-gold transition-colors duration-500 font-medium relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-shizora-gold group-hover:after:w-full after:transition-all after:duration-500">
                    DISCOVER{" "}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-3 transition-transform duration-500"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Sub Rituals (Right Column) */}
            <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-6 h-full">
              {subRituals.map((ritual, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex-1 min-h-[180px] lg:min-h-0"
                >
                  <Link
                    href={`/rituals/${ritual.slug}`}
                    className="relative block w-full h-full overflow-hidden group rounded-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_-10px_rgba(203,168,99,0.2)] transition-all duration-700"
                  >
                    <img
                      src={
                        ritual.acf?.blog_image?.url ||
                        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000"
                      }
                      alt={ritual.title?.rendered}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Inner Gold Frame (Luxury Finishing) */}
                    <div className="absolute inset-4 border border-white/20 group-hover:border-shizora-gold/50 z-20 transition-colors duration-700 pointer-events-none rounded-sm" />

                    <div className="absolute inset-0 bg-gradient-to-t from-shizora-dark/95 via-shizora-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 z-10" />

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-out z-30">
                      <h3 className="text-xl md:text-2xl font-heading text-white mb-5 drop-shadow-2xl tracking-wide">
                        {ritual.acf?.blog_title || `Ritual ${index + 2}`}
                      </h3>

                      {/* "DISCOVER" Link */}
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/90 group-hover:text-shizora-gold transition-colors font-bold mt-2">
                        DISCOVER
                        <ArrowRight
                          size={12}
                          className="transform group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
