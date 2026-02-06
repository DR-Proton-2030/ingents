"use client";
import React, { useState, useContext, useEffect, useMemo } from "react";
import { FileText, Heart, Eye } from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import { usePathname, useRouter } from "next/navigation";

// Modular Components
import PlatformStatCard from "./PlatformStatCard";
import AudienceGrowthChart from "./AudienceGrowthChart";
import PlatformGrowthChart from "./PlatformGrowthChart";
import PerformanceMetrics, { PerformanceMetric } from "./PerformanceMetrics";
import DateRangeSelector from "./DateRangeSelector";

// Constants & Utilities
import {
  PLATFORMS,
  DEFAULT_MONTHLY_DATA,
  formatNumber,
  getAuthUrl,
} from "./constants";

// Types
export interface PlatformStat {
  id: string;
  name: string;
  icon: React.ReactNode;
  followers: string;
  color: string;
  bgColor: string;
  connected: boolean;
}

export interface SocialAnalyticsDashboardProps {
  connectedPlatforms?: string[];
  showOnlyStats?: boolean;
  showChartAndMetrics?: boolean;
  onConnect?: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
  chartData?: typeof DEFAULT_MONTHLY_DATA;
  metrics?: any;
}

export default function SocialAnalyticsDashboard({
  connectedPlatforms = [],
  showOnlyStats = false,
  showChartAndMetrics = false,
  onConnect,
  onDisconnect,
  chartData = DEFAULT_MONTHLY_DATA,
  metrics,
}: SocialAnalyticsDashboardProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [dateRange, setDateRange] = useState("Last 25 Days");

  // Compute platform stats from user data
  const stats = useMemo((): PlatformStat[] => {
    return PLATFORMS.map((platform) => {
      const platformData = (user as any)?.[platform.id];
      let followers = "0";
      let connected = connectedPlatforms.includes(platform.id);

      // Check if we have dynamic metrics from the metrics prop
      const metricsList = Array.isArray(metrics) ? metrics : metrics?.metrics;
      const metricData = metricsList?.find(
        (m: any) => 
          m.platform?.toLowerCase() === platform.id.toLowerCase() || 
          (platform.id === "x" && m.platform?.toLowerCase() === "twitter")
      );

      if (metricData) {
        followers = formatNumber(Number(metricData.count || 0));
        connected = true;
      } else if (platformData) {
        const followerValue =
          platform.id === "youtube"
            ? platformData.subscriberCount
            : platformData.followers_count;

        if (followerValue) {
          followers = formatNumber(
            typeof followerValue === "string"
              ? parseInt(followerValue)
              : followerValue
          );
          connected = true;
        }
      }

      // Check for access token as backup connection indicator
      if (platformData?.access_token || platformData?.page_id) {
        connected = true;
      }

      return {
        id: platform.id,
        name: platform.name,
        icon: platform.icon,
        followers,
        color: platform.color,
        bgColor: platform.bgColor,
        connected,
      };
    });
  }, [user, connectedPlatforms, metrics]);

  // Performance metrics
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
    []
  );

  // Handlers
  const handleViewDetails = (platformId: string) => {
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
  };

  const handleConnect = (platformId: string) => {
    const baseURL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";
    const userId = (user as any)?._id || (user as any)?.id;

    const authURL = getAuthUrl(platformId, userId, baseURL);

    if (authURL) {
      window.open(authURL, "_blank");
    }

    onConnect?.(platformId);
  };

  const handleRefresh = (platformId: string) => {
    // Trigger page refresh to get latest data
    window.location.reload();
  };

  // Render: Stats Only (for header section)
  if (showOnlyStats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {stats.map((platform, index) => (
          <PlatformStatCard
            key={platform.id}
            {...platform}
            index={index}
            onConnect={() => handleConnect(platform.id)}
            onManage={() => handleViewDetails(platform.id)}
            onRefresh={() => handleRefresh(platform.id)}
          />
        ))}
      </div>
    );
  }

  // Render: Chart and Metrics Only (for Analytics tab)
  if (showChartAndMetrics) {
    return (
      <div className="space-y-6">
        <PlatformGrowthChart dateRange={dateRange} />
        <PerformanceMetrics metrics={performanceMetrics} />
      </div>
    );
  }

  // Render: Full Dashboard (default)
  return (
    <div className="space-y-6">
      <DateRangeSelector
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Platform Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((platform, index) => (
          <PlatformStatCard
            key={platform.id}
            {...platform}
            index={index}
            onConnect={() => handleConnect(platform.id)}
            onManage={() => handleViewDetails(platform.id)}
            onRefresh={() => handleRefresh(platform.id)}
          />
        ))}
      </div>

      <PlatformGrowthChart dateRange={dateRange} />
      <PerformanceMetrics metrics={performanceMetrics} />
    </div>
  );
}

// Re-export components for external use
export { PlatformStatCard, AudienceGrowthChart, PlatformGrowthChart, PerformanceMetrics, DateRangeSelector };
export { PLATFORMS, DEFAULT_MONTHLY_DATA, formatNumber, getAuthUrl } from "./constants";
