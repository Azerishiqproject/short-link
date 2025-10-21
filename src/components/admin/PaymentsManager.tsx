"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppSelector, useAppDispatch } from "@/store";
import { fetchAllPaymentsThunk } from "@/store/slices/paymentsSlice";
import Pagination from "../common/Pagination";

export default function PaymentsManager() {
  const dispatch = useAppDispatch();
  const { allPayments, status } = useAppSelector((s) => s.payments);
  const [category, setCategory] = useState<"payment"|"withdrawal">("payment");
  const [audience, setAudience] = useState<"advertiser"|"user">("advertiser");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const refresh = () => {
    dispatch(fetchAllPaymentsThunk());
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Reset pagination when filters change
  const handleCategoryChange = (newCategory: "payment"|"withdrawal") => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handleAudienceChange = (newAudience: "advertiser"|"user") => {
    setAudience(newAudience);
    setCurrentPage(1);
  };

  useEffect(() => { 
    refresh(); 
  }, []);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Admin: Ödemeler / Çekimler</h2>
        <Button variant="secondary" onClick={refresh}>Yenile</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <button onClick={() => setCategory("payment")} className={`h-9 rounded-lg text-sm border ${category==='payment' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'}`}>Ödemeler</button>
        <button onClick={() => setCategory("withdrawal")} className={`h-9 rounded-lg text-sm border ${category==='withdrawal' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'}`}>Çekim Talepleri</button>
        <button onClick={() => setAudience("advertiser")} className={`h-9 rounded-lg text-sm border ${audience==='advertiser' ? 'bg-slate-900 text-white dark:bg-blue-500 border-slate-900 dark:border-blue-500' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'}`}>Advertiser</button>
        <button onClick={() => setAudience("user")} className={`h-9 rounded-lg text-sm border ${audience==='user' ? 'bg-slate-900 text-white dark:bg-blue-500 border-slate-900 dark:border-blue-500' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'}`}>User</button>
      </div>
      {status === "loading" ? (<div className="text-slate-600 dark:text-slate-400">Yükleniyor...</div>) : (
        <div className="space-y-3">
          {allPayments.filter(p=>p.category===category && p.audience===audience).map((p)=> (
            <div key={p._id} className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 p-4 flex items-center justify-between">
              <div className="text-sm text-slate-900 dark:text-white">{new Date(p.createdAt).toLocaleString()}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">{p.method}</div>
              <div className="font-semibold text-slate-900 dark:text-white">₺{p.amount?.toLocaleString?.() ?? p.amount}</div>
              <div className="flex items-center gap-2">
                {p.withdrawalType && (
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    p.withdrawalType === "referral" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  }`}>
                    {p.withdrawalType === "referral" ? "Referans" : "Normal"}
                  </span>
                )}
                <span className={`px-2 py-1 rounded-md text-xs ${p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : p.status==='pending' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


