"use client";

import type React from "react";

type SidebarItem = { key: string; label: string; icon: React.ReactElement };

interface SidebarNavProps {
  items: SidebarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  onSettings: () => void;
  onLogout: () => void;
}

export default function SidebarNav({ items, activeKey, onSelect, onSettings, onLogout }: SidebarNavProps) {
  return (
    <aside className="w-44 shrink-0 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-2 flex flex-col gap-2 sticky top-24 h-[75vh]">
      {items.map((t) => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          className={`w-full h-10 rounded-xl border flex items-center gap-2 px-3 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10 ${
            activeKey === t.key ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/20' : ''
          }`}
        >
          {t.icon}
          <span className="truncate text-sm">{t.label}</span>
        </button>
      ))}
      <div className="mt-auto space-y-2">
        <button onClick={onSettings} className={`w-full h-10 rounded-xl border flex items-center gap-2 px-3 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10 ${activeKey==='settings' ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/20' : ''}`}>
          {/* settings icon slot left for caller icons parity; keeping existing layout */}
          <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 4a7.963 7.963 0 00-.27-2l2.12-1.65-2-3.46-2.49 1a8.063 8.063 0 00-1.73-1L14 2h-4l-.57 2.89a8.063 8.063 0 00-1.73 1l-2.49-1-2 3.46L3.88 10a7.963 7.963 0 000 4l-2.12 1.65 2 3.46 2.49-1c.54.4 1.12.74 1.73 1L10 22h4l.57-2.89c.61-.26 1.19-.6 1.73-1l2.49 1 2-3.46L20.06 12z"/></svg>
          <span className="text-sm">Ayarlar</span>
        </button>
        <button onClick={onLogout} className="w-full h-10 rounded-xl border flex items-center gap-2 px-3 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10">
          <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span className="text-sm">Çıkış</span>
        </button>
      </div>
    </aside>
  );
}


