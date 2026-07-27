"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";

export default function ProductsSection({
  products,
  data,
}: {
  products: any[];
  data?: any;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle 3D background particles
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 80;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    const material = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xcba863,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    document.addEventListener("mousemove", onDocumentMouseMove);

    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = currentTime / 1000;

      targetX = mouseX * 0.0003;
      targetY = mouseY * 0.0003;

      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

      particlesMesh.position.y = Math.sin(elapsedTime * 0.3) * 0.05;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      cancelAnimationFrame(animationFrameId);
      particlesGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Helper to format WooCommerce Store API price data securely
  const formatPrice = (prices: any) => {
    if (!prices) return "";
    const symbol = prices.currency_symbol || "د.إ";
    const priceString = prices.price || "0";
    const minorUnit =
      prices.currency_minor_unit !== undefined ? prices.currency_minor_unit : 2;
    const value = parseInt(priceString, 10) / Math.pow(10, minorUnit);
    return `${value.toFixed(2)}${symbol}`;
  };

  const ProductCard = ({ product, index }: { product: any; index: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
    const glareOpacity = useTransform(y, [-0.5, 0.5], [0, 0.15]);
    const glareY = useTransform(y, [-0.5, 0.5], ["-100%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 1,
          delay: index * 0.15,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{ perspective: 1200 }}
        className="h-full"
      >
        <Link href={`/collections/${product.id}`} className="block h-full">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="bg-white border border-shizora-gold/10 group flex flex-col h-full relative shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(203,168,99,0.25)] hover:border-shizora-gold/30 transition-all duration-500 rounded-sm overflow-hidden"
          >
            {/* Glare effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-20 bg-linear-to-b from-white/60 to-transparent mix-blend-overlay"
              style={{ opacity: glareOpacity, translateY: glareY }}
            />

            <div
              className="relative aspect-square md:aspect-[4/3] overflow-hidden bg-white"
              style={{ transform: "translateZ(30px)" }}
            >
              {/* Inner Gold Frame */}
              <div className="absolute inset-3 border border-white/30 group-hover:border-shizora-gold/40 z-10 transition-colors duration-700 pointer-events-none rounded-sm" />

              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-shizora-dark/20 font-heading">
                  No Image
                </div>
              )}

              {/* Subtle Vignette */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/10 pointer-events-none mix-blend-multiply" />

              {index === 0 && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[8px] uppercase tracking-widest text-shizora-gold font-semibold z-10 shadow-sm">
                  New
                </div>
              )}
              {index === 1 && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[8px] uppercase tracking-widest text-shizora-gold font-semibold z-10 shadow-sm">
                  Best Seller
                </div>
              )}
            </div>

            <div
              className="p-6 flex flex-col grow bg-[#fcfbf9]"
              style={{ transform: "translateZ(20px)" }}
            >
              <h3
                className="font-heading text-lg text-shizora-dark mb-2 group-hover:text-shizora-gold transition-colors duration-300 line-clamp-1"
                dangerouslySetInnerHTML={{ __html: product.name }}
              />

              <p className="text-xs text-shizora-gold/80 mb-6 font-medium tracking-wide">
                {formatPrice(product.prices)}
              </p>

              <div className="w-full mt-auto py-3 border border-shizora-gold/30 text-[9px] uppercase tracking-[0.2em] text-shizora-dark font-medium group-hover:bg-shizora-gold group-hover:border-shizora-gold group-hover:text-white transition-all duration-500 relative overflow-hidden flex items-center justify-center">
                <span className="relative z-10 flex items-center gap-2">
                  VIEW PRODUCT
                </span>
                <div className="absolute inset-0 w-0 bg-shizora-gold transition-all duration-500 ease-out group-hover:w-full z-0" />
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    );
  };

  return (
    <section className="relative bg-shizora-light py-16 px-6 lg:px-12 w-full overflow-hidden">
      {/* 3D Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div className="container mx-auto max-w-[1400px] relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-2 block">
              {data?.shop_section_title_1 || "The Collection"}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-shizora-dark font-medium">
              {data?.shop_section_title_2 || "The Latest Expressions"}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="pb-2"
          >
            <Link
              href="/collections"
              className="text-[10px] uppercase tracking-[0.2em] text-shizora-gold hover:text-shizora-dark transition-colors duration-300 flex items-center gap-2 group font-medium"
            >
              Shop All{" "}
              <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                &rarr;
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Products Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard
              key={product.id || index}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
