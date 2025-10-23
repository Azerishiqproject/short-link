"use client";

import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import Pagination from "../common/Pagination";
import { 
  createLinkThunk, 
  updateLinkThunk, 
  deleteLinkThunk,
  fetchLinkAnalyticsThunk,
  fetchLinksThunk,
  clearAnalytics,
  bulkCreateLinksThunk
} from "@/store/slices/linksSlice";
import { useState } from "react";
import ClickChart from './ClickChart';
import GeographicHeatmap from './GeographicHeatmap';

export default function LinkManager() {
  const dispatch = useAppDispatch();
  const { token, status, error } = useAppSelector((s) => s.auth);
  const { links, earningPerClick, analytics } = useAppSelector((s) => s.links);
  const [targetUrl, setTargetUrl] = useState("");
  const [editingLink, setEditingLink] = useState<any>(null);
  const [editUrl, setEditUrl] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "clicks" | "earnings">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [analyticsDays, setAnalyticsDays] = useState<number>(7);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");


  // Get real data for charts from analytics
  const getLinkChartData = () => {
    if (!analytics?.trend) {
      return [];
    }
    return analytics.trend;
  };

  const getLinkCountryData = () => {
    if (!analytics?.countryBreakdown) {
      return [];
    }
    return analytics.countryBreakdown.map(country => ({
      country: country.country,
      count: country.count,
      percentage: country.percentage
    }));
  };

  const createLink = async () => {
    if (!token) return;
    dispatch(createLinkThunk({ token, targetUrl } as any));
    setTargetUrl("");
  };

  const updateLink = async (id: string, updates: { targetUrl?: string; disabled?: boolean }) => {
    if (!token) return;
    dispatch(updateLinkThunk({ token, id, updates }));
    setEditingLink(null);
    setEditUrl("");
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Bu linki silmek istediğinizden emin misiniz?")) return;
    if (!token) return;
    dispatch(deleteLinkThunk({ token, id }));
  };

  const toggleLink = async (link: any) => {
    await updateLink(link._id, { disabled: !link.disabled });
  };

  const startEdit = (link: any) => {
    setEditingLink(link);
    setEditUrl(link.targetUrl);
  };

  const saveEdit = () => {
    if (editingLink && editUrl) {
      updateLink(editingLink._id, { targetUrl: editUrl });
    }
  };

  const copyToClipboard = (slug: string) => {
    if (typeof window !== 'undefined') {
      const shortUrl = `${window.location.origin}/r/${slug}`;
      navigator.clipboard.writeText(shortUrl);
    }
  };

  const showLinkAnalytics = async (link: any) => {
    if (!token) return;
    setSelectedLink(link);
    setShowAnalytics(true);
    setCurrentPage(1); // Reset to first page when opening analytics
    dispatch(fetchLinkAnalyticsThunk({ token, linkId: link._id, page: 1, limit: pageSize, days: analyticsDays }));
  };

  const closeAnalytics = () => {
    setShowAnalytics(false);
    setSelectedLink(null);
    setCurrentPage(1);
    setPageSize(10);
    dispatch(clearAnalytics());
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (token && selectedLink) {
      dispatch(fetchLinkAnalyticsThunk({ token, linkId: selectedLink._id, page: newPage, limit: pageSize, days: analyticsDays }));
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
    if (token && selectedLink) {
      dispatch(fetchLinkAnalyticsThunk({ token, linkId: selectedLink._id, page: 1, limit: newSize, days: analyticsDays }));
    }
  };

  const handleAnalyticsDaysChange = (days: number) => {
    setAnalyticsDays(days);
    setCurrentPage(1);
    if (token && selectedLink) {
      dispatch(fetchLinkAnalyticsThunk({ token, linkId: selectedLink._id, page: 1, limit: pageSize, days }));
    }
  };

  // Filter and sort links
  const filteredLinks = links
    .filter(link => {
      // Search filter
      const matchesSearch = link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           link.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "clicks":
          return (b.clicks || 0) - (a.clicks || 0);
        case "earnings":
          return (b.earnings || 0) - (a.earnings || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Link Yönetimi</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">Linklerinizi oluşturun, düzenleyin ve analiz edin</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            {links.length} link
          </div>
        </div>
      </div>
      
      {/* Create Link Form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6 shadow-sm">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Yeni Link Oluştur
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                className="flex-1 h-10 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm py-2"
                placeholder="https://example.com/very-long-url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
              />
              <Button 
                onClick={createLink} 
                disabled={status === "loading" || !targetUrl}
                className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white font-medium px-4 sm:px-6 h-10 sm:h-11 text-sm"
              >
                {status === "loading" ? "Oluşturuluyor..." : "Oluştur"}
              </Button>
              <Button 
                onClick={() => setShowBulk(v=>!v)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium px-4 sm:px-6 h-10 sm:h-11 text-sm border border-slate-200 dark:border-slate-600"
              >
                Toplu Kısalt
              </Button>
            </div>
          </div>
          {showBulk && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">Toplu URL Girişi</label>
              <textarea
                className="w-full min-h-[120px] sm:min-h-[140px] rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                placeholder={`Her satıra bir URL yazın veya virgülle ayırın\nhttps://example.com/a\nhttps://example.com/b, https://example.com/c`}
                value={bulkText}
                onChange={(e)=>setBulkText(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <Button 
                  variant="secondary" 
                  onClick={()=>{ setShowBulk(false); setBulkText(""); }}
                  className="w-full sm:w-auto"
                >
                  İptal
                </Button>
                <Button
                  onClick={() => {
                    if (!token || !bulkText.trim()) return;
                    dispatch<any>(bulkCreateLinksThunk({ token, text: bulkText.trim() }));
                    setBulkText("");
                    setShowBulk(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white px-4 sm:px-6 w-full sm:w-auto"
                >
                  Çoklu Kısalt
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Not: http/https ile başlayan geçerli URL'ler işlenir. Maksimum 100 URL.</p>
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter */}
       {links.length > 0 && (
         <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
             {/* Search */}
             <div>
               <input
                 type="text"
                 placeholder="Link ara..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full h-9 sm:h-10 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
               />
             </div>
             
             {/* Sort */}
             <div>
               <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value as any)}
                 className="w-full h-9 sm:h-10 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
               >
                 <option value="newest">En Yeni</option>
                 <option value="oldest">En Eski</option>
                 <option value="clicks">En Çok Tıklanan</option>
                 <option value="earnings">En Çok Kazanan</option>
               </select>
             </div>
           </div>
           
           {/* Results count */}
           <div className="flex items-center justify-end mt-3 sm:mt-4">
             <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
               {filteredLinks.length} link gösteriliyor
             </span>
           </div>
         </div>
       )}

      {/* Links List */}
      <div>
        {links.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Henüz link yok</h4>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Yukarıdaki formdan yeni link oluşturun</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Arama sonucu bulunamadı</h4>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Farklı bir arama terimi deneyin</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredLinks.map((link) => (
              <div key={link._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-5 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 lg:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                      <div className="font-mono text-xs sm:text-sm bg-slate-100 dark:bg-slate-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-slate-800 dark:text-slate-200 border">
                        /r/{link.slug}
                      </div>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium w-fit ${
                        link.disabled 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>
                        {link.disabled ? 'Pasif' : 'Aktif'}
                      </div>
                    </div>
                    
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-all mb-3 bg-slate-50 dark:bg-slate-700/50 p-2 sm:p-3 rounded-lg border">
                      {link.targetUrl}
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2 text-slate-500 dark:text-slate-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-medium">{link.clicks} tıklama</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-slate-500 dark:text-slate-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.418 2 2.83V18h2v-4.17c1.165-.412 2-1.524 2-2.83 0-1.657-1.343-3-3-3z" />
                        </svg>
                        <span className="font-medium">{(link.earnings || 0).toFixed(4)} ₺</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-slate-500 dark:text-slate-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{new Date(link.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-slate-500 dark:text-slate-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">QR Kod</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:ml-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(link.slug)}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs px-2 sm:px-3 py-1 sm:py-1.5"
                    >
                      <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">Kopyala</span>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => showLinkAnalytics(link)}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs px-2 sm:px-3 py-1 sm:py-1.5"
                    >
                      <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="hidden sm:inline">Analiz</span>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => startEdit(link)}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs px-2 sm:px-3 py-1 sm:py-1.5"
                    >
                      <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="hidden sm:inline">Düzenle</span>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleLink(link)}
                      className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 ${
                        link.disabled 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                      }`}
                    >
                      <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.disabled ? "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"} />
                      </svg>
                      <span className="hidden sm:inline">{link.disabled ? 'Aktifleştir' : 'Pasifleştir'}</span>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => deleteLink(link._id)}
                      className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 border-red-200 dark:border-red-800 text-xs px-2 sm:px-3 py-1 sm:py-1.5"
                    >
                      <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">Sil</span>
                    </Button>
                  </div>
                </div>
                
                {/* Edit Mode */}
                {editingLink?._id === link._id && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        className="flex-1 h-9 sm:h-10 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Yeni URL"
                      />
                      <Button 
                        size="sm" 
                        onClick={saveEdit}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 sm:px-4 h-9 sm:h-10"
                      >
                        Kaydet
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => {
                          setEditingLink(null);
                          setEditUrl("");
                        }}
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs px-3 sm:px-4 h-9 sm:h-10"
                      >
                        İptal
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination Controls - Bottom */}
        {links.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(links.length / pageSize)}
              onPageChange={(newPage) => {
                setCurrentPage(newPage);
                if (token) dispatch(fetchLinksThunk(token));
              }}
            />
          </div>
        )}
      </div>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Link Analitikleri
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 truncate">
                    /r/{selectedLink?.slug}
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={closeAnalytics}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 p-2 ml-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 sm:p-4 lg:p-6">
              {analytics ? (
                <div className="space-y-4 sm:space-y-6">

                  {/* Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-4 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{analytics.totalClicks}</div>
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Toplam Tıklama</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-4 text-center">
                      <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{analytics.countryBreakdown?.length || 0}</div>
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Farklı Ülke</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-4 text-center sm:col-span-2 lg:col-span-1">
                      <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {(selectedLink?.earnings || 0).toFixed(4)} ₺
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Toplam Kazanç</div>
                    </div>
                  </div>

                  {/* Charts Section - with range selector */}
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Tıklama Trendi</div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-400">Zaman aralığı:</span>
                        <button onClick={()=>handleAnalyticsDaysChange(1)} className={`px-2 sm:px-3 py-1 rounded text-xs border ${analyticsDays===1? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>24 Saat</button>
                        <button onClick={()=>handleAnalyticsDaysChange(7)} className={`px-2 sm:px-3 py-1 rounded text-xs border ${analyticsDays===7? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Hafta</button>
                        <button onClick={()=>handleAnalyticsDaysChange(30)} className={`px-2 sm:px-3 py-1 rounded text-xs border ${analyticsDays===30? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Ay</button>
                        <button onClick={()=>handleAnalyticsDaysChange(365)} className={`px-2 sm:px-3 py-1 rounded text-xs border ${analyticsDays===365? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900':'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'} border-slate-300 dark:border-slate-600`}>1 Yıl</button>
                      </div>
                    </div>
                    <ClickChart data={getLinkChartData()} days={analyticsDays} />
                    <GeographicHeatmap data={getLinkCountryData()} />
                  </div>

                  {/* Country Breakdown */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Detaylı Ülke / Bölge Dağılımı</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {analytics.countryBreakdown && analytics.countryBreakdown.length > 0 ? (
                        analytics.countryBreakdown.map((country, index) => (
                          <div key={index} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  {index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{country.country}</div>
                                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{country.count} tıklama</div>
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <div className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{country.percentage}%</div>
                                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                  {country.clicks ? country.clicks.reduce((sum: number, click: any) => sum + (click.earnings || 0), 0).toFixed(4) : '0.0000'} ₺
                                </div>
                                <div className="w-20 sm:w-24 bg-slate-200 dark:bg-slate-600 rounded-full h-1.5 sm:h-2 mt-1">
                                  <div 
                                    className="bg-slate-600 dark:bg-slate-400 h-1.5 sm:h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${country.percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Henüz veri yok</h4>
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Bu link için henüz ülke bazında veri bulunmuyor</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Clicks with Earnings */}
                  {analytics.recentClicks && analytics.recentClicks.length > 0 && (
                    <div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3 lg:mb-4">Son Tıklamalar ve Kazançlar</h3>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[280px]">
                            <thead className="bg-slate-100 dark:bg-slate-600">
                              <tr>
                                <th className="px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Tarih</th>
                                <th className="px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Ülke</th>
                                <th className="px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Kazanç</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                              {analytics.recentClicks.map((click, index) => (
                                <tr key={index} className="hover:bg-slate-100 dark:hover:bg-slate-600/50">
                                  <td className="px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-[10px] sm:text-xs text-slate-900 dark:text-white">
                                    <div className="whitespace-nowrap">
                                      {new Date(click.clickedAt).toLocaleDateString('tr-TR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                      })}
                                    </div>
                                    <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
                                      {new Date(click.clickedAt).toLocaleTimeString('tr-TR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </div>
                                  </td>
                                  <td className="px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-[10px] sm:text-xs text-slate-900 dark:text-white">
                                    <div className="whitespace-nowrap truncate max-w-[60px] sm:max-w-none">
                                      {click.country}
                                    </div>
                                  </td>
                                  <td className="px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 text-[10px] sm:text-xs font-semibold text-green-600 dark:text-green-400">
                                    <div className="whitespace-nowrap">
                                      {click.earnings.toFixed(4)} ₺
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-slate-600 dark:border-slate-400"></div>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Analitik veriler yükleniyor...</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Lütfen bekleyin, grafikler hazırlanıyor</p>
                </div>
              )}
              </div>
            </div>
            
            {/* Pagination Controls - Fixed at bottom */}
            {analytics && analytics.recentClicks && analytics.recentClicks.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-3 sm:p-4">
                {(() => {
                  const pg = analytics.pagination?.page ?? currentPage;
                  const lim = analytics.pagination?.limit ?? pageSize;
                  const total = analytics.pagination?.total ?? (analytics.totalClicks || 0);
                  const totalPages = analytics.pagination?.totalPages ?? Math.max(1, Math.ceil(total / lim));
                  return (
                    <Pagination
                      currentPage={pg}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}