"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";

export default function AboutSection({ data }: { data: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Small 3D floating dust effect specifically for the image container to give it a magical "forest" vibe
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio will be updated on resize
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    const updateSize = () => {
      if (canvasRef.current) {
        const { width, height } =
          canvasRef.current.parentElement!.getBoundingClientRect();
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    updateSize();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 40; // Kept small for a subtle effect
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    // Create a soft glowing material
    const material = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xcba863, // Shizora Gold
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 2;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Gentle floating animation
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Slowly move particles up
      const positions = particlesMesh.geometry.attributes.position
        .array as Float32Array;
      for (let i = 1; i < particlesCount * 3; i += 3) {
        positions[i] += 0.002;
        if (positions[i] > 2.5) {
          positions[i] = -2.5; // Reset to bottom
        }
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animationFrameId);
      particlesGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Format the title to make "forest." italic and gold, matching the design exactly
  const formatTitle = (title: string) => {
    if (!title) return null;
    const parts = title.split(/(forest\.)/i);
    return parts.map((part, index) =>
      part.toLowerCase() === "forest." ? (
        <span key={index} className="italic text-shizora-gold font-light">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#e8ded0] py-16 lg:py-20 px-6 lg:px-12 w-full overflow-hidden"
    >
      <div className="container mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column: Image with 3D overlay and Parallax */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              className="relative w-full max-w-md aspect-[4/5] overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.img
                src={
                  data.about_image?.url ||
                  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000"
                }
                alt={data.about_image?.alt || "About Shizora"}
                className="w-full h-[120%] object-cover absolute top-[-10%] left-0"
                style={{ y: imageY }}
              />
              {/* 3D Magic Dust Overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
              />
              {/* Subtle inner shadow/vignette */}
              <div className="absolute inset-0 z-20 shadow-[inset_0_0_50px_rgba(0,0,0,0.2)] pointer-events-none" />
            </motion.div>
          </div>

          {/* Right Column: Text Content */}
          <div className="flex flex-col justify-center max-w-lg lg:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-4 block">
                {data.about_title_1 || "THE MANIFESTO"}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-heading text-4xl md:text-5xl text-shizora-dark mb-6 leading-[1.1] tracking-wide"
            >
              {formatTitle(
                data.about_title_2 || "Born from the mystery of the forest.",
              )}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs md:text-sm text-shizora-dark/70 font-sans tracking-wide leading-relaxed mb-8"
              dangerouslySetInnerHTML={{
                __html: data.about_short_description || "",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link
                href={data.about_button_url || "#"}
                className="inline-block px-8 py-3.5 border border-shizora-gold/50 text-shizora-dark text-[9px] uppercase tracking-[0.2em] font-medium hover:bg-shizora-gold hover:border-shizora-gold hover:text-white transition-all duration-500 hover:shadow-[0_0_20px_rgba(203,168,99,0.3)] relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {data.about_button || "READ THE MANIFESTO"}
                </span>
                <div className="absolute inset-0 h-full w-0 bg-shizora-gold transition-all duration-500 ease-out group-hover:w-full z-0" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
