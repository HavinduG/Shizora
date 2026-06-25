import { getRitualPageData, getHomePageData, getRituals } from "@/lib/data";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";
import RitualsList from "@/components/rituals/RitualsList";
import NewsletterSection from "@/components/rituals/NewsletterSection";
import RitualsHero from "@/components/rituals/RitualsHero";

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
      <RitualsHero
        bgImage={bgImage}
        title1={title1}
        title2={title2}
        altText={acf.ritual_background?.alt || "Rituals"}
      />

      {/* Rituals List Section */}
      <RitualsList rituals={rituals} />

      {/* Newsletter Section */}
      <NewsletterSection data={acf} />
    </main>
  );
}
