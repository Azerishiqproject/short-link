"use client";
import React from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  verified: boolean;
};

const items: Testimonial[] = [
  {
    name: "Elif Kaya",
    role: "Ürün Yöneticisi",
    company: "TechCorp",
    avatar: "https://i.pravatar.cc/120?img=1",
    quote: "Kısaltma ve analitik akışımızı 1 günde kurduk. Panel sade ve çok hızlı. Müşteri memnuniyetimiz %40 arttı.",
    rating: 5,
    verified: true,
  },
  {
    name: "Mert Arslan",
    role: "Geliştirici",
    company: "StartupX",
    avatar: "https://i.pravatar.cc/120?img=15",
    quote: "API ile entegre etmek basitti. Gerçek zamanlı metrikler kararlarımızı hızlandırdı. Geliştirme süremiz yarıya indi.",
    rating: 5,
    verified: true,
  },
  {
    name: "Zeynep Türk",
    role: "Pazarlama Uzmanı",
    company: "Digital Agency",
    avatar: "https://i.pravatar.cc/120?img=5",
    quote: "Ülke/cihaz kırılımı harika. Kampanya optimizasyonumuz belirgin şekilde arttı. ROI'miz %60 yükseldi.",
    rating: 5,
    verified: true,
  },
  {
    name: "Ahmet Yılmaz",
    role: "CEO",
    company: "E-commerce Plus",
    avatar: "https://i.pravatar.cc/120?img=8",
    quote: "Link yönetimi artık çok kolay. Müşteri geri bildirimlerimiz çok olumlu. Kesinlikle tavsiye ederim.",
    rating: 5,
    verified: true,
  },
  {
    name: "Selin Demir",
    role: "Analist",
    company: "Data Insights",
    avatar: "https://i.pravatar.cc/120?img=12",
    quote: "Detaylı raporlama özellikleri mükemmel. Veri analizi süreçlerimiz çok daha verimli hale geldi.",
    rating: 5,
    verified: true,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  // Auto-play functionality
  React.useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Section className="py-16 sm:py-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <BlurSpot className="absolute -left-16 top-8 hidden md:block" color="#6366f1" size={200} opacity={0.08} />
        <BlurSpot className="absolute -right-16 top-32 hidden lg:block" color="#8b5cf6" size={180} opacity={0.06} />
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-6">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Doğrulanmış Kullanıcılar</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerçek kullanıcı deneyimlerini keşfedin
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative mb-16">
          {/* Main Slider */}
          <div className="relative overflow-hidden rounded-xl">
            <motion.div 
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {items.map((testimonial, index) => (
                <div key={testimonial.name} className="w-full flex-shrink-0">
                  <div className="relative p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl">
                    {/* Quote */}
                    <blockquote className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {testimonial.name}
                          </h4>
                          {testimonial.verified && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {testimonial.role} • {testimonial.company}
                        </p>
                      </div>
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Simple Dots Navigation */}
          <div className="flex justify-center gap-1 mt-6">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-blue-600 dark:bg-blue-400 w-6' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Simple Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { label: "Memnun Müşteri", value: "10K+" },
            { label: "Ortalama Puan", value: "4.9/5" },
            { label: "Başarı Oranı", value: "%99.8" },
            { label: "Destek Süresi", value: "7/24" }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

export default Testimonials;


