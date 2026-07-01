"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Loader2 } from "lucide-react";

export default function ContactSupport({ data }: { data: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Extract shop details from WordPress data or use fallbacks
  const shopDetails = data?.shop_details || [
    { shop_detail_name: "Telephone", shop_detail: "+94704839017" },
    {
      shop_detail_name: "Email",
      shop_detail: "havindugayanranathunga@gmail.com",
    },
    {
      shop_detail_name: "Boutique & Spa",
      shop_detail: "No 21 , Al Awir ,Dubai",
    },
  ];

  const socialMedia = data?.social_media || [];

  // Helper to map text names to Lucide icons
  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("phone") || lowerName.includes("tele"))
      return <Phone className="w-5 h-5" strokeWidth={1.5} />;
    if (lowerName.includes("mail") || lowerName.includes("email"))
      return <Mail className="w-5 h-5" strokeWidth={1.5} />;
    return <MapPin className="w-5 h-5" strokeWidth={1.5} />;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/shizora/v1/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
      setTimeout(() => setSubmitStatus("idle"), 5000); // Clear success message after 5s
    } catch (error) {
      console.error("Error submitting lead:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-shizora-light">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Contact Form */}
          <motion.div
            className="w-full lg:w-3/5 bg-[#FDFCFB] rounded-3xl p-8 lg:p-12 shadow-[0_20px_60px_-15px_rgba(138,121,99,0.08)] border border-shizora-gold/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-heading text-3xl text-shizora-dark mb-8 pb-6 border-b border-shizora-gold/10">
              Send an Inquiry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-shizora-dark">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-[#F5F4F0] border border-transparent focus:border-shizora-gold/30 rounded-lg px-5 py-4 text-sm text-shizora-dark placeholder:text-shizora-dark/40 outline-none transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-shizora-dark">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="eleanor@example.com"
                    className="w-full bg-[#F5F4F0] border border-transparent focus:border-shizora-gold/30 rounded-lg px-5 py-4 text-sm text-shizora-dark placeholder:text-shizora-dark/40 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-shizora-dark">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F4F0] border border-transparent focus:border-shizora-gold/30 rounded-lg px-5 py-4 text-sm text-shizora-dark outline-none transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select an area of inquiry...
                  </option>
                  <option value="product">Product Recommendations</option>
                  <option value="order">Order Status</option>
                  <option value="spa">Spa Reservations</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-shizora-dark">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="How may we assist you today?"
                  className="w-full bg-[#F5F4F0] border border-transparent focus:border-shizora-gold/30 rounded-lg px-5 py-4 text-sm text-shizora-dark placeholder:text-shizora-dark/40 outline-none transition-all duration-300 resize-none"
                ></textarea>
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm">
                  Message sent successfully. Our concierge will contact you
                  shortly.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm">
                  There was an error sending your message. Please try again
                  later.
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0A1612] text-white px-8 py-4 rounded-lg text-sm font-medium tracking-wide flex items-center gap-3 hover:bg-shizora-gold transition-colors duration-300 disabled:opacity-70 group"
                >
                  {isSubmitting ? (
                    <>
                      Sending...
                      <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight
                        size={16}
                        className="transform group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Info Cards */}
          <div className="w-full lg:w-2/5 flex flex-col gap-8">
            {/* Direct Support Card */}
            <motion.div
              className="bg-[#FDFCFB] rounded-3xl p-8 lg:p-10 shadow-[0_20px_60px_-15px_rgba(138,121,99,0.08)] border border-shizora-gold/10 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Subtle gold glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-shizora-gold/10 rounded-full blur-3xl pointer-events-none"></div>

              <h3 className="font-heading text-2xl text-shizora-dark mb-4 relative z-10">
                Direct Support
              </h3>
              <p className="text-shizora-dark/70 text-sm leading-relaxed mb-10 relative z-10 font-light">
                For immediate assistance, our concierge is available Monday
                through Friday, 9:00 AM to 6:00 PM.
              </p>

              <div className="space-y-8 relative z-10">
                {shopDetails.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-5 group">
                    <div className="w-10 h-10 rounded-full bg-[#F5F4F0] flex items-center justify-center text-shizora-gold transition-transform duration-300 group-hover:scale-110 group-hover:bg-shizora-gold/10">
                      {getIcon(item.shop_detail_name)}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-shizora-gold block mb-1">
                        {item.shop_detail_name}
                      </span>
                      <span className="text-shizora-dark text-sm">
                        {item.shop_detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Card */}
            <motion.div
              className="bg-[#FDFCFB] rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(138,121,99,0.08)] border border-shizora-gold/10 group cursor-pointer hover:border-shizora-gold/30 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link href="#" className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-shizora-dark mb-2">
                    Frequently Asked
                  </h4>
                  <p className="text-shizora-dark/70 text-sm font-light">
                    Review our shipping, return, and product policies.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-shizora-dark/10 flex items-center justify-center text-shizora-dark group-hover:bg-shizora-dark group-hover:text-white transition-all duration-300 flex-shrink-0 ml-4">
                  <ArrowRight
                    size={18}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            </motion.div>

            {/* Social Media */}
            {socialMedia && socialMedia.length > 0 && (
              <motion.div
                className="flex items-center gap-4 mt-2 px-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-shizora-dark/60 mr-2">
                  Follow Us
                </span>
                {socialMedia.map((social: any, idx: number) => (
                  <a
                    key={idx}
                    href={social.social_media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#FDFCFB] border border-shizora-gold/10 flex items-center justify-center shadow-sm hover:border-shizora-gold/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    <img
                      src={social.social_media_image?.url}
                      alt={social.social_media_image?.title || "Social icon"}
                      className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
