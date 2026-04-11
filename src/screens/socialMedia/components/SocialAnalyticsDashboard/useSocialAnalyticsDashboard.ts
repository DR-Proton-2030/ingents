"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { syncFacebook, syncYoutube } from "@/utils/api/social/social.api";
import { getAuthUrl, formatNumber, PLATFORMS } from "./constants";
import type { PlatformStat, SocialAnalyticsDashboardProps } from "./types";

interface UseSocialAnalyticsDashboardProps {
  user: any;
  connectedPlatforms?: string[];
  metrics?: any;
  onConnect?: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
  onRefreshAll?: () => void;
}

const getMetricData = (platformId: string, metrics: any): any => {
  const metricsList = Array.isArray(metrics) ? metrics : metrics?.metrics;
  return metricsList?.find(
    (m: any) =>
      m.platform?.toLowerCase() === platformId.toLowerCase() ||
      (platformId === "x" && m.platform?.toLowerCase() === "twitter"),
  );
};

const getPlatformFollowers = (platformData: any, platformId: string): string => {
  const followerValue =
    platformId === "youtube"
      ? platformData?.subscriberCount
      : platformData?.followers_count;

  if (!followerValue) return "0";
  return formatNumber(
    typeof followerValue === "string"
      ? parseInt(followerValue, 10)
      : followerValue,
  );
};

const isPlatformConnected = (platformId: string, platformData: any): boolean => {
  switch (platformId) {
    case "facebook":
      return Boolean(
        platformData?.access_token || platformData?.page_id || platformData?.project_id,
      );
    case "instagram":
      return Boolean(platformData?.access_token || platformData?.project_id);
    case "youtube":
      return Boolean(platformData?.access_token || platformData?.project_id);
    case "x":
      return Boolean(platformData?.access_token || platformData?.project_id);
    default:
      return false;
  }
};

export function useSocialAnalyticsDashboard({
  user,
  connectedPlatforms = [],
  metrics,
  onConnect,
  onDisconnect,
  onRefreshAll,
}: UseSocialAnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState("Last 25 Days");
  const [refreshingPlatforms, setRefreshingPlatforms] = useState<Record<string, boolean>>({});

  const stats = useMemo<PlatformStat[]>(() => {
    return PLATFORMS.map((platform) => {
      const platformData = (user as any)?.[platform.id];
      let followers = "0";
      const connected =
        connectedPlatforms.includes(platform.id) ||
        isPlatformConnected(platform.id, platformData);

      const metricData = getMetricData(platform.id, metrics);
      if (metricData) {
        followers = formatNumber(Number(metricData.count || 0));
      } else if (platformData) {
        followers = getPlatformFollowers(platformData, platform.id);
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
      };
    });
  }, [user, connectedPlatforms, metrics]);

  const handleConnect = useCallback(
    (platformId: string) => {
      const baseURL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8989";
      const userId = (user as any)?._id || (user as any)?.id;
      const authURL = getAuthUrl(platformId, userId, baseURL);

      if (authURL) {
        window.open(authURL, "_blank");
      }

      onConnect?.(platformId);
    },
    [user, onConnect],
  );

  const handleDisconnect = useCallback(
    async (platformId: string) => {
      if (onDisconnect) {
        await Promise.resolve(onDisconnect(platformId));
        return;
      }

      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) {
        toast.error("Missing user id");
        return;
      }

      const routeMap: Record<string, string> = {
        facebook: "/api/facebook/disconnect",
        youtube: "/api/youtube/disconnect",
        x: "/api/x/disconnect",
        instagram: "/api/instagram/disconnect",
      };

      const route = routeMap[platformId];
      if (!route) {
        toast.info(`${platformId} disconnect is not available yet.`);
        return;
      }

      const confirmed =
        typeof window !== "undefined"
          ? window.confirm(
              `Disconnect ${platformId.charAt(0).toUpperCase() + platformId.slice(1)} account?`,
            )
          : true;
      if (!confirmed) return;

      try {
        const res = await fetch(route, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            payload?.error || payload?.message || `Failed to disconnect ${platformId}`,
          );
        }

        toast.success(
          `${platformId.charAt(0).toUpperCase() + platformId.slice(1)} disconnected successfully`,
        );

        if (onRefreshAll) {
          await onRefreshAll();
        } else {
          setTimeout(() => window.location.reload(), 1000);
        }
      } catch (err: any) {
        toast.error(err?.message || `Failed to disconnect ${platformId}`);
      }
    },
    [onDisconnect, user, onRefreshAll],
  );

  const handleRefresh = useCallback(
    async (platformId: string) => {
      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) return;

      setRefreshingPlatforms((prev) => ({ ...prev, [platformId]: true }));

      try {
        const platformData = (user as any)?.[platformId];

        switch (platformId.toLowerCase()) {
          case "youtube":
            await syncYoutube(userId);
            break;
          case "facebook": {
            const pageId = platformData?.project_id;
            if (!pageId) {
              throw new Error(
                "Facebook Page ID not found. Please connect your account again.",
              );
            }
            await syncFacebook(userId, pageId);
            break;
          }
          default:
            toast.info(`${platformId} synchronization logic not yet implemented.`);
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
    },
    [user, onRefreshAll],
  );

  return {
    stats,
    dateRange,
    setDateRange,
    refreshingPlatforms,
    handleConnect,
    handleDisconnect,
    handleRefresh,
  };
}
