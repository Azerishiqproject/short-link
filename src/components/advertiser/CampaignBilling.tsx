"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMyPaymentsThunk } from "@/store/slices/campaignsSlice";
import { Button } from "@/components/ui/Button";

export default function CampaignBilling() {
  const dispatch = useAppDispatch();
  const { myPayments, status } = useAppSelector((s) => s.campaigns);
  const { token } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchMyPaymentsThunk());
  }, [token, dispatch]);

  const loading = status === "loading" && (!myPayments || myPayments.length === 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Faturalandırma</h2>

      <div className="flex items-center justify-between">
        <p className="text-slate-600 dark:text-slate-400">Ödemelerinizin kaydı.</p>
        <Button variant="secondary" onClick={() => dispatch(fetchMyPaymentsThunk())}>Yenile</Button>
      </div>

      {loading ? (
        <div className="text-slate-600 dark:text-slate-400">Yükleniyor...</div>
      ) : (
        <div className="space-y-3">
          {(myPayments || []).map((p) => (
            <div key={p._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex items-center justify-between">
              <div className="text-sm text-slate-900 dark:text-white">{new Date(p.createdAt).toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{p.method}</div>
              <div className="font-semibold text-slate-900 dark:text-white">₺{p.amount.toLocaleString()}</div>
              <span className={`px-2 py-1 rounded-md text-xs ${p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'}`}>{p.status}</span>
            </div>
          ))}
          {(myPayments || []).length === 0 && (
            <div className="text-slate-600 dark:text-slate-400">Henüz ödeme kaydı yok.</div>
          )}
        </div>
      )}
    </div>
  );
}
