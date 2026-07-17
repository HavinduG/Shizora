"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ContactWholesale({ data }: { data: any }) {
  const image =
    data?.contact_who_sale_image?.url ||
    "https://images.unsplash.com/photo-1542841791-c39f58b15d2e?q=80&w=2000";
  const title1 = data?.contact_who_sale_title_1 || "Corporate & Wholesale";
  const title2 =
    data?.contact_who_sale_title_2 ||
    "For professional inquiries regarding wholesale partnerships, corporate gifting, or press relations, please explore our dedicated portal. We carefully review all alignment opportunities that match our luminous ethos.";

  return (
    <section className="pb-24 lg:pb-32 bg-shizora-light">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <motion.div
          className="bg-[#FDFCFB] rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(138,121,99,0.08)] border border-shizora-gold/10 flex flex-col md:flex-row items-center group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left: Image Container */}
          <div className="w-full md:w-1/2 h-[300px] md:h-[450px] relative overflow-hidden">
            <motion.img
              src={image}
              alt="Corporate and Wholesale"
              className="w-full h-full object-cover"
              transition={{ duration: 1.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            />
            {/* Dark overlay for luxury feel */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
          </div>

          {/* Right: Content Container */}
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-[#FDFCFB] relative overflow-hidden">
            {/* Subtle glow effect on hover */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-shizora-gold/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <h2 className="font-heading text-3xl lg:text-4xl text-shizora-dark mb-6 relative z-10">
              {title1}
            </h2>

            <p className="text-shizora-dark/70 text-sm md:text-base font-light leading-relaxed mb-10 relative z-10">
              {title2}
            </p>

            <Link
              href="#"
              className="inline-flex items-center gap-2 text-shizora-gold font-bold text-sm lg:text-base tracking-wide group/link relative z-10 self-start"
            >
              BECOME A SHIZORA PARTNER
              <ArrowUpRight
                size={18}
                className="transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
