"use client";

import { useCart } from "@/lib/cart-context";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";

export default function CollectionProductCard({
  product,
  index,
}: {
  product: any;
  index: number;
}) {
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const formatPrice = (prices: any) => {
    if (!prices) return "$0.00";
    const symbol = prices.currency_symbol || "د.إ";
    const price = parseInt(prices.price || "0") / 100;
    return `${price.toFixed(2)}${symbol}`;
  };

  const isNew = index === 0;
  const isBestseller = index === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group flex flex-col bg-[#fcfbf9] border border-shizora-gold/10 hover:border-shizora-gold/30 transition-all duration-500 rounded-sm relative"
    >
      {/* Image Container */}
      <Link
        href={`/collections/${product.id}`}
        className="relative w-full aspect-[4/5] overflow-hidden bg-white block"
      >
        {/* Badges */}
        {isNew && (
          <div className="absolute top-4 left-4 z-20 bg-shizora-dark/80 backdrop-blur-sm text-white text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm">
            NEW
          </div>
        )}
        {isBestseller && (
          <div className="absolute top-4 left-4 z-20 bg-shizora-gold/90 backdrop-blur-sm text-shizora-dark text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm font-medium">
            BESTSELLER
          </div>
        )}

        {/* Inner Gold Frame */}
        <div className="absolute inset-3 border border-black/5 group-hover:border-shizora-gold/40 z-10 transition-colors duration-700 pointer-events-none rounded-sm" />

        <img
          src={
            product.images[0]?.src ||
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/5 pointer-events-none mix-blend-multiply" />
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <div className="mb-2">
          <span className="text-[9px] uppercase tracking-[0.2em] text-shizora-gold font-medium mb-2 block">
            {product.categories?.[0]?.name || "Skincare"}
          </span>
          <Link href={`/collections/${product.id}`}>
            <h3
              className="font-heading text-xl text-shizora-dark group-hover:text-shizora-gold transition-colors duration-300 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: product.name }}
            />
          </Link>
        </div>

        <div
          className="text-xs text-shizora-dark/60 mb-6 line-clamp-2 font-light tracking-wide leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              product.short_description ||
              product.description ||
              "A transformative daily moisturizer infused with rare botanical extracts.",
          }}
        />

        <div className="mt-auto flex items-center justify-between">
          <p className="font-heading text-lg text-shizora-dark font-medium">
            {formatPrice(product.prices)}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="text-[10px] uppercase tracking-[0.2em] text-shizora-dark hover:text-shizora-gold font-medium transition-colors duration-300 border-b border-shizora-dark/20 hover:border-shizora-gold pb-1"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </motion.div>
  );
}
