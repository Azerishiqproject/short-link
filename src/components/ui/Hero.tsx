"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { useRouter } from "next/navigation";
// Continuous scrolling image slider
function ContinuousImageSlider() {
  const images = [
    "/hero/1.png", "/hero/3.png", "/hero/4.png", "/hero/5.png", "/hero/6.png",
    "/hero/7.png", "/hero/8.png", "/hero/9.png", "/hero/10.png", "/hero/11.png",
    "/hero/12.png", "/hero/13.png", "/hero/15.png", "/hero/22.png", "/hero/23.png",
    "/hero/24.png", "/hero/25.png", "/hero/26.png", "/hero/27.png", "/hero/29.png",
    "/hero/30.png", "/hero/31.png", "/hero/32.png"
  ];

  // Create seamless loop with proper duplication
  const totalRows = Math.ceil(images.length / 2);
  const duplicatedImages = [...images, ...images, ...images]; // Triple for seamless loop

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-128 overflow-hidden rounded-2xl">
      <div className="p-2 sm:p-3 md:p-4 h-full">
        <div 
          className="relative"
          style={{ 
            animation: 'scrollDown 100s linear infinite',
            height: `${totalRows * 2 * 100}%` // Double height for seamless loop
          }}
        >
          <div className="columns-1 sm:columns-2 gap-2 sm:gap-3 md:gap-4">
            {duplicatedImages.map((src, index) => (
              <div key={index} className="break-inside-avoid mb-2 sm:mb-3 md:mb-4">
                <div className="relative rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={src}
                    alt={`Dashboard preview ${(index % images.length) + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scrollDown {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </div>
  );
}

// Dynamic import for client-side only component
const DynamicImageGrid = dynamic(() => Promise.resolve(ContinuousImageSlider), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-128 overflow-hidden rounded-2xl">
      <div className="p-2 sm:p-3 md:p-4 h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 h-full">
          <div className="relative rounded-lg overflow-hidden bg-gray-200 animate-pulse">
            <div className="w-full h-full bg-gray-300 rounded-lg"></div>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-gray-200 animate-pulse">
            <div className="w-full h-full bg-gray-300 rounded-lg"></div>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-gray-200 animate-pulse">
            <div className="w-full h-full bg-gray-300 rounded-lg"></div>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-gray-200 animate-pulse">
            <div className="w-full h-full bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
});

export function Hero() {
  const [longUrl, setLongUrl] = useState("");
  const router = useRouter();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Submit handler will be wired to backend later
  }

  return (
    <Section className="py-8 sm:py-12 md:py-16 lg:py-20 px-0 pt-24 sm:pt-28" container={false}>
      <div className="relative w-full min-h-screen">
        {/* Background gradients and effects */}
        <div className="pointer-events-none absolute inset-x-4 sm:inset-x-8 md:inset-x-12 -top-6 h-12 sm:h-24 md:h-32 rounded-full blur-3xl opacity-25 bg-gradient-to-r from-indigo-400/40 via-violet-400/30 to-fuchsia-400/40 dark:from-blue-500/20 dark:via-indigo-600/20 dark:to-sky-500/20" />
        
       
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 min-h-screen">
            {/* Left Column - Content */}
            <motion.div 
              className="flex-1 max-w-2xl text-center lg:text-left"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 sm:b-6  sm:pt-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
              >
                Linklerinizi Kısaltın, Gelir Elde Edin
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
              >
                Uzun linklerinizi kısa ve akıllı linklere dönüştürün. Gelişmiş analitik, yüksek CPM oranları ve anında ödeme sistemi ile linklerinizden gelir elde edin.
              </motion.p>

              {/* Stats */}
              <motion.div 
                className="flex justify-center lg:justify-start gap-6 sm:gap-8 mb-6 sm:mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
              >
                {[
                  { value: "12K+", label: "Kısaltılan Link" },
                  { value: "3.2M+", label: "Toplam Tıklama" },
                  { value: "%99.9", label: "Uptime" }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.4 + index * 0.05, ease: "easeInOut" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => router.push("/register")}
                    className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Hemen Başla
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    size="lg"
                    className="px-6 sm:px-8 py-3 bg-transparent text-foreground border-2 border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-medium w-full sm:w-auto transition-all duration-200"
                  >
                    Demo İzle
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Image Slider */}
            <motion.div 
              className="flex-1 max-w-2xl w-full lg:w-auto"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            >
              <motion.div 
                className="relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-fuchsia-500/15"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative rounded-2xl border border-white/25 dark:border-white/20 bg-white/85 dark:bg-white/10 backdrop-blur-xl shadow-sm overflow-hidden">
                  <DynamicImageGrid />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Hero;


