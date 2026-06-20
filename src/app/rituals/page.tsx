import { getRitualPageData, getHomePageData, getRituals } from "@/lib/data";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";
import RitualsList from "@/components/rituals/RitualsList";
import NewsletterSection from "@/components/rituals/NewsletterSection";

export default async function RitualsPage() {
  const pageData = await getRitualPageData();
  const homeData = await getHomePageData();
  const rituals = await getRituals();

  // Extract ACF data safely
  const acf = pageData?.acf || {};
  const bgImage =
    acf.ritual_background?.url ||
    "https://images.unsplash.com/photo-1615397323783-5c8ab3f27289?q=80&w=2000";
  const title1 = acf.ritual_title_1 || "The Shizora Journal";
  const title2 =
    acf.ritual_title_2 ||
    "Reflections on modern luxury, timeless rituals, and the art of luminous living. A curated exploration of wellness and aesthetic purity.";

  return (
    <main className="min-h-screen bg-shizora-light">
      <TopLayer data={homeData.acf?.top_layer_} theme="dark" />
      <Header data={homeData.acf} theme="dark" />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden pt-[80px]">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt={acf.ritual_background?.alt || "Rituals"}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-shizora-light/40 via-shizora-light/50 to-shizora-light" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-4xl mt-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-6 block">
            RITUALS
          </span>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark mb-8 leading-[1.1] max-w-3xl">
            {title1}
          </h1>

          <p className="text-sm md:text-base text-shizora-dark/70 tracking-wide font-light max-w-2xl leading-relaxed mx-auto">
            {title2}
          </p>
        </div>
      </section>

      {/* Rituals List Section */}
      <RitualsList rituals={rituals} />

      {/* Newsletter Section */}
      <NewsletterSection data={acf} />
    </main>
  );
}
