"use client";

import { Section } from "@/components/ui/Section";
import type React from "react";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { PanelHeader, PanelContent } from "@/components/panel";
import SidebarNav from "@/components/panel/SidebarNav";
import UserBudget from "@/components/panel/UserBudget";
import { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { 
  fetchLinksThunk, 
  fetchStatsThunk,
  fetchTrendThunk,
  fetchGeoThunk,
} from "@/store/slices/linksSlice";
import { fetchMeThunk } from "@/store/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { FiHome, FiScissors, FiDollarSign, FiSettings, FiLogOut } from "react-icons/fi";

type ToolKey = "overview" | "shorten" | "links" | "analytics" | "budget" | "settings";

function SearchParamsSync({ onTabChange }: { onTabChange: (tab: ToolKey) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'shorten', 'budget', 'settings'].includes(tab)) {
      onTabChange(tab as ToolKey);
    }
  }, [searchParams, onTabChange]);
  return null;
}

export default function PanelPage() {
  const { user, token, hydrated } = useAppSelector((s) => s.auth);
  const { links, totalClicks, totalEarnings, earningPerClick, trend, geo } = useAppSelector((s) => s.links);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<ToolKey>("overview");
  const [overviewDays, setOverviewDays] = useState<number>(7);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  // URL parametresine göre tab açma, Suspense içinde ayrı bileşende senkronize ediliyor

  useEffect(() => {
    if (!hydrated || !token) return;
    console.log("Panel: Loading data...");
    dispatch(fetchLinksThunk({ token, page: 1, limit: 10 }));
    dispatch<any>(fetchStatsThunk(token));
    dispatch<any>(fetchTrendThunk({ token, days: overviewDays }));
    dispatch<any>(fetchGeoThunk({ token, days: overviewDays }));
    dispatch<any>(fetchMeThunk()); // Kullanıcı verilerini yükle
  }, [hydrated, token, overviewDays, dispatch]);

  // Removed periodic refresh; fetch only on page load/refresh

  if (!hydrated) {
    return null;
  }

  // Toplam kazancı kullanıcıdan (earned_balance) al; yoksa backend stats veya son çare olarak clicks*rate
  const calculatedEarnings = (user?.earned_balance ?? undefined) ?? totalEarnings ?? ((links.reduce((sum, link) => sum + link.clicks, 0)) * (earningPerClick ?? 0.02));

  // Use backend-provided trend; fallback to empty
  const clickData = (trend || []).map(d => ({ date: d.date, clicks: d.clicks }));

  const countryData = geo || [];

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

      {/* Mini navbar + Content */}
      <Section className="pb-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-6">
            {/* Mini navbar with labels */}
            <SidebarNav
              items={([
                { key: "overview", label: "Genel Bakış", icon: <FiHome className='w-4 h-4' /> },
                { key: "shorten", label: "Kısalt", icon: <FiScissors className='w-4 h-4' /> },
                { key: "budget", label: "Bütçe", icon: <FiDollarSign className='w-4 h-4' /> },
              ] as { key: ToolKey; label: string; icon: React.ReactElement }[])}
              activeKey={activeTool}
              onSelect={(k)=>setActiveTool(k as ToolKey)}
              onSettings={()=>setActiveTool('settings')}
              onLogout={()=>{ dispatch(logout()); router.replace('/'); }}
            />

            {/* Content area */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="mb-3 text-xs text-slate-600 dark:text-slate-400">
                Anasayfa / <span className="capitalize">{activeTool}</span>
              </div>
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 shadow-sm min-h-[75vh]">
                {/* Range selector moved into StatsOverview */}
                <Suspense fallback={null}>
                  <SearchParamsSync onTabChange={(tab)=>setActiveTool(tab)} />
                </Suspense>
                {activeTool === "budget" ? (
                  <UserBudget />
                ) : (
                  <PanelContent
                    activeTool={activeTool}
                    totalLinks={links.length}
                    totalClicks={totalClicks ?? links.reduce((sum, link) => sum + link.clicks, 0)}
                    totalEarnings={calculatedEarnings}
                    clickData={clickData}
                    countryData={countryData}
                    days={overviewDays}
                    onDaysChange={(d)=>setOverviewDays(d)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}