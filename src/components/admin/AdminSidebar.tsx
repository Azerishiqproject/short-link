"use client";

import type React from "react";
import { useAppDispatch } from "@/store";
import { setActiveSection } from "@/store/slices/referralSlice";
import { FiUsers, FiTag, FiCreditCard, FiDollarSign, FiLogOut, FiEdit, FiUserPlus, FiSettings, FiPercent } from "react-icons/fi";

interface SidebarProps {
  active: "users" | "pricing" | "payments" | "withdrawals" | "support" | "blog" | "referrals";
  onChange: (tab: "users" | "pricing" | "payments" | "withdrawals" | "support" | "blog" | "referrals") => void;
  onLogout: () => void;
}

export default function AdminSidebar({ active, onChange, onLogout }: SidebarProps) {
  const dispatch = useAppDispatch();
  
  return (
    <aside className="w-44 shrink-0 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-2 flex flex-col gap-2 sticky top-24 h-[75vh]">
      {([
        { key: "users", label: "Kullanıcılar", icon: <FiUsers className='w-4 h-4' /> },
        { key: "pricing", label: "Fiyatlandırma", icon: <FiTag className='w-4 h-4' /> },
        { key: "payments", label: "Ödemeler", icon: <FiCreditCard className='w-4 h-4' /> },
        { key: "withdrawals", label: "Çekimler", icon: <FiDollarSign className='w-4 h-4' /> },
        { key: "support", label: "Destek", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 20l.8-3.2A7.7 7.7 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> },
        { key: "blog", label: "Blog", icon: <FiEdit className='w-4 h-4' /> },
        { key: "referrals", label: "Referanslar", icon: <FiUserPlus className='w-4 h-4' /> },
      ] as { key: SidebarProps["active"]; label: string; icon: React.ReactElement }[]).map((item) => (
        <button
          key={item.key}
          className={`w-full h-9 rounded-xl border flex items-center gap-2 px-2.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10 ${active === item.key ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/20' : ''}`}
          onClick={() => onChange(item.key)}
        >
          {item.icon}
          <span className="truncate text-xs">{item.label}</span>
        </button>
      ))}
      
      {/* Referans Oranı Hızlı Ayarları */}
      {active === "referrals" && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <FiPercent className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Hızlı Ayarlar</span>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => {
                onChange("referrals");
                dispatch(setActiveSection("settings"));
              }}
              className="w-full h-8 rounded-lg border flex items-center gap-2 px-2 text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              <FiSettings className="w-3 h-3" />
              <span className="truncate">Oran Ayarları</span>
            </button>
            <button 
              onClick={() => {
                onChange("referrals");
                dispatch(setActiveSection("transactions"));
              }}
              className="w-full h-8 rounded-lg border flex items-center gap-2 px-2 text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              <FiUsers className="w-3 h-3" />
              <span className="truncate">İşlemler</span>
            </button>
            <button 
              onClick={() => {
                onChange("referrals");
                dispatch(setActiveSection("stats"));
              }}
              className="w-full h-8 rounded-lg border flex items-center gap-2 px-2 text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              <FiDollarSign className="w-3 h-3" />
              <span className="truncate">İstatistikler</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-auto space-y-2">
        <button onClick={onLogout} className="w-full h-9 rounded-xl border flex items-center justify-center gap-2 px-2.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10">
          <FiLogOut className='w-3.5 h-3.5' /> <span className="text-xs">Çıkış</span>
        </button>
      </div>
    </aside>
  );
}


