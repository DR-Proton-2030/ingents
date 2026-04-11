"use client";

import PlatformStatCard from "./PlatformStatCard";
import type { PlatformStat } from "./types";

interface SocialAnalyticsStatsGridProps {
  stats: PlatformStat[];
  refreshingPlatforms: Record<string, boolean>;
  onConnect: (platformId: string) => void;
  onManage: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
  onRefresh: (platformId: string) => void;
}

export default function SocialAnalyticsStatsGrid({
  stats,
  refreshingPlatforms,
  onConnect,
  onManage,
  onDisconnect,
  onRefresh,
}: SocialAnalyticsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((platform, index) => (
        <PlatformStatCard
          key={platform.id}
          {...platform}
          index={index}
          onConnect={() => onConnect(platform.id)}
          onManage={() => onManage(platform.id)}
          onDisconnect={() => onDisconnect?.(platform.id)}
          onRefresh={() => onRefresh(platform.id)}
          refreshing={refreshingPlatforms[platform.id]}
        />
      ))}
    </div>
  );
}
