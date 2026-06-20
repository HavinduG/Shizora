"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function RitualsList({ rituals }: { rituals: any[] }) {
  if (!rituals || rituals.length === 0) return null;

  // The first ritual is featured
  const featured = rituals[0];
  // The rest are the latest entries
  const latest = rituals.slice(1);

  // Helper to extract data
  const getTitle = (item: any) =>
    item?.acf?.blog_title || item?.title?.rendered || "Ritual Title";
  const getShortDesc = (item: any) => item?.acf?.blog_short_description || "";
  const getImage = (item: any) =>
    item?.acf?.blog_image?.url ||
    "https://images.unsplash.com/photo-1615397323783-5c8ab3f27289?q=80&w=2000";

  return (
    <section className="pt-12 md:pt-24 pb-12 bg-shizora-light">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        {/* FEATURED RITUAL */}
        <Link href={`/rituals/${featured.slug}`} className="block group mb-32">
          <motion.div
            className="relative w-full h-[500px] lg:h-[650px] rounded-3xl overflow-hidden shadow-[0_30px_80px_-15px_rgba(138,121,99,0.1)] border border-shizora-gold/10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background Image */}
            <img
              src={getImage(featured)}
              alt={getTitle(featured)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />

            {/* Content Box */}
            <div className="absolute top-1/2 -translate-y-1/2 left-6 lg:left-16 w-[90%] max-w-[550px] bg-[#FDFCFB]/95 backdrop-blur-md p-10 lg:p-14 rounded-2xl shadow-2xl transition-transform duration-700 group-hover:translate-x-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-shizora-gold font-bold mb-4 block">
                FEATURED RITUAL
              </span>
              <h2 className="text-3xl lg:text-5xl font-heading mb-6 text-shizora-dark leading-tight">
                {getTitle(featured)}
              </h2>
              <p className="text-shizora-dark/70 text-sm md:text-base mb-8 line-clamp-3 leading-relaxed font-light">
                {getShortDesc(featured)}
              </p>
              <span className="text-xs uppercase tracking-[0.1em] font-bold text-shizora-dark flex items-center gap-2 group-hover:text-shizora-gold transition-colors">
                Read the Feature{" "}
                <motion.span className="transform transition-transform duration-500 group-hover:translate-x-1">
                  &rarr;
                </motion.span>
              </span>
            </div>
          </motion.div>
        </Link>

        {/* DIVIDER */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-[1px] bg-shizora-gold/30 flex-1 max-w-[150px]"></div>
          <span className="mx-6 text-[10px] uppercase tracking-[0.3em] text-shizora-dark/50 font-bold">
            LATEST ENTRIES
          </span>
          <div className="h-[1px] bg-shizora-gold/30 flex-1 max-w-[150px]"></div>
        </div>

        {/* LATEST ENTRIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {latest.map((item, idx) => (
            <Link
              href={`/rituals/${item.slug}`}
              key={item.id}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col h-full"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 relative shadow-[0_20px_50px_-10px_rgba(138,121,99,0.1)]">
                  <img
                    src={getImage(item)}
                    alt={getTitle(item)}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>

                {/* Fake tags for aesthetic similar to the design */}
                <span className="text-[10px] uppercase tracking-[0.2em] text-shizora-gold font-bold mb-3 block">
                  {idx % 2 === 0 ? "Wellness" : "Heritage"}
                </span>

                <h3 className="text-2xl font-heading text-shizora-dark mb-3 group-hover:text-shizora-gold transition-colors leading-snug">
                  {getTitle(item)}
                </h3>

                <p className="text-shizora-dark/70 text-sm line-clamp-2 leading-relaxed font-light">
                  {getShortDesc(item)}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
