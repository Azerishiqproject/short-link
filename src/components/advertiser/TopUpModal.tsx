"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMeThunk } from "@/store/slices/authSlice";

interface TopUpModalProps {
  onClose: () => void;
  initialAmount?: number;
}

export default function TopUpModal({ onClose, initialAmount }: TopUpModalProps) {
  const [amount, setAmount] = useState<number>(initialAmount ?? 100);
  const [method, setMethod] = useState<string>("credit_card");
  const [loading, setLoading] = useState(false);
  const { token } = useAppSelector((s)=>s.auth);
  const dispatch = useAppDispatch();

  const submit = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
      await fetch(`${API_URL}/api/payments`, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ amount, method, currency: "TRY", description: `Top-up`, category: "payment", audience: "advertiser" }) });
      try { await dispatch<any>(fetchMeThunk()); } catch {}
      onClose();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-black/10 dark:border-white/10 shadow-2xl" onClick={(e)=>e.stopPropagation()}>
        <div className="p-5 border-b border-black/10 dark:border-white/10">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Bakiye Yükle</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kampanyalarda kullanmak üzere cüzdanınıza bakiye ekleyin.</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">Tutar (₺)</label>
            <input type="number" min={10} step={10} value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-300">Ödeme Yöntemi</label>
            <select value={method} onChange={(e)=>setMethod(e.target.value)} className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white">
              <option value="credit_card">Kredi Kartı</option>
              <option value="bank_transfer">Banka Havalesi</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[100,250,500].map((v)=> (
              <button key={v} onClick={()=>setAmount(v)} className="h-9 rounded-lg border border-black/10 dark:border-white/10 text-xs">₺{v}</button>
            ))}
          </div>
        </div>
        <div className="p-5 border-t border-black/10 dark:border-white/10 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>İptal</Button>
          <Button className="flex-1" onClick={submit} disabled={loading}>{loading ? "Yükleniyor..." : "Yükle"}</Button>
        </div>
      </div>
    </div>
  );
}


