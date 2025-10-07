"use client";

import { Hero } from "@/components/ui/Hero";
import { FeaturesShowcase } from "@/components/ui/FeaturesShowcase";
import { TeamInvite } from "@/components/ui/TeamInvite";
import { Integrations } from "@/components/ui/Integrations";
import { Features } from "@/components/ui/Features";
import { StatsDemo } from "@/components/ui/StatsDemo";
import { WhyUs } from "@/components/ui/WhyUs";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Testimonials } from "@/components/ui/Testimonials";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const WordCloud = dynamic(() => import("@/components/ui/WordCloud").then(m => m.WordCloud), { ssr: false });

export default function Home() {
  // Home no longer hosts verification overlay

  return (
    <div className="relative overflow-x-hidden">
      {/* Arka plan katmanları */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F5F7FB] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" style={{backgroundImage:"radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block opacity-12" style={{backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px"}} />

      <Hero />

      <FeaturesShowcase />

      <TeamInvite />

      <Integrations />

      <Features />

      <SectionDivider />

      <StatsDemo />

      <SectionDivider />

      <WhyUs />

      <SectionDivider />

      <Testimonials />

      <SectionDivider />

      <WordCloud />

    </div>
  );
}
