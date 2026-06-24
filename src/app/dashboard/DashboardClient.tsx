"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Award, LogOut, Settings, Home } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export default function DashboardClient({
  user,
  customer,
  orders,
  points,
}: any) {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    company: customer?.billing?.company || "",
    country: customer?.billing?.country || "",
    address_1: customer?.billing?.address_1 || "",
    address_2: customer?.billing?.address_2 || "",
    city: customer?.billing?.city || "",
    postcode: customer?.billing?.postcode || "",
    phone: customer?.billing?.phone || "",
    email: user?.email || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const billingAndShippingData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      company: formData.company,
      country: formData.country,
      address_1: formData.address_1,
      address_2: formData.address_2,
      city: formData.city,
      postcode: formData.postcode,
      phone: formData.phone,
      email: formData.email,
    };

    try {
      const res = await fetch("/api/customer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: customer.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          billing: billingAndShippingData,
          shipping: billingAndShippingData, // Syncing billing & shipping for simplicity
        }),
      });

      if (res.ok) {
        // Trigger NextAuth session update so the header gets the new name
        await updateSession({
          firstName: formData.first_name,
          lastName: formData.last_name,
          name: formData.first_name,
        });

        setIsEditing(false);
        router.refresh(); // Refresh server component data
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account? All your data and order history will be removed. This action cannot be undone.",
      )
    ) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/customer?id=${customer.id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          signOut({ callbackUrl: "/" });
        } else {
          const errorData = await res.json();
          alert(errorData.error || "Failed to delete account");
          setIsDeleting(false);
        }
      } catch (err) {
        console.error("Error deleting account:", err);
        alert("An unexpected error occurred.");
        setIsDeleting(false);
      }
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Order History", icon: Package },
    { id: "rewards", label: "Rewards", icon: Award },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-1/4"
      >
        <div className="bg-white p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-shizora-gold to-transparent opacity-50" />

          <div className="mb-8">
            <h2 className="font-heading text-2xl text-shizora-dark mb-1">
              Welcome, {customer?.first_name || user?.name || "Guest"}
            </h2>
            <p className="text-xs text-shizora-dark/60 tracking-wider">
              {user?.email}
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-sm tracking-wide ${
                  activeTab === tab.id
                    ? "bg-shizora-gold/10 text-shizora-gold font-medium"
                    : "text-shizora-dark/60 hover:bg-black/5 hover:text-shizora-dark"
                }`}
              >
                <tab.icon size={18} strokeWidth={1.5} />
                {tab.label}
              </button>
            ))}

            <div className="w-full h-px bg-black/5 my-4" />

            <Link
              href="/"
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-sm tracking-wide text-shizora-dark/60 hover:bg-black/5 hover:text-shizora-dark"
            >
              <Home size={18} strokeWidth={1.5} />
              Return Home
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-sm tracking-wide text-red-500/80 hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={18} strokeWidth={1.5} />
              Sign Out
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-3/4"
      >
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] min-h-[500px]">
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-heading text-3xl text-shizora-dark">
                    {isEditing ? "Edit Profile" : "Personal Details"}
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs uppercase tracking-widest text-shizora-gold hover:text-shizora-dark transition-colors flex items-center gap-2"
                    >
                      <Settings size={14} /> Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-2 font-medium">
                          First name *
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          required
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-2 font-medium">
                          Last name *
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          required
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-2 font-medium">
                          Email address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-2 font-medium">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-2 font-medium">
                          Country / Region *
                        </label>
                        <select
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                        >
                          <option value="">Select a country / region...</option>
                          <option value="US">United States (US)</option>
                          <option value="GB">United Kingdom (UK)</option>
                          <option value="AE">United Arab Emirates (UAE)</option>
                          <option value="AU">Australia</option>
                          {/* Add more options as needed or fetch dynamically */}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-2 font-medium">
                          Town / City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-2 font-medium">
                          Postcode / ZIP *
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          required
                          value={formData.postcode}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-2 font-medium">
                          Company name (optional)
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[10px] uppercase tracking-widest text-shizora-dark/60 font-medium">
                        Street address *
                      </label>
                      <input
                        type="text"
                        name="address_1"
                        placeholder="House number and street name"
                        required
                        value={formData.address_1}
                        onChange={handleInputChange}
                        className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                      />
                      <input
                        type="text"
                        name="address_2"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        value={formData.address_2}
                        onChange={handleInputChange}
                        className="w-full bg-[#f8f9fb] border border-black/5 rounded py-3 px-4 text-sm text-shizora-dark focus:outline-none focus:border-shizora-gold transition-colors duration-300"
                      />
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-shizora-dark text-white px-8 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-shizora-gold transition-colors duration-300 disabled:opacity-70"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                        className="border border-shizora-dark/20 text-shizora-dark px-8 py-3 text-[11px] uppercase tracking-[0.2em] hover:border-shizora-dark transition-colors duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-2 border-b border-black/5 pb-4">
                        <p className="text-[10px] uppercase tracking-widest text-shizora-dark/40 font-medium">
                          First Name
                        </p>
                        <p className="text-sm text-shizora-dark">
                          {customer?.first_name || "—"}
                        </p>
                      </div>
                      <div className="space-y-2 border-b border-black/5 pb-4">
                        <p className="text-[10px] uppercase tracking-widest text-shizora-dark/40 font-medium">
                          Last Name
                        </p>
                        <p className="text-sm text-shizora-dark">
                          {customer?.last_name || "—"}
                        </p>
                      </div>
                      <div className="space-y-2 border-b border-black/5 pb-4">
                        <p className="text-[10px] uppercase tracking-widest text-shizora-dark/40 font-medium">
                          Email Address
                        </p>
                        <p className="text-sm text-shizora-dark">
                          {user?.email}
                        </p>
                      </div>
                      <div className="space-y-2 border-b border-black/5 pb-4">
                        <p className="text-[10px] uppercase tracking-widest text-shizora-dark/40 font-medium">
                          Phone
                        </p>
                        <p className="text-sm text-shizora-dark">
                          {customer?.billing?.phone || "—"}
                        </p>
                      </div>
                      <div className="space-y-2 border-b border-black/5 pb-4">
                        <p className="text-[10px] uppercase tracking-widest text-shizora-dark/40 font-medium">
                          Country / Region
                        </p>
                        <p className="text-sm text-shizora-dark">
                          {customer?.billing?.country || "—"}
                        </p>
                      </div>
                      <div className="space-y-2 border-b border-black/5 pb-4">
                        <p className="text-[10px] uppercase tracking-widest text-shizora-dark/40 font-medium">
                          Town / City
                        </p>
                        <p className="text-sm text-shizora-dark">
                          {customer?.billing?.city || "—"}
                        </p>
                      </div>
                      <div className="space-y-2 border-b border-black/5 pb-4">
                        <p className="text-[10px] uppercase tracking-widest text-shizora-dark/40 font-medium">
                          Postal Code
                        </p>
                        <p className="text-sm text-shizora-dark">
                          {customer?.billing?.postcode || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-12">
                      <h4 className="font-heading text-2xl text-shizora-dark mb-6">
                        Shipping Address
                      </h4>
                      <div className="bg-[#f8f9fb] p-6 rounded-xl border border-black/5">
                        {customer?.shipping?.address_1 ? (
                          <div className="text-sm text-shizora-dark/80 space-y-1">
                            <p>
                              {customer.shipping.first_name}{" "}
                              {customer.shipping.last_name}
                            </p>
                            {customer.shipping.company && (
                              <p className="text-xs text-shizora-dark/60">
                                {customer.shipping.company}
                              </p>
                            )}
                            <p>{customer.shipping.address_1}</p>
                            {customer.shipping.address_2 && (
                              <p>{customer.shipping.address_2}</p>
                            )}
                            <p>
                              {customer.shipping.city},{" "}
                              {customer.shipping.state}{" "}
                              {customer.shipping.postcode}
                            </p>
                            <p>{customer.shipping.country}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-shizora-dark/50 italic">
                            No shipping address saved yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-black/10">
                      <h4 className="font-heading text-xl text-red-500 mb-2">
                        Danger Zone
                      </h4>
                      <p className="text-xs text-shizora-dark/50 mb-6">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="border border-red-500/20 text-red-500 px-6 py-2.5 text-[10px] uppercase tracking-widest hover:bg-red-50 transition-colors duration-300 disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting..." : "Delete Account"}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-heading text-3xl text-shizora-dark mb-8">
                  Order History
                </h3>

                {orders && orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="border border-black/10 rounded-xl p-6 hover:border-shizora-gold/30 transition-colors duration-300"
                      >
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-shizora-dark/40 mb-1">
                              Order #{order.id} •{" "}
                              {new Date(
                                order.date_created,
                              ).toLocaleDateString()}
                            </p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg text-shizora-dark">
                              {order.currency_symbol}
                              {order.total}
                            </p>
                            <p className="text-xs text-shizora-dark/50">
                              {order.line_items.length} item(s)
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-black/5 flex flex-wrap gap-4">
                          {order.line_items.slice(0, 3).map((item: any) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3"
                            >
                              <div className="w-10 h-10 bg-black/5 rounded flex items-center justify-center text-xs text-shizora-dark/50">
                                {item.quantity}x
                              </div>
                              <span className="text-sm text-shizora-dark/80 max-w-[150px] truncate">
                                {item.name}
                              </span>
                            </div>
                          ))}
                          {order.line_items.length > 3 && (
                            <div className="flex items-center text-xs text-shizora-dark/50">
                              + {order.line_items.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-black/5 rounded-xl">
                    <Package
                      size={48}
                      strokeWidth={1}
                      className="mx-auto text-shizora-dark/20 mb-4"
                    />
                    <p className="text-shizora-dark/60 mb-6">
                      You haven't placed any orders yet.
                    </p>
                    <a
                      href="/collections"
                      className="inline-block bg-shizora-dark text-white px-8 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-shizora-gold transition-colors duration-300"
                    >
                      Discover Collections
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {/* Rewards Tab */}
            {activeTab === "rewards" && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center py-12 mb-8 bg-gradient-to-br from-shizora-dark to-[#1a1a1a] rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-shizora-gold/20 blur-[80px] rounded-full pointer-events-none"></div>

                  <Award
                    size={48}
                    strokeWidth={1}
                    className="mx-auto text-shizora-gold mb-6 relative z-10"
                  />
                  <h3 className="font-heading text-4xl text-white mb-2 relative z-10">
                    Shizora Society
                  </h3>
                  <p className="text-white/60 text-sm tracking-wide relative z-10 mb-8">
                    Your exclusive loyalty benefits
                  </p>

                  <div className="inline-flex items-end gap-2 relative z-10">
                    <span className="text-6xl font-light text-shizora-gold leading-none">
                      {points}
                    </span>
                    <span className="text-sm uppercase tracking-widest text-white/80 mb-2">
                      Points
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-black/10 rounded-xl p-6 text-center hover:border-shizora-gold transition-colors duration-300">
                    <p className="text-shizora-gold text-2xl font-light mb-2">
                      500
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-4">
                      Points
                    </p>
                    <p className="text-sm text-shizora-dark">
                      Free Deluxe Sample
                    </p>
                  </div>
                  <div className="border border-black/10 rounded-xl p-6 text-center hover:border-shizora-gold transition-colors duration-300">
                    <p className="text-shizora-gold text-2xl font-light mb-2">
                      1000
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-4">
                      Points
                    </p>
                    <p className="text-sm text-shizora-dark">
                      $15 Off Next Order
                    </p>
                  </div>
                  <div className="border border-black/10 rounded-xl p-6 text-center hover:border-shizora-gold transition-colors duration-300">
                    <p className="text-shizora-gold text-2xl font-light mb-2">
                      2500
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-shizora-dark/60 mb-4">
                      Points
                    </p>
                    <p className="text-sm text-shizora-dark">
                      Exclusive Early Access
                    </p>
                  </div>
                </div>

                <p className="text-center text-xs text-shizora-dark/40 mt-8">
                  Earn 10 points for every $1 spent on successful orders.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
