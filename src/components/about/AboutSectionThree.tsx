"use client";

import { motion, Variants } from "framer-motion";
import { Leaf, ShieldCheck, Gem } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

interface AboutPoint {
  about_3_title_1: string;
  about_3_description: string;
}

interface AboutSectionThreeProps {
  data?: {
    about_3_title_1?: string;
    about_3_points?: AboutPoint[];
  };
}

export default function AboutSectionThree({ data }: AboutSectionThreeProps) {
  const sectionTitle = data?.about_3_title_1 || "Our Philosophy";
  const points = data?.about_3_points || [
    {
      about_3_title_1: "Nature First",
      about_3_description:
        "We source only the finest botanical ingredients, honoring their natural potency and ensuring ethical, sustainable harvesting practices.",
    },
    {
      about_3_title_1: "Pure & Safe",
      about_3_description:
        "Formulated without compromise. Free from harmful additives, our products deliver efficacious results with profound respect for your skin's health.",
    },
    {
      about_3_title_1: "Timeless Elegance",
      about_3_description:
        "Bridging ancient botanical wisdom with modern skin science to offer luxurious, enduring health and vitality for every generation.",
    },
  ];

  // We use specific icons for the 3 points
  const icons = [Leaf, ShieldCheck, Gem];

  return (
    <section className="pt-16 pb-32 bg-shizora-light relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        {/* Title */}
        <motion.div
          className="text-center mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-4xl lg:text-5xl text-shizora-dark mb-6">
            {sectionTitle}
          </h2>
          <div className="w-12 h-[1px] bg-shizora-gold mx-auto"></div>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {points.map((point: AboutPoint, index: number) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Box */}
                <div className="w-20 h-20 bg-[#FDFCFB] rounded-2xl shadow-[0_15px_35px_-10px_rgba(138,121,99,0.12)] flex items-center justify-center mb-8 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_25px_50px_-12px_rgba(138,121,99,0.18)] border border-shizora-gold/10">
                  <Icon
                    className="w-8 h-8 text-shizora-gold transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl text-shizora-dark mb-4 font-medium">
                  {point.about_3_title_1}
                </h3>
                <p className="text-shizora-dark/70 text-sm md:text-base font-light leading-relaxed max-w-[300px]">
                  {point.about_3_description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
