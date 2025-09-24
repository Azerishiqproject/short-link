"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { BlurSpot } from "@/components/ui/BlurSpot";

export function FeaturesShowcase() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    // Determine mobile once on mount to avoid hydration mismatch
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 640);
    }
  }, []);
  const cpmFeatures = [
    "Ücretsiz bir şekilde kayıt olun",
    "Herhangi bir bağlantı kısaltın", 
    "Kısaltığınız bağlantıyı paylaşın"
  ];

  const paymentMethods = [
    "Papara - Alt limit 100 TL",
    "Payeer - Alt limit 100 TL",
    "Litecoin - Alt limit 100 TL",
    "Banka Transferi - Alt limit 100 TL"
  ];

  return (
    <>
      {/* First Section - High CPM Rates */}
      <Section className="py-10 sm:py-16 overflow-x-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Contained blur spots */}
          <div className="absolute inset-0 pointer-events-none">
            <BlurSpot className="absolute left-4 sm:left-8 md:left-12 top-8 hidden sm:block" color="#60a5fa" size={160} opacity={0.18} />
            <BlurSpot className="absolute right-4 sm:right-8 md:right-12 top-[200px] sm:top-[300px] hidden md:block" color="#93c5fd" size={180} opacity={0.16} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center overflow-x-hidden">
            {/* Left Column - Content */}
            <motion.div 
              className="text-center lg:text-left overflow-x-hidden"
              style={{ contain: "layout paint" }}
              initial={{ opacity: 0, x: isMobile ? 0 : -100, y: isMobile ? 20 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6"
                initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 10 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
              >
                Yüksek CPM Oranları
              </motion.h2>
              
              <motion.p 
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
                initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 8 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
              >
                Rekabetçi CPM oranlarımızla kazancınızı maksimize edin. Üyelik işlemleri kolay ve hızlı, 
                ödemeler anında hesabınıza yansır. Sektördeki en yüksek oranları sunuyoruz.
              </motion.p>

              {/* Features List */}
              <motion.div 
                className="space-y-4 mb-8 overflow-x-hidden"
                initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 6 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
              >
                {cpmFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: 0.4 + index * 0.05, ease: "easeInOut" }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="w-6 h-6 bg-blue-500 flex items-center justify-center flex-shrink-0" 
                      style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.1 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                    <span className="text-foreground font-medium text-sm">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p 
                className="text-lg font-semibold text-primary"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
              >
                Bol kazançlar dileriz.
              </motion.p>
            </motion.div>

            {/* Right Column - Visual Mockup */}
            <motion.div 
              className="relative overflow-hidden max-w-full"
              style={{ contain: "layout paint" }}
              initial={{ opacity: 0, x: isMobile ? 0 : 100, y: isMobile ? 20 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            >
              <motion.div 
                className="relative mx-auto w-full max-w-lg overflow-hidden max-w-full"
                whileHover={{ scale: 1.0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 12 : 0 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
                >
                  <Image
                    src="/hero/featuresshowcase1.png"
                    alt="Dashboard Preview - High CPM Rates"
                    width={600}
                    height={400}
                    className="w-full max-w-full h-auto object-cover rounded-2xl"
                    priority
                  />
                </motion.div>
                
                {/* Theme Icons */}
                <motion.div 
                  className="absolute -top-6 -left-6 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0.4, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                </motion.div>
                
                <motion.div 
                  className="absolute -top-4 -right-8 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 0.5, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1, rotate: -10 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Second Section - Instant Payment */}
      <Section className="py-10 sm:py-16 overflow-x-hidden ">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Contained blur spots */}
          <div className="absolute inset-0 pointer-events-none">
            <BlurSpot className="absolute left-4 sm:left-8 md:left-12 top-8 hidden sm:block" color="#3b82f6" size={160} opacity={0.18} />
            <BlurSpot className="absolute right-4 sm:right-8 md:right-12 top-[200px] sm:top-[300px] hidden md:block" color="#7dd3fc" size={180} opacity={0.16} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Visual Mockup */}
            <motion.div 
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.div 
                className="relative mx-auto w-full max-w-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
                >
                  <Image
                    src="/hero/featuresshowcase1.png"
                    alt="Dashboard Preview - Instant Payment"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover rounded-2xl"
                    priority
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div 
              className="text-center lg:text-left order-1 lg:order-2"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            >
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
              >
                Ödeme Anında Hesabınızda!
              </motion.h2>
              
              <motion.p 
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4, ease: "easeInOut" }}
              >
                Anında ödeme sistemi ile kazancınızı hemen çekin. Sektördeki en hızlı ödeme altyapısı 
                ile güvenli ve hızlı işlemler gerçekleştirin. Minimum limitler düşük, işlemler anında.
              </motion.p>

              {/* Payment Methods List */}
              <motion.div 
                className="space-y-4 mb-8"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
              >
                {paymentMethods.map((method, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: 0.6 + index * 0.05, ease: "easeInOut" }}
                    whileHover={{ x: -5 }}
                  >
                    <motion.div 
                      className="w-6 h-6 bg-blue-500 flex items-center justify-center flex-shrink-0" 
                      style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.1 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                    <span className="text-foreground font-medium text-sm">{method}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p 
                className="text-lg font-semibold text-primary"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.7, ease: "easeInOut" }}
              >
                Hızlı ve güvenli ödemeler için bizi tercih edin.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default FeaturesShowcase;
