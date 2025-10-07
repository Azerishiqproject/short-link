"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchPricingThunk, upsertPricingThunk } from "@/store/slices/campaignsSlice";

export default function PricingManager() {
  const dispatch = useAppDispatch();
  const { pricing } = useAppSelector((s) => s.campaigns);
  const { token } = useAppSelector((s) => s.auth);
  const [show, setShow] = useState(false);
  const [audFilter, setAudFilter] = useState<"advertiser" | "user">("advertiser");
  const [newPrice, setNewPrice] = useState({ audience: "advertiser" as "user" | "advertiser", country: "TR", rates: { google_review: 0, website_traffic: 0, video_views: 0, like_follow: 0 } });
  const [saving, setSaving] = useState(false);

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
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 capitalize">{p.audience}</span><span className="text-sm text-slate-600 dark:text-slate-300">{p.country}</span></div><span className="text-[11px] text-slate-500 dark:text-slate-400">₺/1000</span></div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 bg-slate-50/60 dark:bg-slate-900/40"><div className="text-[11px] text-slate-500 dark:text-slate-400">Google Yorum</div><div className="font-semibold text-slate-900 dark:text-white">₺{p.rates.google_review}</div></div>
                <div className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 bg-slate-50/60 dark:bg-slate-900/40"><div className="text-[11px] text-slate-500 dark:text-slate-400">Site Trafiği</div><div className="font-semibold text-slate-900 dark:text-white">₺{p.rates.website_traffic}</div></div>
                <div className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 bg-slate-50/60 dark:bg-slate-900/40"><div className="text-[11px] text-slate-500 dark:text-slate-400">Video İzletme</div><div className="font-semibold text-slate-900 dark:text-white">₺{p.rates.video_views}</div></div>
                <div className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 bg-slate-50/60 dark:bg-slate-900/40"><div className="text-[11px] text-slate-500 dark:text-slate-400">Beğeni Takip</div><div className="font-semibold text-slate-900 dark:text-white">₺{p.rates.like_follow}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {show && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 pt-40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800"><h3 className="text-lg font-semibold text-slate-900 dark:text-white">Yeni Fiyatlandırma</h3><button onClick={() => setShow(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button></div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="block text-xs text-slate-600 dark:text-slate-300">Hedef</label><select value={newPrice.audience} onChange={(e)=>setNewPrice((p)=>({ ...p, audience: e.target.value as any }))} className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"><option value="user">User</option><option value="advertiser">Advertiser</option></select></div>
                <div className="space-y-2"><label className="block text-xs text-slate-600 dark:text-slate-300">Ülke (ISO-2)</label><input value={newPrice.country} onChange={(e)=>setNewPrice((p)=>({ ...p, country: e.target.value.toUpperCase().slice(0,2) }))} className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white uppercase tracking-wider" placeholder="TR" maxLength={2}/><p className="text-[11px] text-slate-500 dark:text-slate-400">Örn: TR, AZ, US (2 harf)</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{(["google_review","website_traffic","video_views","like_follow"] as const).map((k)=>(<div key={k} className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2"><div className="text-xs text-slate-600 dark:text-slate-300 capitalize">{k.replace("_"," ")} (₺/1000)</div><input type="number" min={0} value={(newPrice.rates as any)[k]} onChange={(e)=>setNewPrice((p)=>({ ...p, rates: { ...p.rates, [k]: Number(e.target.value) } }))} className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"/></div>))}</div>
              <div className="flex items-center justify-between"><p className="text-xs text-slate-600 dark:text-slate-400">Fiyatlar 1000 tıklama başınadır.</p><Button onClick={async()=>{try{setSaving(true);await dispatch<any>(upsertPricingThunk({entries:[...(pricing||[]),{...newPrice,unit:"per_1000"}]}));await dispatch(fetchPricingThunk());setShow(false);}catch(e){console.error(e);}finally{setSaving(false);}}} disabled={saving}>{saving?"Kaydediliyor...":"Kaydet"}</Button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


