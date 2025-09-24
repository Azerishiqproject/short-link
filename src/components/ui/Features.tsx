"use client";
import React from "react";
import { Section } from "@/components/ui/Section";
import Image from "next/image";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Zap, ShieldCheck, BarChart3, Link as LinkIcon, Code, LineChart } from "lucide-react";
import { motion } from "framer-motion";

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const features: Feature[] = [
  { title: "Hızlı ve Güvenli", description: "Milisaniyeler içinde yönlendirme.", icon: Zap },
  { title: "Güçlü Güvenlik", description: "En üst düzey güvenlik önlemleri.", icon: ShieldCheck },
  { title: "İstatistik Takibi", description: "Ülke ve cihaz kırılımı.", icon: BarChart3 },
  { title: "Markalı Bağlantı", description: "Özel domain ve slug.", icon: LinkIcon },
  { title: "API & Otomasyon", description: "Geliştiriciler için esnek API.", icon: Code },
  { title: "Gelir Performansı", description: "EPC ve toplam kazanç.", icon: LineChart },
];

export function Features() {
  return (
    <Section className="py-20 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* soft background pattern */}
        {/* Contained blur spots */}
        <div className="absolute inset-0 pointer-events-none">
          <BlurSpot className="absolute left-4 sm:left-8 md:left-12 top-10 hidden sm:block" color="#60a5fa" size={240} opacity={0.22} />
          <BlurSpot className="absolute right-4 sm:right-8 md:right-12 top-[280px] sm:top-[380px] hidden md:block" color="#93c5fd" size={280} opacity={0.20} />
          <BlurSpot className="absolute left-1/4 sm:left-1/3 bottom-4 sm:bottom-8" color="#3b82f6" size={320} opacity={0.16} />
        </div>
        {/* Header with subtle badge */}
        <div className="text-center">
          <span className="inline-flex text-sm py-1 font-medium items-center gap-2 px-4  rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-6">
            <span className="size-1.5 rounded-full bg-indigo-500" />
            Öne Çıkanlar
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Sizi Öne Taşıyan Özellikler
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Hızlı kurulum, güçlü güvenlik ve ayrıntılı analitik ile tek platform.
          </p>
        </div>

        {/* 2x3 icon cards like the reference */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.06, ease: "easeOut" }}
                className="rounded-2xl border border-white/25 bg-gradient-to-br from-indigo-50/70 via-violet-50/70 to-fuchsia-50/70 dark:from-white/[0.06] dark:via-white/[0.06] dark:to-white/[0.06] backdrop-blur-xl shadow-sm p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold tracking-tight">{f.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    <div className="mt-4 inline-flex items-center text-[12px] text-foreground/70">
                      İncele
                      <svg className="ml-1 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export default Features;


