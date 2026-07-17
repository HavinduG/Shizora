import TopLayer from "@/components/layout/TopLayer";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import ProductsSection from "@/components/home/ProductsSection";
import AboutSection from "@/components/home/AboutSection";
import FeedbackSection from "@/components/home/FeedbackSection";
import RitualSection from "@/components/home/RitualSection";
import { getHomePageData, getProducts, getRituals } from "@/lib/data";

export default async function Home() {
  const data = await getHomePageData();
  const products = await getProducts();
  const rituals = await getRituals();

  return (
    <main className="flex flex-col min-h-screen relative">
      <TopLayer data={data.acf.top_layer_} />
      <Header data={data.acf} />
      <HeroSection data={data.acf.hero_section[0]} />
      <ProductsSection products={products} data={data.acf} />
      <AboutSection data={data.acf} />
      <FeedbackSection data={data.acf} />
      <RitualSection data={data.acf} rituals={rituals} />
      {/* Additional sections will go here as per future instructions */}
    </main>
  );
}
