import { getAboutPageData, getHomePageData } from "@/lib/data";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";
import AboutSection from "@/components/about/AboutSection";
import AboutSectionTwo from "@/components/about/AboutSectionTwo";
import AboutSectionThree from "@/components/about/AboutSectionThree";
import AboutRitualSection from "@/components/about/AboutRitualSection";

export default async function AboutPage() {
  const pageData = await getAboutPageData();
  const homeData = await getHomePageData();

  // Extract ACF data safely
  const acf = pageData?.acf || {};
  const bgImage =
    acf.about_background?.url ||
    "https://images.unsplash.com/photo-1615397323783-5c8ab3f27289?q=80&w=2000";
  const title1 = acf.hero_title_1 || "OUR HERITAGE";
  const title2 =
    acf.hero_title_2 ||
    "Defining Our Identity Through Timeless Botanical Wisdom";
  const description =
    acf.hero_description ||
    "Born from the quiet elegance of dawn, Shizora is a sanctuary of luminous beauty. We believe in the restorative power of nature, carefully distilling rare botanical extracts to create skincare rituals that nourish both skin and spirit.";

  return (
    <main className="min-h-screen bg-shizora-light">
      <TopLayer data={homeData.acf?.top_layer_} theme="dark" />
      <Header data={homeData.acf} theme="dark" />

      {/* About Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden pt-[80px]">
        {/* Background Image with Gradient Overlay similar to Collections */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt={acf.about_background?.alt || "About Shizora"}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-shizora-light/40 via-shizora-light/50 to-shizora-light" />
        </div>

        {/* Hero Content matching the provided design */}
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-4xl mt-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-6 block">
            {title1}
          </span>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark mb-8 leading-[1.1] max-w-3xl">
            {title2}
          </h1>

          <p className="text-sm md:text-base text-shizora-dark/70 tracking-wide font-light max-w-2xl leading-relaxed mx-auto">
            {description}
          </p>
        </div>
      </section>

      {/* Heritage Description Section (About 2) */}
      <AboutSectionTwo data={acf} />

      {/* About Description Section (About 1) */}
      <AboutSection data={acf} />

      {/* Our Philosophy Section (About 3) */}
      <AboutSectionThree data={acf} />

      {/* Ritual / Experience the Glow Section */}
      <AboutRitualSection data={acf} />
    </main>
  );
}
