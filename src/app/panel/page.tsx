"use client";

import { Section } from "@/components/ui/Section";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { PanelHeader, PanelContent } from "@/components/panel";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { 
  fetchLinksThunk, 
  fetchStatsThunk
} from "@/store/slices/linksSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { logout } from "@/store/slices/authSlice";

type ToolKey = "overview" | "shorten" | "links" | "analytics" | "settings";

export default function PanelPage() {
  const { user, token, hydrated } = useAppSelector((s) => s.auth);
  const { links, totalClicks, totalEarnings, earningPerClick } = useAppSelector((s) => s.links);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<ToolKey>("overview");

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  useEffect(() => {
    if (!hydrated || !token) return;
    dispatch(fetchLinksThunk(token));
    dispatch<any>(fetchStatsThunk(token));
  }, [hydrated, token, dispatch]);

  // Refresh stats periodically to show real-time click counts
  useEffect(() => {
    if (!hydrated || !token) return;
    const interval = setInterval(() => {
      dispatch<any>(fetchStatsThunk(token));
    }, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [hydrated, token, dispatch]);

  if (!hydrated) {
    return null;
  }

  // Calculate total earnings
  const calculatedEarnings = totalEarnings ?? ((links.reduce((sum, link) => sum + link.clicks, 0)) * (earningPerClick ?? 0.02));

  // Generate sample data for charts (in real app, this would come from API)
  const clickData = [
    { date: '2024-01-15', clicks: 12 },
    { date: '2024-01-16', clicks: 19 },
    { date: '2024-01-17', clicks: 8 },
    { date: '2024-01-18', clicks: 25 },
    { date: '2024-01-19', clicks: 31 },
    { date: '2024-01-20', clicks: 18 },
    { date: '2024-01-21', clicks: 22 },
  ];

  const countryData = [
    { country: 'Türkiye', count: 45, percentage: '35.2' },
    { country: 'Almanya', count: 23, percentage: '18.0' },
    { country: 'Fransa', count: 18, percentage: '14.1' },
    { country: 'İngiltere', count: 15, percentage: '11.7' },
    { country: 'İtalya', count: 12, percentage: '9.4' },
    { country: 'Amerika', count: 8, percentage: '6.3' },
    { country: 'Kanada', count: 5, percentage: '3.9' },
    { country: 'Japonya', count: 4, percentage: '3.1' },
    { country: 'Avustralya', count: 3, percentage: '2.3' },
    { country: 'Brezilya', count: 2, percentage: '1.6' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 dark:opacity-10" style={{ backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20" />
      
      {/* Minimal BlurSpot effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BlurSpot className="absolute left-8 top-16 hidden lg:block" color="#3b82f6" size={120} opacity={0.08} />
        <BlurSpot className="absolute right-8 top-32 hidden lg:block" color="#8b5cf6" size={100} opacity={0.06} />
      </div>

      {/* Header */}
      <Section className="pt-24 sm:pt-28 pb-6">
        <div className="mx-auto max-w-7xl">
          <PanelHeader userName={user?.name} userEmail={user?.email} />
        </div>
      </Section>

      {/* Top nav + Content (full height card) */}
      <Section className="pb-6">
        <div className="mx-auto max-w-7xl">
          {/* Top nav */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {([
              { key: "overview", label: "Genel Bakış" },
              { key: "shorten", label: "Kısalt" },
              { key: "links", label: "Linkler" },
              { key: "analytics", label: "Analitik" },
              { key: "settings", label: "Ayarlar" },
            ] as { key: ToolKey; label: string }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTool(t.key)}
                className={`h-9 w-[110px] justify-center rounded-lg border text-xs transition ${
                  activeTool === t.key
                    ? "bg-slate-900 text-white dark:bg-blue-600 border-slate-900 dark:border-blue-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Dashboard card */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-5 shadow-sm min-h-[70vh] flex flex-col">
            <div className="flex-1">
              <PanelContent
                activeTool={activeTool}
                totalLinks={links.length}
                totalClicks={totalClicks ?? links.reduce((sum, link) => sum + link.clicks, 0)}
                totalEarnings={calculatedEarnings}
                clickData={clickData}
                countryData={countryData}
              />
            </div>

            {/* Bottom actions */}
            <div className="mt-6 border-t border-black/10 dark:border-white/10 pt-4 flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setActiveTool("settings")}>Ayarlar</Button>
              <Button onClick={() => { dispatch(logout()); router.replace("/"); }}>Çıkış Yap</Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}