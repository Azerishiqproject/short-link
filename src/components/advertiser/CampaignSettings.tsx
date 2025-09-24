"use client";

import Settings from "@/components/panel/Settings";
import TopUpModal from "./TopUpModal";
import { useAppSelector } from "@/store";
import { useState } from "react";

export default function CampaignSettings() {
  const { user } = useAppSelector((s)=>s.auth);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number | undefined>(undefined);
  const [tab, setTab] = useState<"wallet" | "profile">("wallet");
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 relative overflow-hidden">
        <div className="absolute right-6 top-6 w-36 h-36 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-2xl" />
        <div className="flex items-center justify-between relative">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Profil ve güvenlik</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Ayarlar</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Hesap bilgilerinizi ve cüzdanınızı buradan yönetin.</p>
          </div>
          <button onClick={()=>{ setTopupAmount(undefined); setShowTopup(true); }} className="h-10 px-4 rounded-xl bg-blue-600 text-white text-xs shadow-sm hover:brightness-110">Bakiye Yükle</button>
        </div>
        {/* Tabs */}
        <div className="mt-4 flex items-center gap-2">
          <button onClick={()=>setTab("wallet")} className={`h-9 px-3 rounded-lg text-xs border ${tab==='wallet' ? 'bg-slate-900 text-white dark:bg-blue-600 border-slate-900 dark:border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'}`}>Bakiye</button>
          <button onClick={()=>setTab("profile")} className={`h-9 px-3 rounded-lg text-xs border ${tab==='profile' ? 'bg-slate-900 text-white dark:bg-blue-600 border-slate-900 dark:border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'}`}>Kullanıcı</button>
        </div>
      </div>

      {/* Content */}
      {tab === 'wallet' ? (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 bg-slate-50/70 dark:bg-slate-900/40">
            <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Kullanılabilir</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">₺{(user?.display_available ?? user?.available_balance ?? 0).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Rezerve</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">₺{(user?.display_reserved ?? user?.reserved_balance ?? 0).toLocaleString()}</div>
                  </div>
                </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[100,250,500].map((v)=> (
                <button key={v} onClick={()=>{ setTopupAmount(v); setShowTopup(true); }} className="h-9 rounded-lg border border-black/10 dark:border-white/10 text-xs">₺{v}</button>
              ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={()=>setShowTopup(true)} className="h-10 px-4 rounded-lg bg-blue-600 text-white text-xs">Bakiye Artır</button>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Bakiye, kampanya bütçelerine rezerve edilir. Kalan rezerve tutar iade edilir.</p>
            </div>
            <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">İpucu</div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                <li>Minimum yükleme önerisi: ₺100</li>
                <li>Günlük harcama limiti ayarlayabilirsiniz.</li>
                <li>Kalan bütçe kampanya durdurulduğunda iade edilir.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 shadow-sm">
          <Settings />
        </div>
      )}

      {showTopup && (
        <TopUpModal onClose={()=>setShowTopup(false)} initialAmount={topupAmount} />
      )}
    </div>
  );
}
