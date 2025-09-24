"use client";

import { Button } from "@/components/ui/Button";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

type ToolKey = "overview" | "shorten" | "links" | "analytics" | "settings";

interface PanelSidebarProps {
  activeTool: ToolKey;
  onToolChange: (tool: ToolKey) => void;
}

export default function PanelSidebar({ activeTool, onToolChange }: PanelSidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
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
              { key: "shorten", label: "Link Yönetimi", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
              { key: "settings", label: "Ayarlar", icon: "M11 11V7a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H7a1 1 0 110-2h4z" },
            ] as Array<{ key: ToolKey; label: string; icon: string }>).map((item) => (
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
          <Button 
            variant="secondary" 
            onClick={handleLogout} 
            className="w-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Çıkış Yap
          </Button>
        </div>
      </div>
    </aside>
  );
}
