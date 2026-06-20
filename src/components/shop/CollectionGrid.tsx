"use client";

import { useState, useMemo } from "react";
import CollectionProductCard from "@/components/shop/CollectionProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function CollectionGrid({ products }: { products: any[] }) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Skincare");
  const [selectedRitual, setSelectedRitual] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Featured");

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      p.categories?.forEach((c: any) => cats.add(c.name));
    });
    return ["All Skincare", ...Array.from(cats)];
  }, [products]);

  // Extract unique Ritual Focus (tags or specific attributes)
  const rituals = useMemo(() => {
    const rits = new Set<string>();
    products.forEach((p) => {
      // Assuming Ritual Focus might be stored as tags or an attribute named "Ritual Focus"
      p.tags?.forEach((t: any) => rits.add(t.name));
      const ritualAttr = p.attributes?.find(
        (a: any) => a.name.toLowerCase() === "ritual focus",
      );
      if (ritualAttr) {
        ritualAttr.options?.forEach((opt: string) => rits.add(opt));
        ritualAttr.terms?.forEach((t: any) => rits.add(t.name));
      }
    });
    return ["All", ...Array.from(rits)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "All Skincare") {
      filtered = filtered.filter((p) =>
        p.categories?.some((c: any) => c.name === selectedCategory),
      );
    }

    if (selectedRitual !== "All") {
      filtered = filtered.filter((p) => {
        const hasTag = p.tags?.some((t: any) => t.name === selectedRitual);
        const ritualAttr = p.attributes?.find(
          (a: any) => a.name.toLowerCase() === "ritual focus",
        );
        const hasAttr =
          ritualAttr?.options?.includes(selectedRitual) ||
          ritualAttr?.terms?.some((t: any) => t.name === selectedRitual);
        return hasTag || hasAttr;
      });
    }

    // Sorting
    switch (sortBy) {
      case "Price: Low to High":
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.prices?.price || "0");
          const priceB = parseFloat(b.prices?.price || "0");
          return priceA - priceB;
        });
        break;
      case "Price: High to Low":
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.prices?.price || "0");
          const priceB = parseFloat(b.prices?.price || "0");
          return priceB - priceA;
        });
        break;
      case "Newest":
        // Fallback to ID sorting if date isn't available
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Featured (default API order)
        break;
    }

    return filtered;
  }, [products, selectedCategory, selectedRitual, sortBy]);

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-32 flex flex-col gap-10">
          {/* Category Filter */}
          {categories.length > 1 && (
            <div>
              <h3 className="font-heading text-xl text-shizora-dark mb-6">
                Category
              </h3>
              <ul className="flex flex-col gap-4">
                {categories.map((cat, i) => (
                  <li
                    key={i}
                    onClick={() => setSelectedCategory(cat)}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategory === cat ? "bg-shizora-dark border-shizora-dark" : "border-shizora-dark/30 group-hover:border-shizora-gold"}`}
                    >
                      {selectedCategory === cat && (
                        <div className="w-2 h-2 bg-shizora-gold rounded-sm" />
                      )}
                    </div>
                    <span
                      className={`text-xs tracking-wide transition-colors ${selectedCategory === cat ? "text-shizora-dark font-medium" : "text-shizora-dark/60 group-hover:text-shizora-dark"}`}
                    >
                      {cat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ritual Focus Filter */}
          {rituals.length > 1 && (
            <div>
              <h3 className="font-heading text-xl text-shizora-dark mb-6">
                Ritual Focus
              </h3>
              <ul className="flex flex-col gap-4">
                {rituals.map((ritual, i) => (
                  <li
                    key={i}
                    onClick={() => setSelectedRitual(ritual)}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedRitual === ritual ? "border-shizora-dark" : "border-shizora-dark/30 group-hover:border-shizora-gold"}`}
                    >
                      {selectedRitual === ritual && (
                        <div className="w-2 h-2 rounded-full bg-shizora-dark" />
                      )}
                    </div>
                    <span
                      className={`text-xs tracking-wide transition-colors ${selectedRitual === ritual ? "text-shizora-dark font-medium" : "text-shizora-dark/60 group-hover:text-shizora-dark"}`}
                    >
                      {ritual}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="flex-1 flex flex-col">
        {/* Grid Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-shizora-dark/10">
          <p className="text-xs text-shizora-dark/60 tracking-wide">
            Showing {filteredProducts.length} items
          </p>
          <div className="flex items-center gap-3 text-xs text-shizora-dark/80 tracking-wide">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none font-medium text-shizora-dark cursor-pointer"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <CollectionProductCard product={product} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-shizora-dark/60 font-light">
              No products found matching your selections.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
