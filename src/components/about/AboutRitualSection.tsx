"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutRitualSection({ data }: { data: any }) {
  const image =
    data?.ritual_image?.url ||
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000";
  const title1 = data?.ritual_title_1 || "Experience the Glow";
  const title2 = data?.ritual_title_2 || "DISCOVER OUR COLLECTION";

  return (
    <section className="pb-12 lg:pb-16 bg-shizora-light relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <Link href="/collections" className="block group">
          <motion.div
            className="relative w-full h-[500px] lg:h-[700px] rounded-3xl overflow-hidden shadow-[0_30px_100px_-15px_rgba(0,0,0,0.15)]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background Image with Slow Zoom on Hover */}
            <img
              src={image}
              alt={title1}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-1000 group-hover:opacity-90" />

            {/* Content Container */}
            <div className="absolute bottom-0 left-0 w-full p-10 lg:p-16 flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <h2 className="font-heading text-4xl lg:text-5xl text-white mb-6 leading-tight drop-shadow-lg">
                  {title1}
                </h2>

                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-shizora-gold font-bold">
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                      {title2}
                    </span>
                    <span className="block absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-white">
                      {title2}
                    </span>
                  </span>
                  <motion.span className="transform transition-transform duration-500 group-hover:translate-x-2 text-white">
                    &rarr;
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
