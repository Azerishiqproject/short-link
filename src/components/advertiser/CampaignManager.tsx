"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import CreateCampaign from "./CreateCampaign";
import CampaignDetail from "./CampaignDetail";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCampaignsThunk } from "@/store/slices/campaignsSlice";

export default function CampaignManager() {
  const dispatch = useAppDispatch();
  const { items: campaigns, status, error } = useAppSelector((s) => s.campaigns);
  const { token } = useAppSelector((s) => s.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const [tab, setTab] = useState<"active" | "completed">("active");
  useEffect(() => {
    if (!token) return;
    dispatch(fetchCampaignsThunk(tab));
  }, [token, dispatch, tab]);

  const loading = status === "loading" && campaigns.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kampanyalar</h2>
          <div className="mt-2 flex items-center gap-2">
            <button onClick={()=>setTab("active")} className={`h-8 w-[100px] justify-center px-3 rounded-lg text-xs border ${tab==='active' ? 'bg-slate-900 text-white dark:bg-blue-600 border-slate-900 dark:border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'}`}>Aktif</button>
            <button onClick={()=>setTab("completed")} className={`h-8 w-[100px] justify-center px-3 rounded-lg text-xs border ${tab==='completed' ? 'bg-slate-900 text-white dark:bg-blue-600 border-slate-900 dark:border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/10'}`}>Tamamlanan</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => dispatch(fetchCampaignsThunk(tab))}>Yenile</Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-600/20 shadow-sm dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white dark:border-blue-400/20 dark:shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Kampanya
          </Button>
        </div>
      </div>

      {/* Vertical List */}
      {loading ? (
        <div className="text-slate-600 dark:text-slate-400">Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : campaigns.length === 0 ? (
        <div className="text-slate-600 dark:text-slate-400">Henüz kampanya yok.</div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1">
                  <div className="text-base font-semibold text-slate-900 dark:text-white">{campaign.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{campaign.country} · {new Date(campaign.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Hedef</div>
                    <div className="font-medium text-slate-900 dark:text-white">{campaign.target.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Bütçe</div>
                    <div className="font-medium text-slate-900 dark:text-white">₺{campaign.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400">Harcanan</div>
                    <div className="font-medium text-slate-900 dark:text-white">₺{campaign.spent.toLocaleString()}</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-slate-500 dark:text-slate-400">Tıklama</div>
                    <div className="font-medium text-slate-900 dark:text-white">{campaign.clicks.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setSelected(campaign)}>Detay</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaign onClose={() => { setShowCreateModal(false); dispatch(fetchCampaignsThunk()); }} />
      )}

      {/* Detail Modal */}
      {selected && (
        <CampaignDetail
          campaign={{
            id: selected._id,
            name: selected.name,
            type: selected.type,
            target: selected.target,
            country: selected.country,
            budget: selected.budget,
            spent: selected.spent,
            clicks: selected.clicks,
            status: selected.status,
            createdAt: selected.createdAt,
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
