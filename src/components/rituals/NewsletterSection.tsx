"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection({ data }: { data?: any }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We will pull these from ACF if available in the future,
  // otherwise fallback to the exact text from the reference image.
  const title = data?.newsletter_title || "Letters of Light";
  const description =
    data?.newsletter_description ||
    "Receive curated musings, exclusive spa rituals, and early access to new heritage collections delivered quietly to your inbox.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      alert("Thank you for subscribing to the Shizora Journal.");
    }, 1000);
  };

  return (
    <section className="pt-12 pb-16 lg:pb-24 bg-shizora-light">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <motion.div
          className="w-full bg-[#FDFCFB] rounded-2xl shadow-[0_20px_60px_-15px_rgba(138,121,99,0.1)] border border-shizora-gold/10 p-12 lg:p-24 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle elegant gradient glow in the corner */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-shizora-gold/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Mail
                className="w-8 h-8 text-shizora-gold mb-6"
                strokeWidth={1.5}
              />
            </motion.div>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-shizora-dark mb-6">
              {title}
            </h2>

            <p className="text-shizora-dark/70 text-sm md:text-base font-light leading-relaxed mb-10 max-w-xl">
              {description}
            </p>

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#F5F4F0] border border-transparent focus:border-shizora-gold/30 rounded-md px-6 py-4 text-sm text-shizora-dark placeholder:text-shizora-dark/40 outline-none transition-all duration-300"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0A1612] text-white px-8 py-4 rounded-md text-sm font-medium tracking-wide hover:bg-shizora-gold transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
