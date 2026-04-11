"use client";
import React, { useMemo, useContext, useCallback, useState } from "react";
import { FileText, Heart, Eye, RefreshCw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import AuthContext from "@/contexts/authContext/authContext";

import AudienceGrowthChart from "./AudienceGrowthChart";
import PlatformGrowthChart from "./PlatformGrowthChart";
import PerformanceMetrics, { PerformanceMetric } from "./PerformanceMetrics";
import DateRangeSelector from "./DateRangeSelector";
import SocialAnalyticsStatsGrid from "./SocialAnalyticsStatsGrid";
import { useSocialAnalyticsDashboard } from "./useSocialAnalyticsDashboard";
import { useInsightsSummary, useTriggerSync } from "@/hooks/useInsights";
import type { SocialAnalyticsDashboardProps } from "./types";

export default function SocialAnalyticsDashboard({
  connectedPlatforms = [],
  showOnlyStats = false,
  showChartAndMetrics = false,
  onConnect,
  onDisconnect,
  metrics,
  onRefreshAll,
}: SocialAnalyticsDashboardProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const userId = (user as any)?._id;
  const { summary, refetch: refetchInsights } = useInsightsSummary(userId);
  const { sync, syncing } = useTriggerSync();

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  const performanceMetrics: PerformanceMetric[] = useMemo(
    () => [
      {
        label: "Posts",
        value: summary?.totals?.total_followers
          ? formatNumber(summary.totals.total_followers)
          : "0",
        change: 0,
        icon: <FileText className="w-5 h-5 text-slate-400" />,
      },
      {
        label: "Likes",
        value: summary?.totals?.total_likes
          ? formatNumber(summary.totals.total_likes)
          : "0",
        change: 0,
        icon: <Heart className="w-5 h-5 text-slate-400" />,
      },
      {
        label: "Views",
        value: summary?.totals?.total_views
          ? formatNumber(summary.totals.total_views)
          : "0",
        change: 0,
        icon: <Eye className="w-5 h-5 text-slate-400" />,
      },
    ],
    [summary],
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

  const handleHardSync = useCallback(async () => {
    if (!userId || syncing) return;

    const result = await sync(userId);
    if (!result?.success) return;

    await refetchInsights();
    await Promise.resolve(onRefreshAll?.());
    setLastSyncAt(new Date().toLocaleTimeString());

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("insights:manual-sync"));
    }
  }, [userId, syncing, sync, refetchInsights, onRefreshAll]);

  const syncButton = (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">Realtime Sync</h3>
        <p className="text-xs text-slate-400">
          Pull latest platform metrics and save to database
          {lastSyncAt ? ` • Last sync ${lastSyncAt}` : ""}
        </p>
      </div>
      <button
        onClick={handleHardSync}
        disabled={!userId || syncing}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
        {syncing ? "Syncing..." : "Hard Sync Now"}
      </button>
    </div>
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
        {syncButton}
        <PlatformGrowthChart />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {syncButton}
      <DateRangeSelector dateRange={dateRange} onDateRangeChange={setDateRange} />

      <SocialAnalyticsStatsGrid
        stats={stats}
        refreshingPlatforms={refreshingPlatforms}
        onConnect={handleConnect}
        onManage={handleViewDetails}
        onDisconnect={handleDisconnect}
        onRefresh={handleRefresh}
      />

      <PlatformGrowthChart />
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
