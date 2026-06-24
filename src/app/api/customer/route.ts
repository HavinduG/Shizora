import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const api = new WooCommerceRestApi({
      url: wpUrl,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      version: "wc/v3",
    });

    // force: true is required by WooCommerce to permanently delete a customer
    const response = await api.delete(`customers/${id}`, { force: true });

    return NextResponse.json(
      { message: "Account deleted successfully", customer: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Account deletion error:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to delete account" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, first_name, last_name, billing, shipping } = body;

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const api = new WooCommerceRestApi({
      url: wpUrl,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      version: "wc/v3",
    });

    const response = await api.put(`customers/${id}`, {
      first_name,
      last_name,
      billing,
      shipping
    });

    return NextResponse.json(
      { message: "Profile updated successfully", customer: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile update error:", error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to update profile" },
      { status: error.response?.status || 500 }
    );
  }
}
