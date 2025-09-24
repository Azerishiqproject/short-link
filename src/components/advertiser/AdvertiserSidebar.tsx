"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";

type AdvertiserToolKey = "overview" | "campaigns" | "analytics" | "billing" | "settings";

interface AdvertiserSidebarProps {
  activeTool: AdvertiserToolKey;
  onToolChange: (tool: AdvertiserToolKey) => void;
}

export default function AdvertiserSidebar({ activeTool, onToolChange }: AdvertiserSidebarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Same logic as main app: Redux logout clears storage (theme preserved)
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-8 space-y-6">
        {/* Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <div className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Menü</div>
          <nav className="space-y-1">
            {([
              { key: "overview", label: "Genel Bakış", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
              { key: "campaigns", label: "Kampanyalar", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { key: "analytics", label: "Analitik", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { key: "billing", label: "Faturalandırma", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
              { key: "settings", label: "Ayarlar", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
            ] as Array<{ key: AdvertiserToolKey; label: string; icon: string }>).map((item) => (
              <button
                key={item.key}
                onClick={() => onToolChange(item.key)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 text-sm ${
                  activeTool === item.key
                    ? "bg-slate-900 dark:bg-slate-700 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center gap-3 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
