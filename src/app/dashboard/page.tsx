import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!wpUrl || !consumerKey || !consumerSecret) {
    return <div>Configuration error. Missing API keys.</div>;
  }

  const api = new WooCommerceRestApi({
    url: wpUrl,
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    version: "wc/v3",
  });

  let customer = null;
  let orders = [];

  try {
    // 1. Fetch customer details
    const customersRes = await api.get("customers", {
      email: session.user.email,
    });
    if (customersRes.data && customersRes.data.length > 0) {
      customer = customersRes.data[0];

      // 2. Fetch orders for this customer
      const ordersRes = await api.get("orders", { customer: customer.id });
      orders = ordersRes.data;
    }
  } catch (error) {
    console.error("Error fetching WooCommerce data:", error);
  }

  // Calculate simulated points based on completed orders (e.g. 10 points per $1 spent)
  const totalPoints = orders
    .filter((o: any) => o.status === "completed")
    .reduce(
      (acc: number, order: any) =>
        acc + Math.floor(parseFloat(order.total) * 10),
      0,
    );

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-24 pb-20 relative overflow-hidden">
      {/* Luxury Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-shizora-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-[500px] bg-shizora-dark/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <DashboardClient
          user={session.user}
          customer={customer}
          orders={orders}
          points={totalPoints}
        />
      </div>
    </main>
  );
}
