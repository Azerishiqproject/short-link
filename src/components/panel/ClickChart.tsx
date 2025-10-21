"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClickChartProps {
  data: Array<{
    date: string;
    clicks: number;
  }>;
  days?: number;
}

export default function ClickChart({ data, days }: ClickChartProps) {
  const hasData = data && data.length > 0;
  const totalClicks = data?.reduce((sum, item) => sum + item.clicks, 0) || 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6 shadow-sm">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1">Tıklama Trendi</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{days===1 ? 'Son 24 saat' : `Son ${days ?? 7} günlük veriler`}</p>
      </div>
      
      {hasData ? (
        <div className="h-48 sm:h-56 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (days === 1) {
                    return date.toLocaleTimeString('tr-TR', { hour: '2-digit' });
                  }
                  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                width={30}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(30 41 59)',
                  border: '1px solid rgb(71 85 105)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '11px',
                  padding: '8px'
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  if (days === 1) {
                    return date.toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit' });
                  }
                  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
                }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 2 }}
                activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Henüz veri yok</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Bu link için henüz tıklama verisi bulunmuyor</p>
          </div>
        </div>
      )}
    </div>
  );
}
