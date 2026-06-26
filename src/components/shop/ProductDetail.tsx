"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Helper to format WooCommerce Store API price data securely
const formatPrice = (prices: any) => {
  if (!prices) return "";
  const symbol = prices.currency_symbol || "د.إ";
  const priceString = prices.price || "0";
  const minorUnit =
    prices.currency_minor_unit !== undefined ? prices.currency_minor_unit : 2;
  const value = parseInt(priceString, 10) / Math.pow(10, minorUnit);
  return `${value.toFixed(2)}${symbol}`;
};

const AccordionItem = ({
  title,
  content,
  isOpen,
  onClick,
}: {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-shizora-gold/20">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-heading text-sm uppercase tracking-widest text-shizora-dark group-hover:text-shizora-gold transition-colors duration-300">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-shizora-gold/60 group-hover:text-shizora-gold"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div
              className="pb-5 text-sm text-shizora-dark/70 leading-relaxed font-light prose prose-sm max-w-none prose-p:mb-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductDetail({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "description",
  );
  const [mainImage, setMainImage] = useState(product.images?.[0]?.src || "");

  // 3D Tilt Effect for Main Image
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const keyIngredients =
    product.attributes?.find(
      (attr: any) => attr.name.toLowerCase() === "key ingredients",
    )?.terms?.[0]?.name ||
    product.attributes?.find(
      (attr: any) => attr.name.toLowerCase() === "key ingredients",
    )?.options?.[0] ||
    "<p>Formulated with our proprietary blend of forest-foraged botanicals, rare golden algae extract, and molecular-weight hyaluronic acid for deep penetration and lasting hydration. 100% vegan, cruelty-free, and formulated without parabens, sulfates, or synthetic fragrances.</p>";

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => router.back()}
        className="w-fit mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-shizora-dark/60 hover:text-shizora-gold transition-colors duration-300 group font-medium"
      >
        <span className="transform transition-transform duration-300 group-hover:-translate-x-1">
          &larr;
        </span>{" "}
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Column - Images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col gap-6 relative lg:sticky lg:top-32"
        >
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1200,
            }}
            className="relative w-full aspect-[4/5] bg-white border border-shizora-gold/10 shadow-[0_20px_40px_-15px_rgba(203,168,99,0.15)] overflow-hidden rounded-sm group"
          >
            {/* Inner Gold Frame */}
            <div
              className="absolute inset-4 border border-shizora-gold/20 z-10 pointer-events-none rounded-sm transition-colors duration-700 group-hover:border-shizora-gold/40"
              style={{ transform: "translateZ(30px)" }}
            />

            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/5 pointer-events-none mix-blend-multiply" />
          </motion.div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img.src)}
                  className={`relative w-20 h-24 shrink-0 border transition-all duration-300 ${
                    mainImage === img.src
                      ? "border-shizora-gold/60 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column - Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col pt-4 lg:pt-12"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-4 block">
            Botanical Luxury
          </span>

          <h1
            className="font-heading text-3xl md:text-4xl lg:text-5xl text-shizora-dark font-medium leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: product.name }}
          />

          <p className="text-lg text-shizora-gold/90 font-medium tracking-wide mb-8">
            {formatPrice(product.prices)}
          </p>

          {product.short_description && (
            <div
              className="text-shizora-dark/70 font-light leading-relaxed mb-10 text-sm md:text-base prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          <button
            onClick={() => addToCart(product)}
            className="w-full py-4 bg-shizora-dark text-white text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-shizora-gold transition-all duration-500 relative overflow-hidden group mb-12 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(203,168,99,0.4)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              ADD TO BAG
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 w-0 bg-shizora-gold transition-all duration-500 ease-out group-hover:w-full z-0" />
          </button>

          {/* Accordions */}
          <div className="flex flex-col border-t border-shizora-gold/20">
            {product.description && (
              <AccordionItem
                title="The Ritual & Details"
                content={product.description}
                isOpen={activeAccordion === "description"}
                onClick={() => toggleAccordion("description")}
              />
            )}
            <AccordionItem
              title="Key Ingredients"
              content={
                typeof keyIngredients === "string" &&
                keyIngredients.startsWith("<")
                  ? keyIngredients
                  : `<p>${keyIngredients}</p>`
              }
              isOpen={activeAccordion === "ingredients"}
              onClick={() => toggleAccordion("ingredients")}
            />
            <AccordionItem
              title="Shipping & Returns"
              content="<p>Complimentary shipping on all orders over $50. We offer a 30-day return policy for unopened and unused items in their original packaging. Please contact our concierge for assistance with your return.</p>"
              isOpen={activeAccordion === "shipping"}
              onClick={() => toggleAccordion("shipping")}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
