"use client";

import { Section } from "@/components/ui/Section";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Card } from "../../components/ui/Card";
import { AdminSidebar, UsersList, PricingManager, PaymentsManager } from "@/components/admin";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { fetchPricingThunk } from "@/store/slices/campaignsSlice";

type ApiUser = { id?: string; _id?: string; email: string; name?: string; role: string; createdAt?: string };

export default function SecretDashboard() {
  const { token, user, hydrated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [detailUser, setDetailUser] = useState<ApiUser | null>(null);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "pricing" | "payments">("users");

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
    // Users fetched in UsersList via Redux
    dispatch(fetchPricingThunk());
  }, [hydrated, token, user?.role, router, dispatch]);

  const sidebar = useMemo(() => (
    <AdminSidebar active={activeTab} onChange={(t: "users" | "pricing" | "payments") => setActiveTab(t)} onLogout={() => { dispatch(logout()); router.push("/"); }} />
  ), [dispatch, router, activeTab]);

  if (!hydrated || !token || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background layers */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F5F7FB] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" style={{backgroundImage:"radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block opacity-10" style={{backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <BlurSpot className="absolute -top-16 -left-24" color="#60a5fa" size={360} opacity={0.18} />
        <BlurSpot className="absolute top-24 -right-28" color="#a78bfa" size={420} opacity={0.14} />
      </div>

      <Section className="pt-28 sm:pt-36 pb-16">
        <Card rounded="2xl" padding="md" className="shadow-soft bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-black/10 dark:border-white/10">
          <div className="flex">
          {sidebar}
            <div className="flex-1 p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{activeTab === "users" ? "Kullanıcılar" : activeTab === "pricing" ? "Fiyatlandırma" : "Ödemeler"}</h1>
            </div>
            {activeTab === "users" && (
              <UsersList onDetail={async (u: ApiUser)=>{
                setDetailUser(u);
                setDetailData(null);
                setDetailLoading(true);
                try {
                  if (u.role === "advertiser") {
                    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
                    const res = await fetch(`${api}/api/campaigns/admin/user/${u._id || u.id}/summary`, { headers: { Authorization: `Bearer ${token}` }});
                    const data = await res.json();
                    setDetailData({ type: "advertiser", ...data });
                  } else {
                    // Placeholder for normal users
                    setDetailData({ type: "user", tasksCompleted: 0, totalWithdrawn: 0 });
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
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border border-black/10 dark:border-white/10 p-3">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Tamamlanan Görevler</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">0</div>
                      </div>
                      <div className="rounded-xl border border-black/10 dark:border-white/10 p-3">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Toplam Çekim</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">₺0</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Section>
    </div>
  );
}


