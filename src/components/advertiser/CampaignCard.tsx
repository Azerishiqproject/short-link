"use client";

import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMeThunk } from "@/store/slices/authSlice";
import { fetchCampaignsThunk, endCampaignThunk } from "@/store/slices/campaignsSlice";

interface Campaign {
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
}

interface CampaignCardProps {
  campaign: Campaign;
}

const getTypeLabel = (type: string) => {
  const types: { [key: string]: string } = {
    google_review: "Google Yorum",
    website_traffic: "Site Trafiği", 
    video_views: "Video İzletme",
    like_follow: "Beğeni Takip"
  };
  return types[type] || type;
};

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getStatusLabel = (status: string) => {
  const labels: { [key: string]: string } = {
    active: "Aktif",
    paused: "Duraklatıldı",
    completed: "Tamamlandı"
  };
  return labels[status] || status;
};

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s)=>s.auth);
  const progress = (campaign.spent / campaign.budget) * 100;
  const clickRate = campaign.clicks > 0 ? ((campaign.clicks / campaign.target) * 100).toFixed(1) : 0;
  const endCampaign = async () => {
    if (!token) return;
    const r:any = await dispatch<any>(endCampaignThunk(campaign.id));
    if (r.meta.requestStatus === 'fulfilled') {
      try { await dispatch<any>(fetchMeThunk()); } catch {}
      try { await dispatch<any>(fetchCampaignsThunk()); } catch {}
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{campaign.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{getTypeLabel(campaign.type)}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
          {getStatusLabel(campaign.status)}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Hedef:</span>
          <span className="font-medium text-slate-900 dark:text-white">{campaign.target.toLocaleString()} tıklama</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Ülke:</span>
          <span className="font-medium text-slate-900 dark:text-white">{campaign.country}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Bütçe:</span>
          <span className="font-medium text-slate-900 dark:text-white">₺{campaign.budget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Harcanan:</span>
          <span className="font-medium text-slate-900 dark:text-white">₺{campaign.spent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Tıklama Oranı:</span>
          <span className="font-medium text-slate-900 dark:text-white">%{clickRate}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
          <span>İlerleme</span>
          <span>%{progress.toFixed(1)}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1"
        >
          Detaylar
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1"
        >
          {campaign.status === "active" ? "Duraklat" : "Başlat"}
        </Button>
        {campaign.status !== "completed" && (
          <Button 
            size="sm"
            className="flex-1"
            onClick={endCampaign}
          >
            Sonlandır
          </Button>
        )}
      </div>
    </div>
  );
}
