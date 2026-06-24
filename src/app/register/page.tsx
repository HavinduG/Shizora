"use client";

import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Register user via custom API route
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // 2. Sign in the user automatically
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        // If sign in fails but registration succeeded, redirect to login
        router.push("/login?message=Registration successful. Please log in.");
      } else if (signInResult?.ok) {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 text-center border border-red-100">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-transparent border-b border-shizora-dark/20 py-3 px-2 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300 placeholder:text-shizora-dark/30"
          />
          <input
            type="text"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-transparent border-b border-shizora-dark/20 py-3 px-2 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300 placeholder:text-shizora-dark/30"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-shizora-dark/20 py-3 px-2 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300 placeholder:text-shizora-dark/30"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-shizora-dark/20 py-3 px-2 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300 placeholder:text-shizora-dark/30"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden bg-shizora-dark text-white py-4 rounded-none transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-shizora-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 text-[11px] uppercase tracking-[0.2em] flex items-center justify-center">
              {isLoading ? "Creating Account..." : "Create Account"}
            </span>
          </button>
        </div>
      </form>

      <div className="text-center pt-2">
        <p className="text-shizora-dark/60 text-xs">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-shizora-gold hover:text-shizora-dark transition-colors duration-300 font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <main className="min-h-screen bg-[#FDFCFB] flex flex-col relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-shizora-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-shizora-dark/5 blur-[120px] pointer-events-none" />

      {/* Header with back button */}
      <header className="w-full py-8 px-6 lg:px-12 absolute top-0 left-0 z-50">
        <Link
          href="/"
          className="inline-flex items-center text-shizora-dark/60 hover:text-shizora-gold transition-colors duration-300 relative z-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span className="text-[10px] uppercase tracking-[0.2em]">
            Return Home
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-2xl relative overflow-hidden"
        >
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-shizora-gold to-transparent opacity-50" />

          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-4xl text-shizora-dark mb-4">
              Join Shizora
            </h1>
            <p className="text-shizora-dark/60 text-sm font-light">
              Create an account to track your orders, save your favorites, and
              experience personalized skincare.
            </p>
          </div>

          <RegisterForm />
        </motion.div>
      </div>
    </main>
  );
}
