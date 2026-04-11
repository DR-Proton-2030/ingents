import React from "react";

export interface PlatformStat {
  id: string;
  name: string;
  icon: React.ReactNode;
  followers: string;
  views?: string;
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
  chartData?: Array<{ month: string; followers: number; viewers: number }>;
  metrics?: any;
  onRefreshAll?: () => void;
}
