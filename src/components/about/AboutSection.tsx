"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

export default function AboutSection({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const image =
    data?.about_image?.url ||
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2000";
  const title = data?.about_title_one || "The Purity of Dawn";

  // The backend sends HTML paragraphs. We want to extract them.
  // We'll use dangerouslySetInnerHTML for rendering, but control the height/clamping.
  const fullDescription =
    data?.about_description ||
    "<p>Every ingredient is harvested at the precise moment of first light...</p>";

  return (
    <section className="pt-12 lg:pt-16 pb-24 lg:pb-32 bg-shizora-light relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row-reverse items-stretch gap-0 bg-[#FDFCFB] rounded-3xl overflow-hidden shadow-[0_30px_80px_-15px_rgba(138,121,99,0.1)] border border-shizora-gold/10 transition-all duration-700 hover:shadow-[0_40px_100px_-15px_rgba(138,121,99,0.15)] group">
          {/* Image Column */}
          <motion.div
            className="w-full lg:w-[55%] relative bg-transparent overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Invisible placeholder image to dictate the natural minimum height of the column based on the image's aspect ratio */}
            <img
              src={image}
              alt={title}
              className="w-full h-auto invisible relative"
            />
          </motion.div>

          {/* Content Column */}
          <motion.div
            className="w-full lg:w-[45%] p-10 lg:p-20 flex flex-col justify-center relative bg-transparent z-10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -translate-y-1/4 translate-x-1/4">
              <svg
                width="200"
                height="200"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
              </svg>
            </div>

            <Leaf
              className="text-shizora-gold mb-8 w-6 h-6"
              strokeWidth={1.5}
            />

            <h2 className="font-heading text-4xl lg:text-5xl text-shizora-dark mb-8 leading-tight">
              {title}
            </h2>

            <motion.div
              className={`prose prose-sm md:prose-base max-w-none text-shizora-dark/70 font-light leading-relaxed prose-p:mb-4 overflow-hidden relative ${!isExpanded ? "max-h-[140px]" : ""}`}
              animate={{ height: isExpanded ? "auto" : "140px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div dangerouslySetInnerHTML={{ __html: fullDescription }} />

              {/* Fade out effect when collapsed */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
              )}
            </motion.div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-shizora-gold font-bold hover:text-shizora-dark transition-colors duration-300 group self-start border-b border-transparent hover:border-shizora-dark pb-1"
            >
              {isExpanded ? "Close Process" : "Discover Silk Sericin"}
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
