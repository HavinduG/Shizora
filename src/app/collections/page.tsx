import {
  getProducts,
  getCollectionPageData,
  getHomePageData,
} from "@/lib/data";
import CollectionGrid from "@/components/shop/CollectionGrid";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";

// Server Component for fetching and layout
export default async function CollectionsPage() {
  const products = await getProducts();
  const pageData = await getCollectionPageData();
  const homeData = await getHomePageData(); // For header/toplayer menus

  const heroData = pageData?.acf?.collection_hero?.[0] || {};
  const bgImage =
    pageData?.acf?.collection_background?.url ||
    heroData.collection_background?.url ||
    "https://images.unsplash.com/photo-1615397323783-5c8ab3f27289?q=80&w=2000";

  return (
    <main className="min-h-screen bg-shizora-light pb-32">
      {/* Global Navigation - Using dark theme for visibility on light background */}
      <TopLayer data={homeData.acf?.top_layer_} theme="dark" />
      <Header data={homeData.acf} theme="dark" />

      {/* Collection Hero */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden mb-16 md:mb-24 pt-[80px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt={heroData.collection_background?.alt || "Botanical Collection"}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-shizora-light/90 via-shizora-light/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-4 block">
              CURATED PURITY
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark mb-6 leading-tight">
              The Botanical <br />
              <span className="italic">Awakening</span> Collection
            </h1>
            <p className="text-sm md:text-base text-shizora-dark/70 tracking-wide font-light max-w-md leading-relaxed">
              Formulated with rare organic extracts to illuminate and restore
              your natural vitality.
            </p>
          </div>
        </div>
      </section>

      {/* Collection Content (Sidebar + Grid) */}
      <section className="container mx-auto max-w-[1400px] px-6 lg:px-12">
        <CollectionGrid products={products} />
      </section>
    </main>
  );
}
