"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

export default function HeroSection({ data }: { data: any }) {
  const heroData = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Subtle 3D particle effect for luxury feel
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
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xcba863,
      transparent: true,
      opacity: 0.6,
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

    const animate = (currentTime: number) => {
      requestAnimationFrame(animate);

      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const elapsedTime = currentTime / 1000;

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

      // Floating effect
      particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      particlesGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Split title for word-by-word animation
  const titleWords = heroData.hero_main_title.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-200 w-full overflow-hidden bg-shizora-dark"
    >
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-shizora-dark z-10" />
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url(${heroData.background.url})` }}
        />
      </motion.div>

      {/* 3D Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Content */}
      <motion.div
        className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 uppercase tracking-[0.3em] text-shizora-gold text-[10px] md:text-xs"
        >
          INTRODUCING SHIZORA
        </motion.div>

        <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight tracking-wide font-medium flex flex-wrap justify-center gap-x-4">
          {titleWords.map((word: string, index: number) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: [0.2, 0.65, 0.3, 0.9],
                delay: 0.3 + index * 0.15,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="text-white/80 font-sans text-sm md:text-base lg:text-lg max-w-2xl mb-12 font-light tracking-wide leading-relaxed"
        >
          {heroData.hero_sub_title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full sm:w-auto"
        >
          <Link
            href={heroData.hero_button_1_url || "#"}
            className="group relative px-8 py-4 bg-shizora-gold text-shizora-dark text-xs uppercase tracking-[0.2em] font-semibold overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(203,168,99,0.4)]"
          >
            <span className="relative z-10 transition-colors group-hover:text-white">
              {heroData.hero_button_1}
            </span>
            <div className="absolute inset-0 h-full w-0 bg-shizora-dark transition-all duration-500 ease-out group-hover:w-full z-0" />
            <div className="absolute inset-0 border border-shizora-gold" />
          </Link>

          <Link
            href={heroData.hero_button_2_url || "#"}
            className="group relative px-8 py-4 bg-transparent text-white text-xs uppercase tracking-[0.2em] font-semibold overflow-hidden transition-all"
          >
            <span className="relative z-10 transition-colors group-hover:text-shizora-dark">
              {heroData.hero_button_2}
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white transition-all duration-500 ease-out group-hover:w-full z-0" />
            <div className="absolute inset-0 border border-white/30 transition-colors group-hover:border-white" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
