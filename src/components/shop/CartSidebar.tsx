"use client";

import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function CartSidebar() {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  // Get the currency symbol from the first item in the cart, default to AED (د.إ)
  const currencySymbol = items.length > 0 ? items[0].currency_symbol : "د.إ";

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-shizora-dark/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#fcfbf9] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-shizora-gold/20">
              <h2 className="font-heading text-2xl text-shizora-dark flex items-center gap-3">
                <ShoppingBag size={24} className="text-shizora-gold" />
                Your Ritual
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-shizora-dark/60 hover:text-shizora-dark hover:rotate-90 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-shizora-dark/50 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="tracking-wide">
                    Your ritual collection is empty.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 border-b border-shizora-gold text-shizora-gold text-xs uppercase tracking-widest pb-1 hover:text-shizora-dark hover:border-shizora-dark transition-colors duration-300"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-white border border-shizora-gold/10 relative overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800"
                        }
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-col flex-1 py-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3
                          className="font-heading text-shizora-dark text-lg leading-tight line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: item.name }}
                        />
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-shizora-dark/40 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <p className="text-shizora-gold text-sm font-medium mt-1">
                        {item.price.toFixed(2)}
                        {item.currency_symbol || currencySymbol}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center border border-shizora-gold/30 rounded-sm overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-shizora-dark/60 hover:bg-shizora-gold/10 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-shizora-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-shizora-dark/60 hover:bg-shizora-gold/10 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-shizora-gold/20 p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-shizora-dark/60 uppercase tracking-widest text-xs">
                    Subtotal
                  </span>
                  <span className="font-heading text-2xl text-shizora-dark">
                    {cartTotal.toFixed(2)}
                    {currencySymbol}
                  </span>
                </div>

                <p className="text-[10px] text-center text-shizora-dark/40 mb-6 uppercase tracking-widest">
                  Shipping & taxes calculated at checkout
                </p>

                <button className="w-full py-4 bg-shizora-dark text-white uppercase tracking-[0.2em] text-xs font-medium hover:bg-shizora-gold transition-colors duration-500">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
