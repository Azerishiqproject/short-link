"use client";

import CampaignOverview from "./CampaignOverview";
import CampaignManager from "./CampaignManager";
import CampaignAnalytics from "./CampaignAnalytics";
import CampaignBilling from "./CampaignBilling";
import CampaignSettings from "./CampaignSettings";

type AdvertiserToolKey = "overview" | "campaigns" | "analytics" | "billing" | "settings";

interface AdvertiserContentProps {
  activeTool: AdvertiserToolKey;
  totalCampaigns: number;
  totalSpent: number;
  clickRate: number;
}

export default function AdvertiserContent({
  activeTool,
  totalCampaigns,
  totalSpent,
  clickRate
}: AdvertiserContentProps) {
  return (
    <div className="flex-1">
      {activeTool === "overview" && (
        <CampaignOverview
          totalCampaigns={totalCampaigns}
          totalSpent={totalSpent}
          clickRate={clickRate}
        />
      )}

      {activeTool === "campaigns" && (
        <CampaignManager />
      )}

      {activeTool === "analytics" && (
        <CampaignAnalytics />
      )}

      {activeTool === "billing" && (
        <CampaignBilling />
      )}

      {activeTool === "settings" && (
        <CampaignSettings />
      )}
    </div>
  );
}
