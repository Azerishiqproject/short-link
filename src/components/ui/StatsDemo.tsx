"use client";
import React from "react";
import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import { Link2, MousePointerClick, Activity } from "lucide-react";
import { BlurSpot } from "@/components/ui/BlurSpot";

export function StatsDemo() {
  return (
    <Section className="py-12 sm:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Contained blur spots */}
        <div className="absolute inset-0 pointer-events-none">
          <BlurSpot className="absolute left-4 sm:left-8 md:left-12 top-8 hidden sm:block" color="#60a5fa" size={160} opacity={0.18} />
          <BlurSpot className="absolute right-4 sm:right-8 md:right-12 top-[200px] sm:top-[300px] hidden md:block" color="#93c5fd" size={180} opacity={0.16} />
          <BlurSpot className="absolute left-1/4 sm:left-1/3 bottom-4 sm:bottom-8 hidden sm:block" color="#3b82f6" size={140} opacity={0.14} />
        </div>
        
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex text-xs sm:text-sm py-1 font-medium items-center gap-2 px-3 sm:px-4  rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-5 sm:mb-6">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300" /> Canlı İstatistik (Demo)
          </span>
          <h2 className="mt-2 sm:mt-4 text-xl sm:text-3xl font-semibold tracking-tight">Kısaltmalar ve Trafik</h2>
          <p className="mt-2 text-sm sm:text-base text-muted">Gerçek kurulumda bu alan backend verileri ile beslenir.</p>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-transparent backdrop-blur-xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] sm:text-[12px] text-muted">Toplam kısaltılan link</div>
                <div className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight font-mono">12,842</div>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-transparent backdrop-blur-xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] sm:text-[12px] text-muted">Toplam tıklama</div>
                <div className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight font-mono">3,274,910</div>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                <MousePointerClick className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-transparent backdrop-blur-xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] sm:text-[12px] text-muted">Sistem durumu</div>
                <div className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-emerald-600">%99.9</div>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          </motion.div>
        </div>

        {/* Funnel Chart - Full Width */}
        <div className="mt-10 sm:mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-transparent backdrop-blur-xl shadow-sm p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Dönüşüm Hunisi</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Kullanıcı yolculuğu ve dönüşüm oranları</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              {/* Funnel levels */}
              {[
                { label: "Ziyaret", value: 10000, width: 100, color: "bg-gradient-to-r from-blue-500 to-blue-600" },
                { label: "Kayıt", value: 7500, width: 85, color: "bg-gradient-to-r from-indigo-500 to-indigo-600" },
                { label: "İlk Link", value: 5200, width: 70, color: "bg-gradient-to-r from-purple-500 to-purple-600" },
                { label: "Aktif Kullanım", value: 3800, width: 55, color: "bg-gradient-to-r from-pink-500 to-pink-600" },
                { label: "Premium", value: 1200, width: 40, color: "bg-gradient-to-r from-red-500 to-red-600" }
              ].map((level, index) => (
                <motion.div
                  key={level.label}
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: `${level.width}%`, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className={`h-14 sm:h-16 ${level.color} rounded-xl sm:rounded-lg flex flex-row items-center justify-between px-4 sm:px-6 text-white font-medium shadow-md w-full`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-lg font-semibold leading-tight">{level.label}</span>
                    <span className="text-[10px] sm:text-sm opacity-90 leading-tight">{level.value.toLocaleString()} kişi</span>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-2xl font-bold leading-tight">{Math.round((level.value / 10000) * 100)}%</div>
                    <div className="text-[10px] sm:text-sm opacity-90 leading-tight">dönüşüm</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Removed pie chart; replaced by right-side network diagram above */}
      </div>
    </Section>
  );
}

export default StatsDemo;


