"use client";
import React, {
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import Layout from "@/screens/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import AnomalyCard from "@/screens/socialMedia/components/Dashboard/AnomalyCard";
import { getYoutubeDashboardData } from "@/utils/api/social/social.api";
import AuthContext from "@/contexts/authContext/authContext";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import YouTubeAnalyticsGrid from "./components/YouTubeAnalyticsGrid";
import ReachFunnel from "./components/ReachFunnel";
import RetentionAnalytic from "./components/RetentionAnalytic";
import DemographicsCharts from "./components/DemographicsCharts";
import TopVideosRank from "./components/TopVideosRank";
import RevenueOverview from "./components/RevenueOverview";
import DiscoveryDetails from "./components/DiscoveryDetails";
import CommunityEngagement from "./components/CommunityEngagement";
import GeographySection from "./components/GeographySection";
import RecentPostsList from "./components/RecentPostsList";
import PostActivity from "@/screens/socialMedia/components/Dashboard/PostActivity";

import {
  Award,
  Activity,
  Search,
  Users2,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

import YouTubeHeader from "./components/YouTubeHeader";
import YouTubeStatsDeck from "./components/YouTubeStatsDeck";
import YouTubeNavigation from "./components/YouTubeNavigation";
import YouTubeOverviewTab from "./components/YouTubeOverviewTab";
import YouTubeGrowthCard from "./components/YouTubeGrowthCard";
import ConfirmationModal from "@/components/shared/ConfirmationModal/ConfirmationModal";

const YouTubeStatsDashboard = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("LAST_28_DAYS");
  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const fetchYoutubeDashboardData = useCallback(async () => {
    const userId = (user as any)?._id || (user as any)?.id;
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getYoutubeDashboardData(userId);
      setRawData(
        response?.result?.data ||
          response?.data?.data ||
          response?.result ||
          response?.data ||
          response,
      );
    } catch (err: any) {
      console.error("Failed to fetch YouTube dashboard data:", err);
      setError(err.message || "Failed to load YouTube data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchYoutubeDashboardData();
  }, [fetchYoutubeDashboardData]);

  const data = useMemo(() => {
    if (!rawData) return null;
    const result = { ...rawData };

    // Normalize data structure for inconsistent API responses
    if (!result.analytics?.dailyTrend && result.postActivity?.growthTrend) {
      if (!result.analytics) result.analytics = {};
      result.analytics.dailyTrend = result.postActivity.growthTrend;
    }

    if (!result.analytics?.overview) {
      if (!result.analytics) result.analytics = {};
      const trendAggregates = (result.postActivity?.growthTrend || []).reduce(
        (acc: any, curr: any) => ({
          views: acc.views + (Number(curr.views) || 0),
          subs: acc.subs + (Number(curr.subscribersGained) || 0),
        }),
        { views: 0, subs: 0 },
      );

      result.analytics.overview = {
        views:
          trendAggregates.views || result.channel?.statistics?.viewCount || 0,
        subscribersGained:
          trendAggregates.subs ||
          result.channel?.statistics?.subscriberCount ||
          0,
        subscribersLost: result.analytics?.overview?.subscribersLost || 0,
        netSubscribers:
          (trendAggregates.subs || 0) -
          (result.analytics?.overview?.subscribersLost || 0),
        videoCount: result.channel?.statistics?.videoCount || 0,
      };
    }

    if (!result.dashboard?.overview28d) {
      if (!result.dashboard) result.dashboard = {};
      result.dashboard.overview28d = {
        totalViews: result.analytics.overview.views,
        netSubscribers:
          result.analytics.overview.netSubscribers ||
          result.analytics.overview.subscribersGained,
        totalWatchTimeHours: 0,
        subscribersGained: result.analytics.overview.subscribersGained,
      };
    }

    return result;
  }, [rawData]);

  const handleDisconnect = async () => {
    if (isDisconnecting) return;
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      const res = await fetch("/api/youtube/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      if (res.ok) {
        toast.success("YouTube disconnected");
        router.push("/site/social-media");
      }
    } catch (err) {
      toast.error("Failed to disconnect");
    } finally {
      setIsDisconnecting(false);
      setShowDisconnectModal(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  if (error || !data) {
    return (
      <Layout>
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8">
          <div className="bg-white/60 backdrop-blur-2xl p-12 rounded-[50px] shadow-2xl text-center max-w-md border border-white">
            <div className="w-20 h-20 bg-red-50/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100/30">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
              Account Sync Offline
            </h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              We couldn't establish a secure connection with your YouTube Data.
              Please verify your API credentials or reconnect the account.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white px-10 py-5 rounded-3xl font-black hover:opacity-90 transition-all shadow-xl shadow-orange-200 uppercase tracking-widest text-xs"
              >
                Retry Synchronization
              </button>
              <button
                onClick={() => router.push("/site/social-media")}
                className="w-full bg-slate-900 text-white px-10 py-5 rounded-3xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 block text-center uppercase tracking-widest text-xs"
              >
                Back to Center
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "reach", label: "Discovery & Reach", icon: Search },
    { id: "audience", label: "Audience", icon: Users2 },
    { id: "community", label: "Community & Schedule", icon: MessageSquare },
    { id: "revenue", label: "Revenue", icon: Award },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#EAEEF6] p-4 lg:p-12 font-sans">
        <div className="max-w-[1700px] mx-auto space-y-12">
          <YouTubeHeader data={data} />

          <YouTubeNavigation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dateRange={dateRange}
            setDateRange={setDateRange}
            handleDisconnect={handleDisconnect}
          />
        </div>

        <div className="max-w-[1700px] mx-auto px-4 lg:px-12 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  {activeTab === "overview" && (
                    <YouTubeOverviewTab data={data} dateRange={dateRange} />
                  )}

                  {activeTab === "reach" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <ReachFunnel reach={data?.analytics?.reach} />
                      <DiscoveryDetails
                        searchTerms={data?.analytics?.topSearchTerms}
                        externalSites={data?.analytics?.topExternalSites}
                      />
                      <RetentionAnalytic
                        retention={data?.analytics?.retention}
                      />
                      <TopVideosRank topVideos={data?.analytics?.topVideos} />
                    </div>
                  )}

                  {activeTab === "audience" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <DemographicsCharts
                        demographics={{
                          gender: data?.demographics?.gender,
                          ageRange:
                            data?.demographics?.age ||
                            data?.demographics?.ageRange,
                        }}
                      />
                      <GeographySection
                        topLocations={
                          data?.demographics?.topLocations ||
                          data?.analytics?.audience?.topLocations ||
                          []
                        }
                      />
                    </div>
                  )}

                  {activeTab === "community" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <CommunityEngagement
                        comments={data?.comments}
                        subscribers={data?.subscribers}
                        schedule={data?.schedule}
                      />
                    </div>
                  )}

                  {activeTab === "revenue" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <RevenueOverview revenue={data?.analytics?.revenue} />
                      <div className="bg-white/60 p-12 rounded-[50px] shadow-sm border border-white backdrop-blur-2xl flex flex-col justify-center text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg
                            className="w-8 h-8 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">
                          Monetization Insight
                        </h3>
                        <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                          Your estimated revenue is calculated based on ad
                          impressions and playback based CPM. Keep creating
                          high-retention content to increase your earnings
                          potential.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Side Information Panel */}
            <div className="lg:col-span-4 space-y-12">
              <RecentPostsList videos={data?.recentVideos} />

              <PostActivity activity={data?.postActivity} platform="youtube" />

              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-2">
                  Content Mix
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-3xl bg-blue-50/50 border border-blue-100 flex flex-col items-center gap-2 group hover:bg-white hover:shadow-lg transition-all">
                    <span className="text-xl font-black text-blue-600">
                      {data?.postActivity?.videos || 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Videos
                    </span>
                  </div>
                  <div className="p-4 rounded-3xl bg-pink-50/50 border border-pink-100 flex flex-col items-center gap-2 group hover:bg-white hover:shadow-lg transition-all">
                    <span className="text-xl font-black text-pink-600">
                      {data?.postActivity?.shorts || 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Shorts
                    </span>
                  </div>
                  <div className="p-4 rounded-3xl bg-red-50/50 border border-red-100 flex flex-col items-center gap-2 group hover:bg-white hover:shadow-lg transition-all">
                    <span className="text-xl font-black text-red-600">
                      {data?.postActivity?.lives || 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Lives
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12">
            <div className="h-full">
              <AnomalyCard
                statistics={data?.channel?.statistics}
                platform="youtube"
              />
            </div>
            <YouTubeGrowthCard data={data} activeTab={activeTab} />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onConfirm={confirmDisconnect}
        title="Disconnect YouTube?"
        description="Are you sure you want to disconnect your YouTube account? You can reconnect at any time to resume analytics tracking."
        confirmText="Disconnect Now"
        type="danger"
        isLoading={isDisconnecting}
      />
    </Layout>
  );
};

export default YouTubeStatsDashboard;
