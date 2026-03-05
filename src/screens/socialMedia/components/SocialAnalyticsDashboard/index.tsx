"use client";
import React, { useState, useContext, useEffect, useMemo } from "react";
import { FileText, Heart, Eye } from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Modular Components
import PlatformStatCard from "./PlatformStatCard";
import AudienceGrowthChart from "./AudienceGrowthChart";
import PlatformGrowthChart from "./PlatformGrowthChart";
import PerformanceMetrics, { PerformanceMetric } from "./PerformanceMetrics";
import DateRangeSelector from "./DateRangeSelector";
import {
  syncFacebook,
  syncYoutube,
  syncInstagram,
} from "@/utils/api/social/social.api";

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
  views?: string;
  color: string;
  bgColor: string;
  connected: boolean;
  lastSyncedAt?: string | null;
}

export interface SocialAnalyticsDashboardProps {
  connectedPlatforms?: string[];
  showOnlyStats?: boolean;
  showChartAndMetrics?: boolean;
  onConnect?: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
  chartData?: typeof DEFAULT_MONTHLY_DATA;
  metrics?: any;
  onRefreshAll?: () => void;
}

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
  const [dateRange, setDateRange] = useState("Last 25 Days");

  // Compute platform stats from user data
  const stats = useMemo((): PlatformStat[] => {
    return PLATFORMS.map((platform) => {
      const platformData = (user as any)?.[platform.id];
      let followers = "0";
      let connected = false;

      // Check if we have dynamic metrics from the metrics prop
      const metricsList = Array.isArray(metrics) ? metrics : metrics?.metrics;
      const metricData = metricsList?.find((m: any) => {
        const platformId = m.platform?.toLowerCase();
        const targetId = platform.id.toLowerCase();
        return (
          platformId === targetId ||
          (targetId === "x" && platformId === "twitter") ||
          (targetId === "instagram" && platformId === "instagram_business")
        );
      });

      // Strictly require both access_token and project_id (or page_id for FB) to be considered connected
      const hasId = !!(platformData?.project_id || platformData?.page_id);
      const hasToken = !!platformData?.access_token;
      connected = connectedPlatforms.includes(platform.id) && hasId && hasToken;

      // Only show metrics/followers if currently connected
      if (connected) {
        if (metricData) {
          followers = formatNumber(Number(metricData.count || 0));
        } else if (platformData) {
          const followerValue =
            platform.id === "youtube"
              ? platformData.subscriberCount
              : platformData.followers_count;

          if (followerValue) {
            followers = formatNumber(
              typeof followerValue === "string"
                ? parseInt(followerValue)
                : followerValue,
            );
          }
        }
      } else {
        followers = "0";
      }

      return {
        id: platform.id,
        name: platform.name,
        icon: platform.icon,
        followers,
        views:
          platform.id === "youtube"
            ? formatNumber(
                Number(
                  platformData?.viewCount ||
                    platformData?.statistics?.viewCount ||
                    0,
                ),
              )
            : undefined,
        color: platform.color,
        bgColor: platform.bgColor,
        connected,
        lastSyncedAt:
          metricData?.last_synced_at || platformData?.last_synced_at || null,
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
    [],
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

  const [refreshingPlatforms, setRefreshingPlatforms] = useState<
    Record<string, boolean>
  >({});

  const handleRefresh = async (platformId: string) => {
    const userId = (user as any)?._id || (user as any)?.id;
    if (!userId) return;

    setRefreshingPlatforms((prev) => ({ ...prev, [platformId]: true }));

    try {
      const platformData = (user as any)?.[platformId];

      switch (platformId.toLowerCase()) {
        case "youtube":
          await syncYoutube(userId);
          break;
        case "facebook":
          const pageId = platformData?.project_id || platformData?.page_id;
          if (!pageId) {
            throw new Error(
              "Facebook Page ID not found. Please connect your account again.",
            );
          }
          await syncFacebook(userId, pageId);
          break;
        case "instagram":
          await syncInstagram(userId);
          break;
        default:
          toast.info(
            `${platformId} synchronization logic not yet implemented.`,
          );
          return;
      }

      toast.success(
        `${platformId.charAt(0).toUpperCase() + platformId.slice(1)} sync successful!`,
      );

      if (onRefreshAll) {
        await onRefreshAll();
      } else {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      console.error(`Sync error for ${platformId}:`, err);
      toast.error(
        `Error syncing ${platformId}: ${err.message || "Unknown error"}`,
      );
    } finally {
      setRefreshingPlatforms((prev) => ({ ...prev, [platformId]: false }));
    }
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
            refreshing={refreshingPlatforms[platform.id]}
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
            refreshing={refreshingPlatforms[platform.id]}
          />
        ))}
      </div>

      <PlatformGrowthChart dateRange={dateRange} />
      <PerformanceMetrics metrics={performanceMetrics} />
    </div>
  );
}

// Re-export components for external use
export {
  PlatformStatCard,
  AudienceGrowthChart,
  PlatformGrowthChart,
  PerformanceMetrics,
  DateRangeSelector,
};
export {
  PLATFORMS,
  DEFAULT_MONTHLY_DATA,
  formatNumber,
  getAuthUrl,
} from "./constants";
