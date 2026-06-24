import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!wpUrl || !consumerKey || !consumerSecret) {
      console.error("Missing WooCommerce API credentials");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Because the WordPress URL is HTTP (shizora.local), WooCommerce requires OAuth 1.0a.
    // The official WooCommerce package handles this OAuth signature automatically for HTTP.
    const api = new WooCommerceRestApi({
      url: wpUrl,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      version: "wc/v3",
    });

    const response = await api.post("customers", {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      username: email.split("@")[0],
    });

    return NextResponse.json(
      { message: "User registered successfully", user: response.data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error);
    return NextResponse.json(
      { message: error.response?.data?.message || "An unexpected error occurred" },
      { status: error.response?.status || 500 }
    );
  }
}
