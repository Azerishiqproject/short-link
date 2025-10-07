"use client";

import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMeThunk } from "@/store/slices/authSlice";
import { fetchCampaignsThunk, endCampaignThunk } from "@/store/slices/campaignsSlice";

interface CampaignDetailProps {
  campaign: {
    id: string;
    name: string;
    type: string;
    target: number;
    country: string;
    budget: number;
    spent: number;
    clicks: number;
    status: "active" | "paused" | "completed";
    createdAt: string;
  };
  onClose: () => void;
}

const typeLabel: Record<string, string> = {
  google_review: "Google Yorum",
  website_traffic: "Site Trafiği",
  video_views: "Video İzletme",
  like_follow: "Beğeni Takip",
};

export default function CampaignDetail({ campaign, onClose }: CampaignDetailProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s)=>s.auth);
  const progress = (campaign.spent / campaign.budget) * 100;
  const ctr = campaign.target > 0 ? ((campaign.clicks / campaign.target) * 100).toFixed(1) : 0;

  const endCampaign = async () => {
    if (!token) return;
    const r:any = await dispatch<any>(endCampaignThunk(campaign.id));
    if (r.meta.requestStatus === 'fulfilled') {
      try { await dispatch<any>(fetchMeThunk()); } catch {}
      try { await dispatch<any>(fetchCampaignsThunk()); } catch {}
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Kampanya Detayı</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Kampanya Adı</div>
                <div className="text-slate-900 dark:text-white font-medium text-base">{campaign.name}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Tür</div>
                <div className="text-slate-900 dark:text-white font-medium text-base">{typeLabel[campaign.type] || campaign.type}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Ülke</div>
                <div className="text-slate-900 dark:text-white font-medium text-base">{campaign.country}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Oluşturma</div>
                <div className="text-slate-900 dark:text-white font-medium text-base">{new Date(campaign.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600 dark:text-slate-400">Hedef:</span>
                <span className="font-medium text-slate-900 dark:text-white">{campaign.target.toLocaleString()} tıklama</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600 dark:text-slate-400">Toplam Bütçe:</span>
                <span className="font-medium text-slate-900 dark:text-white">₺{campaign.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600 dark:text-slate-400">Harcanan:</span>
                <span className="font-medium text-slate-900 dark:text-white">₺{campaign.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600 dark:text-slate-400">Tıklamalar:</span>
                <span className="font-medium text-slate-900 dark:text-white">{campaign.clicks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-600 dark:text-slate-400">Tıklama Oranı:</span>
                <span className="font-medium text-slate-900 dark:text-white">%{ctr}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>İlerleme</span>
                  <span>%{progress.toFixed(1)}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>Kapat</Button>
            {campaign.status !== "completed" && (
              <Button onClick={endCampaign}>Sonlandır</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


