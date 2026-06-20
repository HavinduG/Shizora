import { getRitualBySlug, getHomePageData } from "@/lib/data";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";
import { notFound } from "next/navigation";
import RitualBackButton from "./RitualBackButton";

export default async function RitualDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const ritual = await getRitualBySlug(resolvedParams.slug);
  const homeData = await getHomePageData();

  if (!ritual) {
    notFound();
  }

  const title = ritual.acf?.blog_title || ritual.title?.rendered;
  const image =
    ritual.acf?.blog_image?.url ||
    "https://images.unsplash.com/photo-1615397323783-5c8ab3f27289?q=80&w=2000";
  const description = ritual.acf?.blog_description || "";

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      {/* Global Navigation */}
      <TopLayer data={homeData.acf?.top_layer_} theme="dark" />
      <Header data={homeData.acf} theme="dark" />

      <article className="pt-[120px] lg:pt-[180px] pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1000px]">
          {/* Dynamic Back Button Component */}
          <RitualBackButton />

          {/* Article Header */}
          <div className="mb-16 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-shizora-gold font-bold mb-6 block">
              JOURNAL ENTRY
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-shizora-dark leading-tight max-w-4xl mx-auto">
              {title}
            </h1>
          </div>

          {/* Featured Image */}
          <div className="w-full aspect-[21/9] min-h-[300px] lg:min-h-[500px] rounded-3xl overflow-hidden mb-20 shadow-[0_30px_80px_-15px_rgba(138,121,99,0.15)] relative">
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="max-w-[800px] mx-auto text-shizora-dark/80 font-light leading-relaxed text-lg md:text-xl">
            <div
              className="prose prose-lg md:prose-xl max-w-none prose-p:font-light prose-p:leading-relaxed prose-p:text-shizora-dark/80 prose-headings:font-heading prose-headings:text-shizora-dark prose-a:text-shizora-gold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-strong:text-shizora-dark prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
