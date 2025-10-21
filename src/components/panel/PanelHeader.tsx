"use client";

interface PanelHeaderProps {
  userName?: string;
  userEmail?: string;
  balance?: number;
}

export default function PanelHeader({ userName, userEmail, balance }: PanelHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg">
          Hoş geldiniz, <span className="font-semibold text-slate-900 dark:text-white">{userName || userEmail}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {typeof balance === 'number' && (
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Bakiye</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">₺{balance.toLocaleString()}</span>
          </div>
        )}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Çevrimiçi</span>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
