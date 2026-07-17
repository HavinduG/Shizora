import FaqsClient from "./FaqsClient";
import Header from "@/components/layout/Header";
import { getHomePageData } from "@/lib/data";

async function getFaqsData() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "") || "";
    // Fetch the page with slug "faqs-page"
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=faqs-page`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch FAQs page");
      return "";
    }

    const data = await res.json();
    if (data && data.length > 0 && data[0].acf && data[0].acf.faqs_details) {
      return data[0].acf.faqs_details;
    }

    return "";
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return "";
  }
}

export default async function FaqsPage() {
  const htmlContent = await getFaqsData();
  const homeData = await getHomePageData();

  return (
    <>
      <Header data={homeData.acf} forceSolid={true} />
      <main className="min-h-screen bg-shizora-light pt-40 pb-24">
        {htmlContent ? (
          <FaqsClient htmlContent={htmlContent} />
        ) : (
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-heading text-4xl text-shizora-dark mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-shizora-dark/70">
              FAQ content is currently unavailable. Please check back later.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
