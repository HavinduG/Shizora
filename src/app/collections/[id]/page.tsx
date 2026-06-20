import { notFound } from "next/navigation";
import { getProduct, getHomePageData } from "@/lib/data";
import ProductDetail from "@/components/shop/ProductDetail";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  const homeData = await getHomePageData();

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-shizora-light pb-24">
      <TopLayer data={homeData.acf?.top_layer_} theme="dark" />
      <Header data={homeData.acf} theme="dark" />

      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px] pt-32">
        <ProductDetail product={product} />
      </div>
    </main>
  );
}
