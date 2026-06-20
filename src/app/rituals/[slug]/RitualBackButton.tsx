"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RitualBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-shizora-dark/60 hover:text-shizora-gold transition-colors duration-300 mb-12 group cursor-pointer"
    >
      <ArrowLeft
        size={14}
        className="transform group-hover:-translate-x-1 transition-transform"
      />
      Back
    </button>
  );
}
