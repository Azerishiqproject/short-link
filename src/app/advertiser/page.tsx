"use client";

import { Section } from "@/components/ui/Section";
import type React from "react";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { AdvertiserHeader, AdvertiserContent } from "@/components/advertiser";
import SidebarNav from "@/components/panel/SidebarNav";
import { Button } from "@/components/ui/Button";
import { logout } from "@/store/slices/authSlice";
import { FiHome, FiPlayCircle, FiBarChart2, FiCreditCard, FiSettings, FiLogOut } from "react-icons/fi";
import { fetchMeThunk } from "@/store/slices/authSlice";

type AdvertiserToolKey = "overview" | "campaigns" | "analytics" | "billing" | "settings";

export default function AdvertiserPage() {
  const { user, token, hydrated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<AdvertiserToolKey>("overview");

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "advertiser") {
      router.replace("/panel");
      return;
    }
  }, [hydrated, token, user?.role, router]);

  // Fetch wallet once on first valid render
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    if (!hydrated || !token || user?.role !== "advertiser") return;
    fetchedRef.current = true;
    dispatch<any>(fetchMeThunk()).catch(()=>{});
  }, [hydrated, token, user?.role, dispatch]);

  if (!hydrated) {
    return null;
  }

  // Mock data - gerçek uygulamada API'den gelecek
  const totalCampaigns = 3;
  const totalSpent = 2450;
  const clickRate = 3.2;

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
          <AdvertiserHeader userName={user?.name} userEmail={user?.email} available={user?.display_available ?? user?.available_balance ?? 0} reserved={user?.display_reserved ?? user?.reserved_balance ?? 0} />
        </div>
      </Section>

      {/* Mini navbar + Content */}
      <Section className="pb-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-6">
            {/* Mini navbar with labels (SidebarNav) */}
            <SidebarNav
              items={([
                { key: "overview", label: "Genel Bakış", icon: <FiHome className='w-4 h-4' /> },
                { key: "campaigns", label: "Kampanyalar", icon: <FiPlayCircle className='w-4 h-4' /> },
                { key: "analytics", label: "Analitik", icon: <FiBarChart2 className='w-4 h-4' /> },
                { key: "billing", label: "Faturalama", icon: <FiCreditCard className='w-4 h-4' /> },
              ] as { key: string; label: string; icon: React.ReactElement }[])}
              activeKey={activeTool}
              onSelect={(k)=>setActiveTool(k as AdvertiserToolKey)}
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
                  <AdvertiserContent
                    activeTool={activeTool}
                    totalCampaigns={totalCampaigns}
                    totalSpent={totalSpent}
                    clickRate={clickRate}
                  />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
