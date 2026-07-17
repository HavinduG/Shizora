"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

// Social Icons SVGs (Using raw SVGs to avoid older lucide-react version conflicts)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer({ data }: { data: any }) {
  const currentYear = new Date().getFullYear();

  // Extract footer data safely
  const description =
    data.footer_description ||
    "Redefining beauty with nature. Elevate your rituals with organic purity and uncompromising luxury";
  const footerLists = data.footer_list || [];
  const socialMedia = data.social_media || [];
  const shopDetails = data.shop_details || [];

  // Helper function to render the correct social icon
  const renderSocialIcon = (alt: string) => {
    // Removed hover:text-shizora-gold to keep icons looking static/minimal
    const iconClass =
      "w-4 h-4 text-[#e8ded0]/60 transition-colors duration-300";
    switch (alt?.toLowerCase()) {
      case "instagram":
        return <InstagramIcon className={iconClass} />;
      case "facebook":
        return <FacebookIcon className={iconClass} />;
      case "twitter":
        return <TwitterIcon className={iconClass} />;
      default:
        return <span className="text-[10px]">{alt}</span>;
    }
  };

  return (
    <footer className="bg-[#24211a] text-[#e8ded0] pt-16 pb-6 px-6 lg:px-12 w-full border-t border-shizora-gold/10">
      <div className="container mx-auto max-w-[1400px]">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand & Contact Column (Spans 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="font-heading text-2xl tracking-[0.3em] text-[#e8ded0] hover:text-shizora-gold transition-colors duration-300 w-fit"
            >
              SHIZORA
            </Link>

            {/* Description */}
            <div
              className="text-xs text-[#e8ded0]/60 font-sans tracking-wide leading-relaxed max-w-xs"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {/* Shop Details / Contact Info */}
            <div className="flex flex-col gap-3 mt-2">
              {shopDetails.map((detail: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-[#e8ded0]/70 group"
                >
                  {/* Icon */}
                  {detail.shop_detail_name?.toLowerCase() === "address" && (
                    <MapPin size={14} className="text-shizora-gold/70" />
                  )}
                  {detail.shop_detail_name?.toLowerCase() ===
                    "phone number" && (
                    <Phone size={14} className="text-shizora-gold/70" />
                  )}
                  {detail.shop_detail_name?.toLowerCase() === "mail" && (
                    <Mail size={14} className="text-shizora-gold/70" />
                  )}

                  {detail.shop_detail_name?.toLowerCase().includes("phone") ? (
                    <a
                      href={`tel:${detail.shop_detail.replace(/[^0-9+]/g, "")}`}
                      className="text-xs tracking-wide group-hover:text-shizora-gold transition-colors duration-300"
                    >
                      {detail.shop_detail}
                    </a>
                  ) : detail.shop_detail_name
                      ?.toLowerCase()
                      .includes("mail") ? (
                    <a
                      href={`mailto:${detail.shop_detail}`}
                      className="text-xs tracking-wide group-hover:text-shizora-gold transition-colors duration-300"
                    >
                      {detail.shop_detail}
                    </a>
                  ) : (
                    <span className="text-xs tracking-wide group-hover:text-shizora-gold transition-colors duration-300">
                      {detail.shop_detail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Links Columns (Spans 4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {footerLists.map((list: any, index: number) => (
              <div key={index} className="flex flex-col gap-6">
                <h4 className="text-[9px] uppercase tracking-[0.2em] text-shizora-gold font-medium">
                  {list.footer_title}
                </h4>
                <ul className="flex flex-col gap-4">
                  {list.footer_pages_name?.map((page: any, pIndex: number) => {
                    let href = page.footer_page_url || "#";
                    // Map new WordPress names to existing Next.js routes if needed
                    const text = page.footer_page?.toLowerCase();
                    if (text === "shop" || href.includes("/shop"))
                      href = "/collections";
                    if (text === "our story" || href.includes("/our-story"))
                      href = "/about";
                    if (
                      text === "skincare rituals" ||
                      href.includes("/skincare-rituals")
                    )
                      href = "/rituals";
                    if (text === "faqs" || href.includes("/faqs"))
                      href = "/faqs";

                    return (
                      <li key={pIndex}>
                        <Link
                          href={href}
                          className="text-xs text-[#e8ded0]/70 hover:text-shizora-gold transition-colors duration-300 tracking-wide inline-block relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-shizora-gold hover:after:w-full after:transition-all after:duration-300"
                        >
                          {page.footer_page}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column (Spans 4 cols - Moved to Right) */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] text-shizora-gold font-medium mb-4 block">
              NEWSLETTER
            </span>
            <p className="text-xs text-[#e8ded0]/60 tracking-wide mb-6">
              Join the Shizora Inner Circle for first access to new arrivals,
              private offers and skincare rituals.
            </p>

            <form
              className="flex items-end gap-4 max-w-xs group"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-[#e8ded0]/20 pb-2 text-sm text-[#e8ded0] placeholder:text-[#e8ded0]/30 focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="border border-shizora-gold/50 text-shizora-gold text-[9px] uppercase tracking-[0.2em] px-6 py-2.5 hover:bg-shizora-gold hover:text-[#24211a] transition-all duration-300"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#e8ded0]/10">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#e8ded0]/40">
            &copy; {currentYear} 2026 SHIZORA. ALL RIGHTS RESERVED
          </p>

          {/* Social Links - Removed hover effects as requested */}
          <div className="flex items-center gap-4">
            {socialMedia.map((social: any, index: number) => (
              <Link
                key={index}
                href={social.social_media_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#e8ded0]/5 flex items-center justify-center transition-all duration-300"
              >
                {renderSocialIcon(
                  social.social_media_image?.alt ||
                    social.social_media_image?.title,
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
