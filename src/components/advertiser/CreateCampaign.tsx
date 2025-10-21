"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import PaymentModal from "@/components/advertiser/PaymentModal";
import { useAppDispatch, useAppSelector } from "@/store";
import { createCampaignThunk, fetchPricingThunk } from "@/store/slices/campaignsSlice";
import { fetchMeThunk } from "@/store/slices/authSlice";

interface CreateCampaignProps {
  onClose: () => void;
}

const adTypes = [
  { id: "website_traffic", name: "Site Trafiği", price: 0.08 }
];

const fallbackCountries = [
  "Türkiye", "Almanya", "Fransa", "İngiltere", "İtalya", "Amerika", "Kanada", "Japonya", "Avustralya", "Brezilya"
];

export default function CreateCampaign({ onClose }: CreateCampaignProps) {
  const dispatch = useAppDispatch();
  const { pricing } = useAppSelector((s) => s.campaigns);
  const [formData, setFormData] = useState({
    name: "",
    type: "website_traffic",
    target: 1000,
    country: "Türkiye",
    budget: 0,
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure pricing loaded once
  useMemo(() => { if (!pricing || pricing.length === 0) dispatch(fetchPricingThunk()); }, [pricing, dispatch]);

  // Countries from DB for advertiser
  const dbCountries = useMemo(() => {
    const list = (pricing || [])
      .filter((p) => p.audience === "advertiser")
      .map((p) => p.country);
    return Array.from(new Set(list));
  }, [pricing]);

  // If pricing provides countries, default to first
  useMemo(() => {
    if (dbCountries.length > 0 && !dbCountries.includes(formData.country)) {
      setFormData((prev) => ({ ...prev, country: dbCountries[0] }));
    }
  }, [dbCountries]);

  const defaultUnit = useMemo(() => adTypes.find(t => t.id === formData.type)?.price ?? 0, [formData.type]);
  const unitPrice = useMemo(() => {
    // Önce belirli ülke kodunu ara
    let match = (pricing || []).find(
      (p) => p.audience === "advertiser" && p.country === formData.country
    );
    
    // Eğer bulunamazsa DF (default) ülke kodunu ara
    if (!match) {
      match = (pricing || []).find(
        (p) => p.audience === "advertiser" && p.country === "DF"
      );
    }
    
    if (!match) return defaultUnit;
    const perThousand = match.rates.website_traffic;
    if (typeof perThousand !== "number") return defaultUnit;
    // convert ₺/1000 -> ₺/click
    return perThousand / 1000;
  }, [pricing, formData, defaultUnit]);
  const totalBudget = useMemo(() => Math.max(0, Math.round(formData.target * unitPrice * 100) / 100), [formData.target, unitPrice]);

  const { user } = useAppSelector((s) => s.auth);

  const handleCreate = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim() || "Kampanya",
        type: formData.type,
        target: Number(formData.target) || 0,
        country: formData.country,
        budget: totalBudget,
      };
      if (!payload.type || !payload.target || !payload.country) {
        throw new Error("Lütfen tüm alanları doldurun");
      }
      // Wallet check: require available balance >= budget
      const available = user?.available_balance ?? user?.balance ?? 0;
      if (available < totalBudget) {
        setShowTopup(true);
        throw new Error(`Yetersiz bakiye. Gerekli: ₺${totalBudget.toLocaleString()}, mevcut: ₺${(available||0).toLocaleString()}`);
      }

      const r = await dispatch(createCampaignThunk(payload));
      if (r.meta.requestStatus !== "fulfilled") {
        throw new Error((r as any).payload || "Kampanya oluşturulamadı");
      }
      // Refresh wallet to reflect reserved funds after successful campaign creation
      try { await dispatch<any>(fetchMeThunk()); } catch {}
      onClose();
    } catch (e: any) {
      setError(e?.message || "Hata");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Yeni Kampanya</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Türü, hedefi ve ülkeyi seçin. Bütçe otomatik hesaplanır.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-1 gap-6">
            {error && <div className="text-red-600 text-sm">{error}</div>}

            {/* Name */}
            <div>
              <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">Kampanya Adı</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Örn. Trafik Artırma #1"
              />
            </div>

            {/* Type + Unit price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Reklam Türü</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {adTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Birim Fiyat</label>
                <div className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center px-4 text-slate-900 dark:text-white text-sm">
                  ₺{unitPrice.toFixed(2)} / tıklama
                </div>
              </div>
            </div>

            {/* Target + Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Hedef Tıklama</label>
                <input
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: Math.max(0, parseInt(e.target.value || "0")) }))}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Hedef Ülke</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {(dbCountries.length > 0 ? dbCountries : fallbackCountries).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Tür</div>
                <div className="text-slate-900 dark:text-white font-medium text-sm">{adTypes.find(t => t.id === formData.type)?.name}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Hedef</div>
                <div className="text-slate-900 dark:text-white font-medium text-sm">{formData.target.toLocaleString()} tıklama</div>
              </div>
              <div className="text-right md:text-right">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Toplam Bütçe</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">₺{totalBudget.toLocaleString()}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={onClose} className="flex-1">İptal</Button>
              <Button onClick={handleCreate} className="flex-1" disabled={submitting || formData.target < 1}>
                {submitting ? "Oluşturuluyor..." : "Ödemeye Geç"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          campaignData={{ ...formData, budget: totalBudget }}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setShowPayment(false); onClose(); }}
        />
      )}

      {/* Top-up Suggestion Modal */}
      {showTopup && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50" onClick={()=>setShowTopup(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800" onClick={(e)=>e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bakiye Yetersiz</h3>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <p className="text-slate-700 dark:text-slate-300">Bu kampanya için yeterli bakiyeniz bulunmuyor. Önce cüzdanınıza bakiye yükleyin, ardından kampanyayı oluşturun.</p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={()=>setShowTopup(false)}>Kapat</Button>
                <Button className="flex-1" onClick={()=>{ setShowTopup(false); setShowPayment(true); }}>Bakiye Yükle</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
