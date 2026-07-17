"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FaqsClient({ htmlContent }: { htmlContent: string }) {
  const router = useRouter();
  // Parse the HTML content into structured data
  const [data, setData] = useState<{
    title: string;
    intro: string;
    categories: {
      name: string;
      items: { q: string; a: string }[];
    }[];
  } | null>(null);

  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!htmlContent) return;

    try {
      // Create a dummy DOM element to parse HTML safely in the browser
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      let title = "Frequently Asked Questions";
      let intro = "";

      const h1 = doc.querySelector("h1");
      if (h1) title = h1.textContent || title;

      // Intro is typically the p tags before the first h2
      let currentElement = h1
        ? h1.nextElementSibling
        : doc.body.firstElementChild;
      while (currentElement && currentElement.tagName.toLowerCase() !== "h2") {
        if (currentElement.tagName.toLowerCase() === "p") {
          intro += currentElement.outerHTML;
        }
        currentElement = currentElement.nextElementSibling;
      }

      const categories: any[] = [];
      let currentCategory: any = null;
      let currentItem: any = null;

      const elements = Array.from(doc.body.children);

      for (const el of elements) {
        const tag = el.tagName.toLowerCase();

        if (tag === "h2") {
          currentCategory = { name: el.textContent, items: [] };
          categories.push(currentCategory);
          currentItem = null;
        } else if (tag === "h3" && currentCategory) {
          currentItem = { q: el.textContent, a: "" };
          currentCategory.items.push(currentItem);
        } else if (
          currentItem &&
          (tag === "p" || tag === "ul" || tag === "ol")
        ) {
          currentItem.a += el.outerHTML;
        }
      }

      setData({ title, intro, categories });
    } catch (e) {
      console.error("Error parsing FAQs HTML", e);
    }
  }, [htmlContent]);

  const toggleItem = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!data)
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto px-6 lg:px-12 max-w-[1000px]">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-shizora-dark/60 hover:text-shizora-gold transition-colors duration-300 mb-8"
      >
        <ArrowLeft
          size={14}
          className="transform group-hover:-translate-x-1 transition-transform"
        />
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark mb-6">
          {data.title}
        </h1>
        {data.intro && (
          <div
            className="text-sm md:text-base text-shizora-dark/70 max-w-2xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.intro }}
          />
        )}
      </motion.div>

      {/* Category Tabs */}
      {data.categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {data.categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(idx)}
              className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${
                activeCategory === idx
                  ? "bg-shizora-dark text-white shadow-md"
                  : "bg-white/50 text-shizora-dark hover:bg-white hover:shadow-sm"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Accordion Content */}
      <div className="bg-[#FDFCFB] rounded-3xl p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(138,121,99,0.08)] border border-shizora-gold/10">
        <AnimatePresence mode="wait">
          {data.categories[activeCategory] && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {data.categories[activeCategory].items.map((item, itemIdx) => {
                const isOpen = openItems[`${activeCategory}-${itemIdx}`];
                return (
                  <div
                    key={itemIdx}
                    className="border-b border-shizora-gold/10 last:border-0 pb-4 last:pb-0"
                  >
                    <button
                      onClick={() => toggleItem(activeCategory, itemIdx)}
                      className="w-full py-4 flex items-center justify-between text-left group"
                    >
                      <h3 className="font-heading text-lg md:text-xl text-shizora-dark group-hover:text-shizora-gold transition-colors duration-300 pr-8">
                        {item.q}
                      </h3>
                      <div
                        className={`w-8 h-8 rounded-full border border-shizora-gold/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? "bg-shizora-dark border-transparent text-white rotate-180" : "text-shizora-gold group-hover:bg-shizora-gold/10"}`}
                      >
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div
                            className="pb-6 prose prose-sm max-w-none text-shizora-dark/70 font-light leading-relaxed prose-p:mb-4 last:prose-p:mb-0 prose-ul:list-disc prose-ul:pl-4 prose-li:mb-2"
                            dangerouslySetInnerHTML={{ __html: item.a }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
