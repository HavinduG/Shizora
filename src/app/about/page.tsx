import { getAboutPageData, getHomePageData } from "@/lib/data";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";
import AboutSection from "@/components/about/AboutSection";
import AboutSectionTwo from "@/components/about/AboutSectionTwo";
import AboutSectionThree from "@/components/about/AboutSectionThree";
import AboutRitualSection from "@/components/about/AboutRitualSection";
import AboutHero from "@/components/about/AboutHero";

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
      <AboutHero
        bgImage={bgImage}
        title1={title1}
        title2={title2}
        description={description}
        altText={acf.about_background?.alt || "About Shizora"}
      />

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
