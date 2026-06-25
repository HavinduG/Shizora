import {
  getProducts,
  getCollectionPageData,
  getHomePageData,
} from "@/lib/data";
import CollectionGrid from "@/components/shop/CollectionGrid";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";
import CollectionHero from "@/components/shop/CollectionHero";

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
      <CollectionHero bgImage={bgImage} />

      {/* Collection Content (Sidebar + Grid) */}
      <section className="container mx-auto max-w-[1400px] px-6 lg:px-12">
        <CollectionGrid products={products} />
      </section>
    </main>
  );
}
