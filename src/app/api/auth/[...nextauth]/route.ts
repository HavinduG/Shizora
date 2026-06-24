import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, '');

        try {
          // Use standard WordPress JWT Auth
          const jwtRes = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          });

          const jwtData = await jwtRes.json();

          if (jwtRes.ok && jwtData.token) {
            let firstName = "";
            let lastName = "";
            
            // Fetch WooCommerce customer to get real first name
            try {
              const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
              const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
              if (consumerKey && consumerSecret) {
                const wcUrl = new URL(`${wpUrl}/wp-json/wc/v3/customers`);
                wcUrl.searchParams.append("email", credentials.email);
                wcUrl.searchParams.append("consumer_key", consumerKey);
                wcUrl.searchParams.append("consumer_secret", consumerSecret);
                
                const wcRes = await fetch(wcUrl.toString());
                const wcData = await wcRes.json();
                
                if (wcRes.ok && wcData.length > 0) {
                  firstName = wcData[0].first_name;
                  lastName = wcData[0].last_name;
                }
              }
            } catch (e) {
              console.error("Could not fetch WC customer for name", e);
            }

            return {
              id: jwtData.user_id?.toString() || credentials.email,
              name: firstName || jwtData.user_display_name || credentials.email.split('@')[0],
              email: jwtData.user_email || credentials.email,
              accessToken: jwtData.token,
              firstName: firstName,
              lastName: lastName,
            };
          }

          console.error("JWT Login failed:", jwtData);
          return null;

        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        if (user.accessToken) token.accessToken = user.accessToken;
        if (user.firstName) token.firstName = user.firstName;
        if (user.lastName) token.lastName = user.lastName;
        if (user.name) token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.accessToken = token.accessToken;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        if (token.name) session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // We'll create custom login page
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
