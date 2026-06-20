"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  currency_symbol: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("shizora_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("shizora_cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (product: any) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      // Handle WooCommerce price format dynamically
      const rawPrice = product.prices?.price || product.price || "0";
      const minorUnit =
        product.prices?.currency_minor_unit !== undefined
          ? product.prices.currency_minor_unit
          : 2;
      const price =
        typeof rawPrice === "string"
          ? parseInt(rawPrice, 10) / Math.pow(10, minorUnit)
          : rawPrice;

      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: price,
          quantity: 1,
          image: product.images?.[0]?.src || product.image || "",
          currency_symbol: product.prices?.currency_symbol || "د.إ",
        },
      ];
    });

    // Automatically open cart when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string | number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
