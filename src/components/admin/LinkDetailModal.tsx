"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchLinkAnalyticsThunk, clearAnalytics } from "@/store/slices/linksSlice";
import { Button } from "@/components/ui/Button";
import Pagination from "@/components/common/Pagination";
import ClickChart from "@/components/panel/ClickChart";
import GeographicHeatmap from "@/components/panel/GeographicHeatmap";

interface LinkDetailModalProps {
  link: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function LinkDetailModal({ link, isOpen, onClose }: LinkDetailModalProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { analytics } = useAppSelector((s) => s.links);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [analyticsDays, setAnalyticsDays] = useState<number>(7);

  useEffect(() => {
    if (isOpen && link && token) {
      // Clear previous analytics data
      dispatch(clearAnalytics());
      fetchLinkClicks(1, pageSize, analyticsDays);
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, link, token, analyticsDays]);

  useEffect(() => {
    if (isOpen && link && token) {
      fetchLinkClicks(currentPage, pageSize, analyticsDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const fetchLinkClicks = async (page: number, limit: number, days: number) => {
    if (!link || !token) return;
    
    setLoading(true);
    try {
      const result = await dispatch(fetchLinkAnalyticsThunk({ 
        token, 
        linkId: link._id, 
        page, 
        limit, 
        days 
      }));
    } catch (error) {
      console.error("Link clicks fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleClose = () => {
    dispatch(clearAnalytics());
    onClose();
  };

  if (!isOpen || !link) return null;

  const clicks = analytics?.recentClicks || [];
  const totalClicks = analytics?.totalClicks || 0;
  const totalPages = Math.ceil(totalClicks / pageSize);
  const chartData = (analytics?.trend || []).map((d: any) => ({ date: d.date, clicks: d.clicks }));
  const countryData = (analytics?.countryBreakdown || []).map((c: any) => ({ country: c.country, count: c.count, percentage: c.percentage }));
  

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Link Detayları
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-md">
              {link.targetUrl}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Link Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
              <div className="text-xs text-slate-600 dark:text-slate-300">Slug</div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                {link.slug}
              </div>
            </div>
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
              <div className="text-xs text-slate-600 dark:text-slate-300">Toplam Tıklama</div>
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {link.clicks || 0}
              </div>
            </div>
            <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
              <div className="text-xs text-slate-600 dark:text-slate-300">Toplam Kazanç</div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                ₺{Number(link.earnings || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Grafikler - aralık seçici */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Tıklama Trendi</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400">Zaman aralığı:</span>
                <button onClick={()=>setAnalyticsDays(1)} className={`px-3 py-1 rounded text-xs border ${analyticsDays===1? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>24 Saat</button>
                <button onClick={()=>setAnalyticsDays(7)} className={`px-3 py-1 rounded text-xs border ${analyticsDays===7? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Hafta</button>
                <button onClick={()=>setAnalyticsDays(30)} className={`px-3 py-1 rounded text-xs border ${analyticsDays===30? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Ay</button>
                <button onClick={()=>setAnalyticsDays(365)} className={`px-3 py-1 rounded text-xs border ${analyticsDays===365? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Yıl</button>
              </div>
            </div>
            <ClickChart data={chartData} days={analyticsDays} />
            <GeographicHeatmap data={countryData} />
          </div>

          {/* Tıklama Detayları */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-slate-900 dark:text-white">
              Tıklama Detayları ({totalClicks})
            </h4>
            
            {loading ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600 dark:border-slate-400"></div>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Tıklama verileri yükleniyor...</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Lütfen bekleyin, veriler hazırlanıyor</p>
              </div>
            ) : clicks.length > 0 ? (
              <>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-100 dark:bg-slate-600">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Tarih</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Ülke</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">IP</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Kazanç</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                        {clicks.map((click: any, index: number) => (
                          <tr key={index} className="hover:bg-slate-100 dark:hover:bg-slate-600/50">
                            <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                              {new Date(click.clickedAt).toLocaleString('tr-TR')}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                              {click.country}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-mono">
                              {click.ip}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                              {click.earnings.toFixed(4)} ₺
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {analytics?.pagination && analytics.pagination.totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={analytics.pagination.page}
                      totalPages={analytics.pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                Henüz tıklama yok
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
