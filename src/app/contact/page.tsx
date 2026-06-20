import { getContactPageData, getHomePageData } from "@/lib/data";
import Header from "@/components/layout/Header";
import TopLayer from "@/components/layout/TopLayer";
import ContactHero from "@/components/contact/ContactHero";
import ContactSupport from "@/components/contact/ContactSupport";
import ContactWholesale from "@/components/contact/ContactWholesale";

export default async function ContactPage() {
  const pageData = await getContactPageData();
  const homeData = await getHomePageData();

  // Extract ACF data safely
  const acf = pageData?.acf || {};

  return (
    <main className="min-h-screen bg-shizora-light">
      {/* Global Navigation */}
      <TopLayer data={homeData.acf?.top_layer_} theme="dark" />
      <Header data={homeData.acf} theme="dark" />

      {/* Dynamic Contact Hero */}
      <ContactHero data={acf} />

      {/* Contact Form and Details */}
      <ContactSupport data={homeData?.acf} />

      {/* Corporate and Wholesale */}
      <ContactWholesale data={acf} />
    </main>
  );
}
