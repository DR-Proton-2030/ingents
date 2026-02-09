export interface FacebookPageData {
  id: string;
  name: string;
  about: string;
  fan_count: number;
  link: string;
  cover: {
    cover_id: string;
    offset_x: number;
    offset_y: number;
    source: string;
  };
  category: string;
  picture: {
    data: {
      url: string;
    };
  };
}

export interface OverviewData {
  views: number;
  views3s: number;
  views1m: number;
  watchTime: number;
  threeSecondViewsUnavailable: boolean;
  oneMinuteViewsUnavailable: boolean;
  followersGained: number;
  followersLost: number;
  netFollowers: number;
  viewsOverTime: { date: string; views: number }[];
  topContent: {
    id: string;
    title: string;
    views: number;
    watchTime: number;
  }[];
}

export interface ContentData {
  totalViews: number;
  publishedContent: {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    views: number;
    type?: "Post" | "Video";
  }[];
  viewerTypeUnavailable: boolean;
  viewerTypes: { label: string; value: number }[];
}

export interface EngagementData {
  totals: {
    reactions: number;
    comments: number;
    shares: number;
    total: number;
  };
  engagementOverTimeUnavailable: boolean;
}

export interface AudienceData {
  followers: number;
  totalViews: number;
  watchTimeSplitUnavailable: boolean;
  watchTimeSplit: { label: string; value: number }[];
  demographics: {
    ageGender: { age: string; male: number; female: number }[];
    countries: { name: string; percent: number }[];
    cities: { name: string; percent: number }[];
  };
}

export interface TrafficSourcesData {
  sources: { source: string; percentage: number }[];
  trafficSourcesUnavailable: boolean;
  reason: string;
}

export interface ImpressionsData {
  impressionsUnavailable: boolean;
  reason: string;
  impressions: number;
  ctr: number;
  watchTimeFromImpressions: number;
}

export interface FacebookDashboardResponse {
  success: boolean;
  result: {
    page: FacebookPageData;
    overview: OverviewData;
    content: ContentData;
    engagement: EngagementData;
    audience: AudienceData;
    trafficSources: TrafficSourcesData;
    impressions: ImpressionsData;
  };
}
