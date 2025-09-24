"use client";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { ShieldCheck, Zap, Trophy, LineChart, Lock, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export function WhyUs() {
  return (
    <Section className="py-16 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Contained blur spots */}
        <div className="absolute inset-0 pointer-events-none">
          <BlurSpot className="absolute left-4 sm:left-8 md:left-12 top-8 hidden sm:block" color="#60a5fa" size={240} opacity={0.22} />
          <BlurSpot className="absolute right-4 sm:right-8 md:right-12 top-[200px] sm:top-[260px] hidden md:block" color="#93c5fd" size={280} opacity={0.20} />
          <BlurSpot className="absolute left-1/4 sm:left-1/3 bottom-4 sm:bottom-8" color="#3b82f6" size={320} opacity={0.16} />
        </div>
        <div className="mb-8 sm:mb-10">
          <span className="inline-flex text-sm py-1 font-medium items-center gap-2 px-4  rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-6">
            Neden Biz?
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">
            Güvenli, hızlı ve ölçülebilir kısaltma altyapısı
          </h2>
          <p className="mt-3 text-muted-foreground">
            Sade bir arayüzün arkasında modern, ölçeklenebilir ve güvenli bir mimari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 items-start">
          {/* Left: Cards */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {[
              {
                title: "Kurumsal güvenlik",
                desc: "JWT, oran sınırlama ve coğrafi filtreleme.",
                Icon: Lock,
                badge: "Güvenlik",
                color: "emerald",
              },
              {
                title: "Yüksek performans",
                desc: "Milisaniye yönlendirme ve akıllı önbellek.",
                Icon: Rocket,
                badge: "Hız",
                color: "indigo",
              },
              {
                title: "Gelişmiş analitik",
                desc: "Ülke, cihaz ve gelir tahmini metrikleri.",
                Icon: LineChart,
                badge: "Analitik",
                color: "violet",
              },
              {
                title: "Kolay kullanım",
                desc: "Özel slug, yönetim paneli ve API erişimi.",
                Icon: Zap,
                badge: "Kullanım",
                color: "sky",
              },
            ].map(({ title, desc, Icon, badge, color }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                className="relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-fuchsia-500/15"
              >
                <div className="relative rounded-2xl border border-white/20 bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-${color}-500/10 text-${color}-600 flex items-center justify-center shrink-0` as any}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 whitespace-nowrap">{badge}</span>
                        <span className="font-semibold tracking-tight text-base sm:text-lg leading-tight">{title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          </motion.div>

          {/* Right: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/20 bg-white/70 dark:bg-white/10 shadow-sm"
          >
            <Image
              src="https://images.newscientist.com/wp-content/uploads/2025/09/08130337/SEI_265233678.jpg"
              alt="Dashboard"
              fill
              className="object-contain p-6"
            />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

export default WhyUs;


