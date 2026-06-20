"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AboutSectionTwo({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const image =
    data?.about_2_image?.url ||
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000";
  const title1 = data?.about_2_title_1 || "HERITAGE & ORIGINS";
  const title2 = data?.about_2_title_2 || "The Foundation of Our Identity";

  const fullDescription =
    data?.about_2_description ||
    "<p>Our brand is built on a deep respect for tradition and uncompromising quality...</p>";

  return (
    <section className="pt-24 lg:pt-32 pb-12 lg:pb-16 bg-shizora-light relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        {/* We reverse the flex direction on large screens to put text on the right and image on the left, but here image is left and text is right in reference */}
        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-24">
          {/* Image Column - Left side */}
          <motion.div
            className="w-full lg:w-1/2 relative bg-[#fcfbf9] rounded-md overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-shizora-gold/10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              src={image}
              alt={title2}
              className="w-full h-full object-cover absolute inset-0"
            />
            {/* Invisible placeholder for natural height */}
            <img
              src={image}
              alt={title2}
              className="w-full h-auto invisible relative"
            />
          </motion.div>

          {/* Content Column - Right side */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center py-8 lg:py-16"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-shizora-gold font-bold mb-6 block">
              {title1}
            </span>

            <h2 className="font-heading text-4xl lg:text-5xl text-shizora-dark mb-8 leading-tight">
              {title2}
            </h2>

            <motion.div
              className={`prose prose-sm md:prose-base max-w-none text-shizora-dark/70 font-light leading-relaxed prose-p:mb-4 overflow-hidden relative ${!isExpanded ? "max-h-[140px]" : ""}`}
              animate={{ height: isExpanded ? "auto" : "140px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div dangerouslySetInnerHTML={{ __html: fullDescription }} />

              {/* Fade out effect when collapsed */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-shizora-light to-transparent" />
              )}
            </motion.div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-shizora-gold font-bold hover:text-shizora-dark transition-colors duration-300 group self-start border-b border-transparent hover:border-shizora-dark pb-1"
            >
              {isExpanded ? "Close Heritage" : "Explore Our Heritage"}
              <motion.span
                animate={{ rotate: isExpanded ? -180 : 0 }}
                transition={{ duration: 0.4 }}
                className="transform group-hover:translate-x-1 transition-transform"
              >
                &rarr;
              </motion.span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
