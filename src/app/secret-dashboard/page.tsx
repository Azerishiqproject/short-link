"use client";

export const dynamic = 'force-dynamic';

import { Section } from "@/components/ui/Section";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Card } from "../../components/ui/Card";
import { AdminSidebar, UsersList, PricingManager, PaymentsManager, AdminSupport } from "@/components/admin";
import dynamicImport from "next/dynamic";

const BlogManager = dynamicImport(() => import("@/components/admin/BlogManager"), {
  ssr: false,
  loading: () => <div className="p-4">Blog Manager yükleniyor...</div>
});
import ReferralManager from "@/components/admin/ReferralManager";
import SidebarNav from "@/components/panel/SidebarNav";
import WithdrawalManager from "@/components/admin/WithdrawalManager";
import Pagination from "@/components/common/Pagination";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { fetchPricingThunk, fetchAdminUserCampaignSummaryThunk } from "@/store/slices/campaignsSlice";
import { fetchAllPaymentsThunk } from "@/store/slices/paymentsSlice";
import { fetchAllUsersThunk } from "@/store/slices/usersSlice";

type ApiUser = { id?: string; _id?: string; email: string; name?: string; role: string; createdAt?: string };

export default function SecretDashboard() {
  const { token, user, hydrated } = useAppSelector((s) => s.auth);
  const { allPayments } = useAppSelector((s) => s.payments);
  const { users, pagination } = useAppSelector((s) => s.users);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [detailUser, setDetailUser] = useState<ApiUser | null>(null);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "pricing" | "payments" | "withdrawals" | "support" | "blog" | "referrals">("users");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);
  const [detailPageSize, setDetailPageSize] = useState(10);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleDetailPageChange = (newPage: number) => {
    setDetailCurrentPage(newPage);
  };

  const handleDetailPageSizeChange = (newSize: number) => {
    setDetailPageSize(newSize);
    setDetailCurrentPage(1);
  };

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "admin") {
      router.replace("/");
      return;
    }
    // Users/Config fetched in Redux
    dispatch(fetchPricingThunk());
    // Preload all payments for admin views (used in user detail)
    dispatch<any>(fetchAllPaymentsThunk()).catch(()=>{});
    // Fetch users with pagination
    dispatch<any>(fetchAllUsersThunk({ token, page: currentPage, limit: pageSize }));
  }, [hydrated, token, user?.role, router, dispatch, currentPage, pageSize]);

  const sidebar = useMemo(() => (
    <SidebarNav
      items={([
        { key: "users", label: "Kullanıcılar", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-4a4 4 0 11-8 0 4 4 0 018 0z"/></svg> },
        { key: "pricing", label: "Fiyatlandırma", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
        { key: "payments", label: "Ödemeler", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0H3m14 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9m16 0h2m-2 0v6a2 2 0 002 2h0a2 2 0 002-2V9h-2"/></svg> },
        { key: "withdrawals", label: "Çekimler", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v.01M5 12H3m18 0h-2"/></svg> },
        { key: "support", label: "Destek", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 20l.8-3.2A7.7 7.7 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> },
        { key: "blog", label: "Blog", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
        { key: "referrals", label: "Referanslar", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg> },
      ] as { key: string; label: string; icon: React.ReactElement }[])}
      activeKey={activeTab}
      onSelect={(k)=>setActiveTab(k as any)}
      onSettings={()=>setActiveTab('users') /* admin has separate settings elsewhere */}
      onLogout={() => { dispatch(logout()); router.push("/"); }}
    />
  ), [dispatch, router, activeTab]);

  if (!hydrated || !token || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 dark:opacity-10" style={{backgroundImage:"radial-gradient(#64748b 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20" />
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <BlurSpot className="absolute left-8 top-16 hidden lg:block" color="#3b82f6" size={120} opacity={0.08} />
        <BlurSpot className="absolute right-8 top-32 hidden lg:block" color="#8b5cf6" size={100} opacity={0.06} />
      </div>

      <Section className="pt-24 sm:pt-28 pb-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-6">
            {sidebar}
            <div className="flex-1">
              <div className="mb-3 text-xs text-slate-600 dark:text-slate-400">Anasayfa / <span className="capitalize">{activeTab}</span></div>
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 shadow-sm min-h-[75vh] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {activeTab === "users" ? "Kullanıcılar" : 
                     activeTab === "pricing" ? "Fiyatlandırma" : 
                     activeTab === "payments" ? "Ödemeler" : 
                     activeTab === "withdrawals" ? "Çekim Yönetimi" : 
                     activeTab === "support" ? "Destek" : 
                     activeTab === "blog" ? "Blog Yönetimi" : 
                     activeTab === "referrals" ? "Referans Yönetimi" : ""}
                  </h1>
                </div>
                <div className="flex-1 flex flex-col">
            {activeTab === "users" && (
              <>
                <div className="flex-1">
                  <UsersList />
                </div>
                {pagination && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
                {activeTab === "pricing" && (
                  <PricingManager />
                )}
                {activeTab === "payments" && (
                  <PaymentsManager />
                )}
                {activeTab === "withdrawals" && (
                  <WithdrawalManager />
                )}
                {activeTab === "support" && (
                  <AdminSupport />
                )}
                {activeTab === "blog" && (
                  <BlogManager />
                )}
                {activeTab === "referrals" && (
                  <ReferralManager />
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
          {detailUser && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 p-4 bg-black/50" onClick={()=>setDetailUser(null)}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl border border-black/10 dark:border-white/10 flex flex-col max-h-[80vh]" onClick={(e)=>e.stopPropagation()}>
                <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{detailUser.name || detailUser.email}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{detailUser.email} • Rol: {detailUser.role} • Bakiye: {typeof (detailUser as any).balance === 'number' ? `₺${(detailUser as any).balance.toLocaleString()}` : '-'}</div>
                  </div>
                  <button className="text-slate-500 hover:text-slate-700" onClick={()=>setDetailUser(null)}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-5">
                  {detailLoading ? (
                    <div className="text-slate-600 dark:text-slate-400">Yükleniyor...</div>
                  ) : detailData?.type === "advertiser" ? (
                    <div className="space-y-4">
                      <div className="text-sm text-slate-600 dark:text-slate-300">Toplam Kampanya: {detailData.totals?.count ?? 0}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Toplam Bütçe: ₺{(detailData.totals?.totalBudget ?? 0).toLocaleString()}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Toplam Harcama: ₺{(detailData.totals?.totalSpent ?? 0).toLocaleString()}</div>
                      <div className="border-t border-black/10 dark:border-white/10 pt-4">
                        <div className="text-sm font-medium mb-2">Kampanyalar</div>
                        <div className="space-y-2">
                          {(() => {
                            const campaigns = detailData.campaigns || [];
                            const startIndex = (detailCurrentPage - 1) * detailPageSize;
                            const endIndex = startIndex + detailPageSize;
                            const paginatedCampaigns = campaigns.slice(startIndex, endIndex);
                            const totalPages = Math.ceil(campaigns.length / detailPageSize);
                            
                            return (
                              <>
                                <div className="space-y-2">
                                  {paginatedCampaigns.map((c:any)=> (
                                    <div key={c._id} className="rounded-lg border border-black/10 dark:border-white/10 p-3 flex items-center justify-between">
                                      <div className="text-sm text-slate-900 dark:text-white">{c.name}</div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{c.type.replace('_',' ')}</div>
                                      <div className="text-sm text-slate-900 dark:text-white">₺{(c.spent||0).toLocaleString()} / ₺{(c.budget||0).toLocaleString()}</div>
                                      <span className="text-xs px-2 py-1 rounded-md border border-black/10 dark:border-white/10">{c.status}</span>
                                    </div>
                                  ))}
                                </div>
                                {campaigns.length > detailPageSize && (
                                  <div className="mt-4">
                                    <Pagination
                                      currentPage={detailCurrentPage}
                                      totalPages={totalPages}
                                      onPageChange={handleDetailPageChange}
                                    />
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-sm font-medium">Kullanıcı İşlemleri</div>
                      <div className="space-y-2">
                        {(() => {
                          const payments = Array.isArray((detailData as any)?.payments) ? (detailData as any).payments : [];
                          const startIndex = (detailCurrentPage - 1) * detailPageSize;
                          const endIndex = startIndex + detailPageSize;
                          const paginatedPayments = payments.slice(startIndex, endIndex);
                          const totalPages = Math.ceil(payments.length / detailPageSize);
                          
                          return (
                            <>
                              <div className="space-y-2">
                                {paginatedPayments.length > 0 ? (
                                  paginatedPayments.map((p:any)=> (
                                    <div key={p._id} className="rounded-lg border border-black/10 dark:border-white/10 p-3 flex items-center justify-between text-sm">
                                      <div className="text-slate-900 dark:text-white">{new Date(p.createdAt).toLocaleString()}</div>
                                      <div className="text-slate-600 dark:text-slate-300">{p.category === 'withdrawal' ? 'Çekim' : 'Ödeme'}</div>
                                      <div className="font-semibold text-slate-900 dark:text-white">₺{Number(p.amount).toLocaleString()}</div>
                                      <span className={`px-2 py-1 rounded-md text-xs ${p.status === 'paid' || p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : p.status==='pending' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'}`}>{p.status}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-slate-600 dark:text-slate-400 text-sm">İşlem bulunamadı.</div>
                                )}
                              </div>
                              {payments.length > detailPageSize && (
                                <div className="mt-4">
                                  <Pagination
                                    currentPage={detailCurrentPage}
                                    totalPages={totalPages}
                                    onPageChange={handleDetailPageChange}
                                  />
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
          )}
      </Section>
    </div>
  );
}


