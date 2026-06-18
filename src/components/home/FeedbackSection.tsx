"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";
import * as THREE from "three";

// Star Icon SVG Component for luxury feel
const Star = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-3 h-3 ${className}`}
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default function FeedbackSection({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const title1 = data.feedback_title_1 || "VOICES";
  const title2 = data.feedback_title_2 || "The Shizora Experience";
  const feedbacks = data.feedbacks || [];

  // Subtle 3D "golden shimmer" background effect
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
    const particlesCount = 50; // Very sparse for minimal distraction
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xcba863, // Shizora Gold
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.002;

      particlesMesh.rotation.y = Math.sin(time) * 0.1;
      particlesMesh.rotation.x = Math.cos(time) * 0.1;

      const positions = particlesMesh.geometry.attributes.position
        .array as Float32Array;
      for (let i = 1; i < particlesCount * 3; i += 3) {
        positions[i] -= 0.001; // Slowly falling like delicate snow/dust
        if (positions[i] < -5) {
          positions[i] = 5;
        }
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      particlesGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Animation variants for staggered card entrance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative bg-shizora-light py-24 px-6 lg:px-12 w-full overflow-hidden">
      {/* 3D Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div
        className="container mx-auto max-w-[1400px] relative z-10"
        ref={containerRef}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-shizora-gold font-medium mb-4 block">
              {title1}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-5xl text-shizora-dark font-medium"
          >
            {title2}
          </motion.h2>
        </div>

        {/* Feedback Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {feedbacks.map((feedback: any, index: number) => {
            const stars = parseInt(feedback.stars_review || "5", 10);

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-[#fcfbf9] border border-shizora-gold/20 p-8 md:p-10 flex flex-col h-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(203,168,99,0.3)] transition-colors duration-500 relative group overflow-hidden"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-8 text-shizora-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < stars ? "text-shizora-gold" : "text-shizora-gold/20"
                      }
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-heading text-lg md:text-xl text-shizora-dark/80 italic leading-relaxed mb-10 flex-grow">
                  {feedback.feedback_description}
                </p>

                {/* User Info with Profile Image */}
                <div className="mt-auto border-t border-shizora-dark/10 pt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-shizora-gold/30 group-hover:border-shizora-gold transition-colors duration-500">
                    <img
                      src={
                        feedback.feedback_image?.url ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
                      }
                      alt={feedback.feedback_user_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs text-shizora-dark font-medium tracking-wide mb-1">
                      {feedback.feedback_user_name}
                    </h4>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-shizora-gold">
                      {feedback.feedback_postion}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
