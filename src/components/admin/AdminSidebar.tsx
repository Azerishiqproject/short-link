"use client";

import type React from "react";
import { FiUsers, FiTag, FiCreditCard, FiDollarSign, FiLogOut } from "react-icons/fi";

interface SidebarProps {
  active: "users" | "pricing" | "payments" | "withdrawals";
  onChange: (tab: "users" | "pricing" | "payments" | "withdrawals") => void;
  onLogout: () => void;
}

export default function AdminSidebar({ active, onChange, onLogout }: SidebarProps) {
  return (
    <aside className="w-44 shrink-0 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-2 flex flex-col gap-2 sticky top-24 h-[75vh]">
      {([
        { key: "users", label: "Kullanıcılar", icon: <FiUsers className='w-4 h-4' /> },
        { key: "pricing", label: "Fiyatlandırma", icon: <FiTag className='w-4 h-4' /> },
        { key: "payments", label: "Ödemeler", icon: <FiCreditCard className='w-4 h-4' /> },
        { key: "withdrawals", label: "Çekimler", icon: <FiDollarSign className='w-4 h-4' /> },
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
      <div className="mt-auto space-y-2">
        <button onClick={onLogout} className="w-full h-9 rounded-xl border flex items-center justify-center gap-2 px-2.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10">
          <FiLogOut className='w-3.5 h-3.5' /> <span className="text-xs">Çıkış</span>
        </button>
      </div>
    </aside>
  );
}


