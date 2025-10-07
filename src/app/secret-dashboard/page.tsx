"use client";

import { Section } from "@/components/ui/Section";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Card } from "../../components/ui/Card";
import { AdminSidebar, UsersList, PricingManager, PaymentsManager } from "@/components/admin";
import SidebarNav from "@/components/panel/SidebarNav";
import WithdrawalManager from "@/components/admin/WithdrawalManager";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { fetchPricingThunk, fetchAdminUserCampaignSummaryThunk } from "@/store/slices/campaignsSlice";
import { fetchAllPaymentsThunk } from "@/store/slices/paymentsSlice";

type ApiUser = { id?: string; _id?: string; email: string; name?: string; role: string; createdAt?: string };

export default function SecretDashboard() {
  const { token, user, hydrated } = useAppSelector((s) => s.auth);
  const { allPayments } = useAppSelector((s) => s.payments);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [detailUser, setDetailUser] = useState<ApiUser | null>(null);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "pricing" | "payments" | "withdrawals">("users");

  useEffect(() => {
    console.log("Admin dashboard effect - hydrated:", hydrated, "token:", !!token, "user:", user);
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "admin") {
      console.log("User role is not admin:", user?.role);
      router.replace("/");
      return;
    }
    // Users/Config fetched in Redux
    dispatch(fetchPricingThunk());
    // Preload all payments for admin views (used in user detail)
    dispatch<any>(fetchAllPaymentsThunk()).catch(()=>{});
  }, [hydrated, token, user?.role, router, dispatch]);

  const sidebar = useMemo(() => (
    <SidebarNav
      items={([
        { key: "users", label: "Kullanıcılar", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-4a4 4 0 11-8 0 4 4 0 018 0z"/></svg> },
        { key: "pricing", label: "Fiyatlandırma", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
        { key: "payments", label: "Ödemeler", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0H3m14 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9m16 0h2m-2 0v6a2 2 0 002 2h0a2 2 0 002-2V9h-2"/></svg> },
        { key: "withdrawals", label: "Çekimler", icon: <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v.01M5 12H3m18 0h-2"/></svg> },
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
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 shadow-sm min-h-[75vh]">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {activeTab === "users" ? "Kullanıcılar" : 
                     activeTab === "pricing" ? "Fiyatlandırma" : 
                     activeTab === "payments" ? "Ödemeler" : 
                     "Çekim Yönetimi"}
                  </h1>
                </div>
            {activeTab === "users" && (
              <UsersList onDetail={async (u: ApiUser)=>{
                setDetailUser(u);
                setDetailData(null);
                setDetailLoading(true);
                try {
                  if (u.role === "advertiser") {
                    const userId = String(u._id || u.id);
                    const r:any = await dispatch<any>(fetchAdminUserCampaignSummaryThunk(userId));
                    if (r.meta.requestStatus === 'fulfilled') {
                      setDetailData({ type: "advertiser", ...(r.payload as any).data });
                    } else {
                      setDetailData({ type: "advertiser", campaigns: [], totals: { count: 0, totalBudget: 0, totalSpent: 0 } });
                    }
                  } else {
                    // Use Redux-loaded payments instead of fetching here
                    const userId = String(u._id || u.id);
                    const list = (allPayments || []).filter((p:any)=> String(p.ownerId) === userId);
                    setDetailData({ type: "user", payments: list });
                  }
                } catch (e) { console.error(e); }
                finally { setDetailLoading(false); }
              }} />
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
              </div>
            </div>
          </div>
        </div>
          {detailUser && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 p-4 bg-black/50" onClick={()=>setDetailUser(null)}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl border border-black/10 dark:border-white/10" onClick={(e)=>e.stopPropagation()}>
                <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{detailUser.name || detailUser.email}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{detailUser.email} • Rol: {detailUser.role} • Bakiye: {typeof (detailUser as any).balance === 'number' ? `₺${(detailUser as any).balance.toLocaleString()}` : '-'}</div>
                  </div>
                  <button className="text-slate-500 hover:text-slate-700" onClick={()=>setDetailUser(null)}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
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
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {(detailData.campaigns || []).map((c:any)=> (
                            <div key={c._id} className="rounded-lg border border-black/10 dark:border-white/10 p-3 flex items-center justify-between">
                              <div className="text-sm text-slate-900 dark:text-white">{c.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{c.type.replace('_',' ')}</div>
                              <div className="text-sm text-slate-900 dark:text-white">₺{(c.spent||0).toLocaleString()} / ₺{(c.budget||0).toLocaleString()}</div>
                              <span className="text-xs px-2 py-1 rounded-md border border-black/10 dark:border-white/10">{c.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-sm font-medium">Kullanıcı İşlemleri</div>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {Array.isArray((detailData as any)?.payments) && (detailData as any).payments.length > 0 ? (
                          (detailData as any).payments.map((p:any)=> (
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      </Section>
    </div>
  );
}


