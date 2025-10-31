"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import Pagination from "@/components/common/Pagination";
import ClickChart from "@/components/panel/ClickChart";
import GeographicHeatmap from "@/components/panel/GeographicHeatmap";
import { fetchCurrentAdminAdThunk, setAdminAdThunk, fetchAdminAdsListThunk, fetchAdminAdsConfigThunk, setAdminAdsConfigThunk, fetchAdminAdAnalyticsThunk, fetchAdminAdHitsThunk } from "@/store/slices/adminAdsSlice";

export default function AdminAdsManager() {
  const dispatch = useAppDispatch();
  const adminAd = useAppSelector((s)=> (s as any).adminAds?.current);
  const adminAdLoading = useAppSelector((s)=> (s as any).adminAds?.loading);
  const adminAdsList = useAppSelector((s)=> (s as any).adminAds?.list || []);
  const adminAdAnalytics = useAppSelector((s)=> (s as any).adminAds?.analytics);
  const adminAdHits = useAppSelector((s)=> (s as any).adminAds?.hits || []);
  const adminAdHitsPg = useAppSelector((s)=> (s as any).adminAds?.hitsPagination);

  const [mode, setMode] = useState<'random'|'priority'>('random');
  const [priorityAdId, setPriorityAdId] = useState<string | null>(null);
  const [adUrl, setAdUrl] = useState("");
  const [adLimit, setAdLimit] = useState<number>(0);
  const [showAdAnalytics, setShowAdAnalytics] = useState<{ adId: string; url: string } | null>(null);
  const [analyticsDays, setAnalyticsDays] = useState<number>(7);

  useEffect(() => {
    dispatch<any>(fetchCurrentAdminAdThunk()).catch(()=>{});
    dispatch<any>(fetchAdminAdsListThunk()).catch(()=>{});
    dispatch<any>(fetchAdminAdsConfigThunk()).then((r:any)=>{
      if (r?.meta?.requestStatus === 'fulfilled') {
        setMode(r.payload.mode);
        setPriorityAdId(r.payload.priorityAdId);
      }
    }).catch(()=>{});
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600 dark:text-slate-400">Farklı IP'den ilk tıklamada yan sekmede açılacak siteyi ve limitini belirleyin.</div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-md text-xs ${mode==='random' ? 'bg-blue-500/10 text-blue-600' : 'bg-violet-500/10 text-violet-600'}`}>{mode==='random' ? 'Karışık' : 'Öncelikli'}</span>
          <span className="px-2 py-1 rounded-md text-xs bg-slate-500/10 text-slate-600">Aktif: {adminAdsList.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/60">
          <div className="text-sm font-medium mb-3">Gösterim Modu</div>
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Mod</label>
              <select value={mode} onChange={(e)=>setMode(e.target.value as any)} className="rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 px-3 py-2 text-sm">
                <option value="random">Karışık (eşit dağıtım)</option>
                <option value="priority">Öncelikli</option>
              </select>
            </div>
            {mode === 'priority' && (
              <div className="md:w-80">
                <label className="block text-xs text-slate-500 mb-1">Öncelikli Site</label>
                <select value={priorityAdId || ''} onChange={(e)=>setPriorityAdId(e.target.value || null)} className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 px-3 py-2 text-sm">
                  <option value="">Seçiniz...</option>
                  {adminAdsList.map((a:any)=> (
                    <option key={a.id} value={a.id}>{a.url}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <button onClick={()=>dispatch<any>(setAdminAdsConfigThunk({ mode, priorityAdId })).then(()=>dispatch<any>(fetchAdminAdsConfigThunk()))} className="px-4 py-2 rounded-lg text-white text-sm bg-emerald-600 hover:bg-emerald-700">Kaydet</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/60">
          <div className="text-sm font-medium mb-3">Yeni Reklam Ekle</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Site URL</label>
              <input value={adUrl} onChange={(e)=>setAdUrl(e.target.value)} placeholder="https://example.com" className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Limit</label>
              <input type="number" value={adLimit} onChange={(e)=>setAdLimit(Number(e.target.value||0))} className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button disabled={adminAdLoading || !adUrl || (adLimit||0)<=0} onClick={()=>dispatch<any>(setAdminAdThunk({ url: adUrl, limit: adLimit })).then(()=>{ setAdUrl(''); setAdLimit(0); dispatch<any>(fetchCurrentAdminAdThunk()); dispatch<any>(fetchAdminAdsListThunk()); })} className={`px-4 py-2 rounded-lg text-white text-sm ${adminAdLoading? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}>{adminAdLoading? 'Kaydediliyor...' : 'Kaydet'}</button>
            {adminAd && (
              <div className="text-sm text-slate-700 dark:text-slate-300">Mevcut: <span className="font-medium">{adminAd.url}</span> • Kalan: <span className="font-semibold">{adminAd.remaining}</span></div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium mb-2">Kayıtlı Reklamlar</div>
        <div className="space-y-2">
          {adminAdsList.length === 0 ? (
            <div className="text-sm text-slate-500">Kayıt yok</div>
          ) : (
            adminAdsList.map((a:any)=> (
              <div key={a.id} className="rounded-lg border border-black/10 dark:border-white/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-800 dark:text-slate-100 truncate">{a.url}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">{(a.initialLimit ?? 0) - (a.remaining ?? 0)}/{a.initialLimit ?? 0}</span>
                    <button className="px-3 py-1.5 rounded-md text-xs bg-slate-100 dark:bg-slate-800" onClick={()=>{ setShowAdAnalytics({ adId: a.id, url: a.url }); dispatch<any>(fetchAdminAdAnalyticsThunk({ adId: a.id, days: analyticsDays })); dispatch<any>(fetchAdminAdHitsThunk({ adId: a.id, page: 1, limit: 10 })); }}>Detay</button>
                  </div>
                </div>
                <div className="h-2 mt-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all" style={{ width: `${Math.min(100, Math.round(100 * ((a.initialLimit||0)-(a.remaining||0)) / Math.max(1,(a.initialLimit||0))))}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAdAnalytics && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/50" onClick={()=>setShowAdAnalytics(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl border border-black/10 dark:border-white/10 flex flex-col max-h-[85vh]" onClick={(e)=>e.stopPropagation()}>
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <div className="text-base font-semibold text-slate-900 dark:text-white">Reklam Analitiği • {showAdAnalytics.url}</div>
              <button className="text-slate-500 hover:text-slate-700" onClick={()=>setShowAdAnalytics(null)}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-400">Zaman aralığı:</span>
                <button onClick={()=>{ setAnalyticsDays(1); dispatch<any>(fetchAdminAdAnalyticsThunk({ adId: showAdAnalytics.adId, days: 1 })); }} className={`px-2 py-1 rounded border ${analyticsDays===1? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>24 Saat</button>
                <button onClick={()=>{ setAnalyticsDays(7); dispatch<any>(fetchAdminAdAnalyticsThunk({ adId: showAdAnalytics.adId, days: 7 })); }} className={`px-2 py-1 rounded border ${analyticsDays===7? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Hafta</button>
                <button onClick={()=>{ setAnalyticsDays(30); dispatch<any>(fetchAdminAdAnalyticsThunk({ adId: showAdAnalytics.adId, days: 30 })); }} className={`px-2 py-1 rounded border ${analyticsDays===30? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Ay</button>
                <button onClick={()=>{ setAnalyticsDays(365); dispatch<any>(fetchAdminAdAnalyticsThunk({ adId: showAdAnalytics.adId, days: 365 })); }} className={`px-2 py-1 rounded border ${analyticsDays===365? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Yıl</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {adminAdAnalytics ? (
                <>
                  <ClickChart data={adminAdAnalytics.trend || []} days={analyticsDays} />
                  <GeographicHeatmap data={(adminAdAnalytics.countryBreakdown || []).map((g:any)=>({ country: g.country, count: g.count, percentage: g.percentage }))} />
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Tıklamalar (IP & Ülke)</div>
                    <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-900">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><tr><th className="text-left px-3 py-2">Tarih</th><th className="text-left px-3 py-2">IP</th><th className="text-left px-3 py-2">Ülke</th></tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {adminAdHits.length === 0 ? (
                            <tr><td className="px-3 py-3 text-slate-500" colSpan={3}>Kayıt yok</td></tr>
                          ) : (
                            adminAdHits.map((h:any)=> (
                              <tr key={h.id}><td className="px-3 py-2 text-slate-800 dark:text-slate-100">{new Date(h.createdAt).toLocaleString('tr-TR')}</td><td className="px-3 py-2 text-slate-700 dark:text-slate-300">{h.ip || '-'}</td><td className="px-3 py-2 text-slate-700 dark:text-slate-300">{h.country || 'Unknown'}</td></tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {adminAdHitsPg && adminAdHitsPg.totalPages > 1 && showAdAnalytics && (
                      <div className="mt-3"><Pagination currentPage={adminAdHitsPg.page} totalPages={adminAdHitsPg.totalPages} onPageChange={(p)=>dispatch<any>(fetchAdminAdHitsThunk({ adId: showAdAnalytics.adId, page: p, limit: adminAdHitsPg.limit }))} /></div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-slate-600 dark:text-slate-400 text-sm">Yükleniyor...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





