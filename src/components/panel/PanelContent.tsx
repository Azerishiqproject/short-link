"use client";

import StatsOverview from "./StatsOverview";
import LinkManager from "./LinkManager";
import Settings from "./Settings";

type ToolKey = "overview" | "shorten" | "links" | "analytics" | "settings";

interface PanelContentProps {
  activeTool: ToolKey;
  totalLinks: number;
  totalClicks: number;
  totalEarnings: number;
  clickData?: Array<{
    date: string;
    clicks: number;
  }>;
  countryData?: Array<{
    country: string;
    count: number;
    percentage: string;
  }>;
}

export default function PanelContent({ 
  activeTool, 
  totalLinks, 
  totalClicks, 
  totalEarnings, 
  clickData, 
  countryData 
}: PanelContentProps) {
  return (
    <div className="flex-1">
      {activeTool === "overview" && (
        <StatsOverview 
          totalLinks={totalLinks}
          totalClicks={totalClicks}
          totalEarnings={totalEarnings}
          clickData={clickData}
          countryData={countryData}
        />
      )}

      {activeTool === "shorten" && (
        <LinkManager />
      )}

      {activeTool === "settings" && (
        <Settings />
      )}
    </div>
  );
}
