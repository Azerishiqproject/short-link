"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchPricingThunk, addPricingThunk, upsertPricingThunk, deletePricingThunk, updatePricingThunk } from "@/store/slices/campaignsSlice";
import { clear } from "console";

export default function PricingManager() {
  const dispatch = useAppDispatch();
  const { pricing } = useAppSelector((s) => s.campaigns);
  const { token } = useAppSelector((s) => s.auth);
  const [show, setShow] = useState(false);
  const [editingItem, setEditingItem] = useState<{ audience: "user" | "advertiser"; country: string; rates: { website_traffic: number } } | null>(null);
  const [audFilter, setAudFilter] = useState<"advertiser" | "user">("advertiser");
  const [newPrice, setNewPrice] = useState({ audience: "advertiser" as "user" | "advertiser", country: "DF", rates: { website_traffic: 0 } });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (audience: "user" | "advertiser", country: string) => {
    if (typeof window !== 'undefined' && !confirm(`${audience} - ${country} fiyatını silmek istediğinizden emin misiniz?`)) return;
    
    try {
      setDeleting(`${audience}-${country}`);
      await dispatch<any>(deletePricingThunk({ audience, country }));
      await dispatch(fetchPricingThunk());
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (item: { audience: "user" | "advertiser"; country: string; rates: { website_traffic: number } }) => {
    setEditingItem(item);
    setNewPrice({ audience: item.audience, country: item.country, rates: { website_traffic: item.rates.website_traffic } });
    setShow(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingItem) {
        // Update existing item
        await dispatch<any>(updatePricingThunk({
          audience: editingItem.audience,
          country: editingItem.country,
          data: { ...newPrice, unit: "per_1000" }
        }));
      } else {
        // Create new item - Redux thunk kullan
        await dispatch<any>(addPricingThunk({ ...newPrice, unit: "per_1000" }));
      }
      await dispatch(fetchPricingThunk());
      setShow(false);
      setEditingItem(null);
      setNewPrice({ audience: "advertiser", country: "DF", rates: { website_traffic: 0 } });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Fiyatlandırma</h2>
        <div className="flex gap-2"><Button variant="secondary" onClick={() => dispatch(fetchPricingThunk())}>Yenile</Button><Button onClick={() => setShow(true)}>Yeni Ekle</Button></div>
      </div>
      <div className="w-full mb-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setAudFilter("advertiser")} className={`w-full h-10 rounded-xl border text-sm transition ${audFilter === "advertiser" ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10"}`}>Advertiser</button>
          <button onClick={() => setAudFilter("user")} className={`w-full h-10 rounded-xl border text-sm transition ${audFilter === "user" ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10"}`}>User</button>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-4">
          {(pricing || []).filter(p => p.audience === audFilter).map((p, idx) => (
            <div key={idx} className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 backdrop-blur p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 capitalize">{p.audience}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{p.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">₺/1000</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(p.audience, p.country)}
                      disabled={deleting === `${p.audience}-${p.country}`}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Sil"
                    >
                      {deleting === `${p.audience}-${p.country}` ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 bg-slate-50/60 dark:bg-slate-900/40"><div className="text-[11px] text-slate-500 dark:text-slate-400">Site Trafiği</div><div className="font-semibold text-slate-900 dark:text-white">₺{p.rates.website_traffic}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {show && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 pt-40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingItem ? 'Fiyatlandırmayı Düzenle' : 'Yeni Fiyatlandırma'}
              </h3>
              <button 
                onClick={() => {
                  setShow(false);
                  setEditingItem(null);
                  setNewPrice({ audience: "advertiser", country: "DF", rates: { website_traffic: 0 } });
                }} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="block text-xs text-slate-600 dark:text-slate-300">Hedef</label><select value={newPrice.audience} onChange={(e)=>setNewPrice((p)=>({ ...p, audience: e.target.value as any }))} className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"><option value="user">User</option><option value="advertiser">Advertiser</option></select></div>
                <div className="space-y-2"><label className="block text-xs text-slate-600 dark:text-slate-300">Ülke (ISO-2)</label><input value={newPrice.country} onChange={(e)=>setNewPrice((p)=>({ ...p, country: e.target.value.toUpperCase().slice(0,2) }))} className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white uppercase tracking-wider" placeholder="DF" maxLength={2}/><p className="text-[11px] text-slate-500 dark:text-slate-400">Örn: DF, TR, AZ, US (2 harf)</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2">
                  <div className="text-xs text-slate-600 dark:text-slate-300">Site Trafiği (₺/1000)</div>
                  <input 
                    type="number" 
                    min={0} 
                    value={newPrice.rates.website_traffic} 
                    onChange={(e)=>setNewPrice((p)=>({ ...p, rates: { ...p.rates, website_traffic: Number(e.target.value) } }))} 
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400">Fiyatlar 1000 tıklama başınadır.</p>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Kaydediliyor..." : editingItem ? "Güncelle" : "Kaydet"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


