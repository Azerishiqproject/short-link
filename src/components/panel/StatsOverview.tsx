"use client";

import ClickChart from './ClickChart';
import GeographicHeatmap from './GeographicHeatmap';

interface StatsOverviewProps {
  totalLinks: number;
  totalClicks: number;
  totalEarnings: number;
  clickData?: Array<{
    date: string;
    clicks: number;
  }>;
  countryData?: Array<{
    country: string;
    count: number;
    percentage: string;
  }>;
  days?: number;
  onDaysChange?: (days: number) => void;
}

export default function StatsOverview({ 
  totalLinks, 
  totalClicks, 
  totalEarnings, 
  clickData = [], 
  countryData = [],
  days,
  onDaysChange
}: StatsOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Toplam Link</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalLinks}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Toplam Tıklama</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalClicks}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Toplam Bakiye</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalEarnings.toFixed(4)} ₺</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.418 2 2.83V18h2v-4.17c1.165-.412 2-1.524 2-2.83 0-1.657-1.343-3-3-3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Reliable clickable range selector placed outside of the chart canvas */}
        <div className="flex items-center justify-end gap-2 mt-2 mb-3 relative z-50 pointer-events-auto">
          <span className="text-xs text-slate-600 dark:text-slate-400">Zaman aralığı:</span>
          <div className="flex items-center gap-2">
            <input id="range-1" type="radio" name="stats-range" className="sr-only" checked={days===1} onChange={()=>onDaysChange?.(1)} />
            <label htmlFor="range-1" className={`px-3 py-1 rounded text-xs border cursor-pointer select-none ${days===1? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>24 Saat</label>

            <input id="range-7" type="radio" name="stats-range" className="sr-only" checked={days===7} onChange={()=>onDaysChange?.(7)} />
            <label htmlFor="range-7" className={`px-3 py-1 rounded text-xs border cursor-pointer select-none ${days===7? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>7 Gün</label>

            <input id="range-30" type="radio" name="stats-range" className="sr-only" checked={days===30} onChange={()=>onDaysChange?.(30)} />
            <label htmlFor="range-30" className={`px-3 py-1 rounded text-xs border cursor-pointer select-none ${days===30? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Ay</label>

            <input id="range-365" type="radio" name="stats-range" className="sr-only" checked={days===365} onChange={()=>onDaysChange?.(365)} />
            <label htmlFor="range-365" className={`px-3 py-1 rounded text-xs border cursor-pointer select-none ${days===365? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Yıl</label>
          </div>
        </div>
        <div className="relative z-0">
          <ClickChart data={clickData} days={days} />
        </div>
        <GeographicHeatmap data={countryData} />
      </div>
    </div>
  );
}
