"use client";

interface AdvertiserHeaderProps {
  userName?: string;
  userEmail?: string;
  available?: number;
  reserved?: number;
}

export default function AdvertiserHeader({ userName, userEmail, available, reserved }: AdvertiserHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reklam Veren Paneli</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-base">Kampanyalarınızı yönetin ve performansınızı takip edin</p>
      </div>
      <div className="flex items-center gap-3">
        {typeof available === 'number' && (
          <div className="relative group hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
            <span className="text-sm text-slate-600 dark:text-slate-300">Bakiye</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">₺{(available ?? 0).toLocaleString()}</span>
            {/* Hover card */}
            <div className="pointer-events-none absolute left-0 top-[110%] w-44 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl p-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400"><span>Kullanılabilir</span><span className="text-slate-700 dark:text-slate-300">₺{(available ?? 0).toLocaleString()}</span></div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1"><span>Rezerve</span><span className="text-slate-700 dark:text-slate-300">₺{(reserved ?? 0).toLocaleString()}</span></div>
            </div>
          </div>
        )}
        <div className="text-right">
          <div className="text-sm font-medium text-slate-900 dark:text-white">{userName || "Reklam Veren"}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{userEmail}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
          {userName?.[0]?.toUpperCase() || "R"}
        </div>
      </div>
    </div>
  );
}
