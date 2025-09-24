"use client";
import React from "react";
import { Section } from "@/components/ui/Section";
import WordCloudLib from "react-d3-cloud";
import { motion } from "framer-motion";
import { BlurSpot } from "@/components/ui/BlurSpot";

type CloudWord = { text: string; value: number };

const baseWords: CloudWord[] = [
  { text: "Kısa Bağlantı", value: 220 },
  { text: "Hızlı Yönlendirme", value: 165 },
  { text: "Güvenilir", value: 155 },
  { text: "Gerçek Zamanlı", value: 145 },
  { text: "Ülke Hedefleme", value: 135 },
  { text: "Cihaz Hedefleme", value: 125 },
  { text: "Kazanç", value: 175 },
  { text: "EPC", value: 120 },
  { text: "Analitik", value: 160 },
  { text: "Panel", value: 110 },
  { text: "API Entegrasyonu", value: 115 },
  { text: "Kampanya", value: 130 },
  { text: "Takip", value: 118 },
  { text: "Özel Domain", value: 125 },
  { text: "Markalı Link", value: 135 },
  { text: "UTM", value: 105 },
  { text: "QR", value: 95 },
  { text: "Paylaş", value: 128 },
  { text: "Dönüşüm", value: 122 },
  { text: "Performans", value: 140 },
  { text: "SEO", value: 100 },
  { text: "Link Takibi", value: 150 },
];

const extraWords: CloudWord[] = [
  { text: "Dashboard", value: 105 },
  { text: "Analytics", value: 115 },
  { text: "Redirect", value: 98 },
  { text: "Webhook", value: 84 },
  { text: "Raporlama", value: 96 },
  { text: "Grafikler", value: 90 },
  { text: "Segmente Et", value: 88 },
  { text: "Kopyala", value: 92 },
  { text: "Bağlantı Paylaş", value: 102 },
  { text: "Güncel Oran", value: 86 },
  { text: "Önbellek", value: 90 },
  { text: "Oran Sınırı", value: 82 },
  { text: "JWT", value: 80 },
  { text: "Token", value: 82 },
  { text: "Spam Koruma", value: 78 },
  { text: "Cihaz Türü", value: 85 },
  { text: "Hedef Kitle", value: 100 },
  { text: "A/B Test", value: 92 },
  { text: "Davet", value: 70 },
  { text: "Ekip", value: 72 },
];

// Triple dataset size by adding lightweight variants
const variantWords: CloudWord[] = baseWords.map((w, i) => ({
  text: `${w.text}${i % 3 === 0 ? " Pro" : i % 3 === 1 ? " 2.0" : " Lite"}`,
  value: Math.max(50, Math.floor(w.value * 0.55)),
}));

const words: CloudWord[] = [...baseWords, ...extraWords, ...variantWords];

export function WordCloud() {
  return (
    <Section className="pt-12 sm:pt-20 pb-0 pb-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Contained blur spots */}
        <div className="absolute inset-0 pointer-events-none">
          <BlurSpot className="absolute left-4 sm:left-8 md:left-12 top-10 hidden sm:block" color="#60a5fa" size={240} opacity={0.18} />
          <BlurSpot className="absolute right-4 sm:right-8 md:right-12 top-[200px] sm:top-[260px] hidden md:block" color="#93c5fd" size={280} opacity={0.16} />
        </div>
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full border border-black/10 bg-white/80 shadow-soft">
            Word Cloud
          </span>
          <h3 className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight">Öne çıkan kelimeler</h3>
          <p className="mt-2 text-muted-foreground text-sm">Site temasına uygun anahtar kavramlar</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-8 rounded-2xl border border-gray-200 bg-gray dark:bg-white/10 backdrop-blur-xl p-4 sm:p-6 shadow-sm"
        >
          <motion.div
            initial={{ opacity: 0.9, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mx-auto max-w-5xl"
          >
            <WordCloudLib
              data={words}
              width={900}
              height={460}
              font="Inter, system-ui, sans-serif"
              fontSize={(w: CloudWord) => Math.max(10, Math.min(54, w.value / 3.2))}
              rotate={(w: CloudWord) => {
                const hash = Array.from(w.text).reduce((a, c) => a + c.charCodeAt(0), 0);
                return hash % 2 === 0 ? 0 : 270;
              }}
              padding={1}
              spiral="archimedean"
              // Harmonized qualitative palette (inspired by ColorBrewer Set2)
              fill={(w: CloudWord, i: number) => ["#66C2A5", "#FC8D62", "#8DA0CB", "#E78AC3", "#A6D854"][i % 5]}
            />
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

export default WordCloud;


