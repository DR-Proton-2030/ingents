"use client";
import React, { useMemo, useContext, useCallback } from "react";
import { FileText, Heart, Eye } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import AuthContext from "@/contexts/authContext/authContext";

import AudienceGrowthChart from "./AudienceGrowthChart";
import PlatformGrowthChart from "./PlatformGrowthChart";
import PerformanceMetrics, { PerformanceMetric } from "./PerformanceMetrics";
import DateRangeSelector from "./DateRangeSelector";
import SocialAnalyticsStatsGrid from "./SocialAnalyticsStatsGrid";
import { DEFAULT_MONTHLY_DATA } from "./constants";
import { useSocialAnalyticsDashboard } from "./useSocialAnalyticsDashboard";
import type { SocialAnalyticsDashboardProps } from "./types";

export default function SocialAnalyticsDashboard({
  connectedPlatforms = [],
  showOnlyStats = false,
  showChartAndMetrics = false,
  onConnect,
  onDisconnect,
  chartData = DEFAULT_MONTHLY_DATA,
  metrics,
  onRefreshAll,
}: SocialAnalyticsDashboardProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const {
    stats,
    dateRange,
    setDateRange,
    refreshingPlatforms,
    handleConnect,
    handleDisconnect,
    handleRefresh,
  } = useSocialAnalyticsDashboard({
    user,
    connectedPlatforms,
    metrics,
    onConnect,
    onDisconnect,
    onRefreshAll,
  });

  const performanceMetrics: PerformanceMetric[] = useMemo(
    () => [
      {
        label: "Posts",
        value: "586",
        change: -2.0,
        icon: <FileText className="w-5 h-5 text-slate-400" />,
      },
      {
        label: "Likes",
        value: "12,701",
        change: 90,
        icon: <Heart className="w-5 h-5 text-slate-400" />,
      },
      {
        label: "Views",
        value: "25.05K",
        change: 30,
        icon: <Eye className="w-5 h-5 text-slate-400" />,
      },
    ],
    [],
  );

  const handleViewDetails = useCallback(
    (platformId: string) => {
      const platformData = (user as any)?.[platformId];
      const routes: Record<string, string> = {
        youtube: `${pathname}/youtube`,
        facebook: `${pathname}/facebook${
          platformData?.page_id ? `?pageId=${platformData.page_id}` : ""
        }`,
        instagram: `${pathname}/instagram`,
        x: `${pathname}/x`,
      };
      router.push(routes[platformId] || pathname);
    },
    [pathname, router, user],
  );

  if (showOnlyStats) {
    return (
      <div className="mt-5">
        <SocialAnalyticsStatsGrid
          stats={stats}
          refreshingPlatforms={refreshingPlatforms}
          onConnect={handleConnect}
          onManage={handleViewDetails}
          onDisconnect={handleDisconnect}
          onRefresh={handleRefresh}
        />
      </div>
    );
  }

  if (showChartAndMetrics) {
    return (
      <div className="space-y-6">
        <PlatformGrowthChart dateRange={dateRange} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateRangeSelector dateRange={dateRange} onDateRangeChange={setDateRange} />

      <SocialAnalyticsStatsGrid
        stats={stats}
        refreshingPlatforms={refreshingPlatforms}
        onConnect={handleConnect}
        onManage={handleViewDetails}
        onDisconnect={handleDisconnect}
        onRefresh={handleRefresh}
      />

      <PlatformGrowthChart dateRange={dateRange} />
      <PerformanceMetrics metrics={performanceMetrics} />
    </div>
  );
}

// Re-export components for external use
export {
  AudienceGrowthChart,
  PlatformGrowthChart,
  PerformanceMetrics,
  DateRangeSelector,
};
export { DEFAULT_MONTHLY_DATA } from "./constants";
