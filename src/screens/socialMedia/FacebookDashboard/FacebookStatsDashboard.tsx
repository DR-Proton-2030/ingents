"use client";
import React, { useContext, useState, useMemo } from "react";
import Layout from "@/screens/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  PlayCircle,
  Share2,
  Activity,
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  Globe,
  Monitor,
  AlertCircle,
  Eye,
  Clock,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useFacebookDetails } from "@/hooks/useFacebookDetails";
import AuthContext from "@/contexts/authContext/authContext";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Types
import { FacebookDashboardResponse } from "./types";

// Components
import FBStatCard from "./components/FBStatCard";
import { FBLineChart, FBDonutChart, FBBarChart } from "./components/FBCharts";
import FBContentList from "./components/FBContentList";
import Header from "@/screens/socialMedia/components/Header";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import DateRangeFilter from "@/components/shared/DateRangeFilter";
import ConfirmationModal from "@/components/shared/ConfirmationModal/ConfirmationModal";

const TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "content", label: "Content", icon: PlayCircle },
  { id: "engagement", label: "Engagement", icon: Share2 },
  { id: "audience", label: "Audience", icon: Users },
  { id: "traffic", label: "Traffic Sources", icon: Globe },
];

const FacebookStatsDashboard = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [dateRange, setDateRange] = useState("LAST_28_DAYS");

  const userId = (user as any)?._id || (user as any)?.id;

  const {
    data: liveData,
    loading,
    error,
  } = useFacebookDetails(
    userId,
    (user as any)?.facebook?.project_id,
    dateRange,
  );

  const dashboardData = useMemo(() => {
    return liveData;
  }, [liveData]);

  // Check if account has zero activity data
  const isDataEmpty = useMemo(() => {
    if (!dashboardData) return false;
    return (
      (dashboardData.overview?.views === 0 ||
        dashboardData.overview?.views == null) &&
      (!dashboardData.content?.publishedContent ||
        dashboardData.content?.publishedContent?.length === 0) &&
      (dashboardData.engagement?.totals?.total === 0 ||
        dashboardData.engagement?.totals?.total == null)
    );
  }, [dashboardData]);

  const handleDisconnect = async () => {
    if (isDisconnecting) return;
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      const res = await fetch("/api/facebook/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        toast.success("Facebook disconnected");
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

  if (error || !dashboardData) {
    return (
      <Layout>
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8">
          <div className="bg-white/60 backdrop-blur-2xl p-12 rounded-[50px] shadow-sm text-center max-w-md border border-white">
            <div className="w-20 h-20 bg-red-50/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100/30">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
              API Sync Failed
            </h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              {error ||
                "We couldn't reach your Facebook data. Ensure your page is properly authorized and connected."}
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-5 rounded-3xl font-black hover:opacity-90 transition-all shadow-md uppercase tracking-widest text-xs"
              >
                Retry Synchronization
              </button>
              <Link
                href="/site/social-media"
                className="w-full bg-slate-900 text-white px-10 py-5 rounded-3xl font-black hover:bg-slate-800 transition-all shadow-md block text-center uppercase tracking-widest text-xs"
              >
                Back to Center
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { page, overview, content, engagement, audience, trafficSources } =
    dashboardData;

  return (
    <Layout>
      <div className="min-h-screen bg-transparent pb-24 font-sans">
        <div className="max-w-[1700px] mx-auto px-4 lg:px-12 py-8">
          <div className="flex items-center justify-between gap-4">
            <Header />
            <Link
              href="/site/social-media"
              className="bg-white/70 backdrop-blur-xl text-slate-900 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-white transition-colors border border-white/40 shadow-sm"
            >
              Back to Social Media
            </Link>
          </div>
        </div>

        <div className="max-w-[1700px] mx-auto space-y-12 px-4 lg:px-12">
          {/* Page Profile Header */}
          <section className="relative pt-6 pb-2">
            <div className="absolute inset-0 -mt-24 -mx-10 rounded-b-[40px] bg-gradient-to-b from-white/80 via-blue-50/40 to-transparent pointer-events-none border-b border-white/50 backdrop-blur-sm" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative group"
                >
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100 bg-white">
                    {page?.picture?.data?.url ? (
                      <img
                        src={page.picture.data.url}
                        className="w-full h-full object-cover"
                        alt={page?.name || "Page"}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-200" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-2 text-white rounded-full shadow-lg border-2 border-white">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                </motion.div>

                <div className="space-y-4 text-center md:text-left mt-2 md:mt-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                      {page?.name || "Unknown Page"}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600 font-bold text-sm">
                    {page?.category && (
                      <span className="flex items-center gap-2 bg-slate-50/80 px-4 py-2 rounded-2xl shadow-sm border border-slate-200/50 backdrop-blur-sm">
                        <Activity className="w-4 h-4 text-blue-500" />{" "}
                        {page.category}
                      </span>
                    )}
                    {page?.fan_count != null && (
                      <span className="flex items-center gap-2 bg-slate-50/80 px-4 py-2 rounded-2xl shadow-sm border border-slate-200/50 backdrop-blur-sm">
                        <Users className="w-4 h-4 text-blue-500" />{" "}
                        {formatCompactNumber(page.fan_count)}{" "}
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 ml-1">
                          Followers
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {page?.link && (
                <div className="w-full md:w-auto mt-4 md:mt-8">
                  <a
                    href={page.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-4 rounded-[28px] text-xs font-black uppercase tracking-widest hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> View Page
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Navigation Bar */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6 p-2 bg-white/60 backdrop-blur-md rounded-[32px] border border-white/50 shadow-sm">
            <div className="flex items-center gap-1 w-full xl:w-auto overflow-x-auto no-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3.5 rounded-3xl cursor-pointer text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap relative group ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="fbActiveTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl shadow-[0_10px_28px_-12px_rgba(59,130,246,0.65)]"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <Icon
                      className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}
                    />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 w-full xl:w-auto justify-between md:justify-end">
              <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-xs">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative group">
                  <button
                    onClick={handleDisconnect}
                    className="w-11 h-11 bg-red-400 cursor-pointer text-white hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-slate-100 shadow-sm active:scale-95"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-2xl z-[100]">
                    Disconnect Account
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                  </div>
                </div>
                <Link
                  href="/site/social-media"
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Back Center
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            {isDataEmpty ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 p-16 sm:p-24 rounded-[40px] border border-white/80 backdrop-blur-3xl shadow-sm text-center space-y-8"
              >
                <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto border border-blue-100/30">
                  <Activity className="w-12 h-12 text-blue-500 opacity-40 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-4">
                    No Insights Available Yet
                  </h2>
                  <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                    It looks like this account doesn't have enough recent
                    activity to generate insights. Data will appear here
                    automatically once there are views or new posts on your
                    page.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                {activeTab === "overview" && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <FBStatCard
                        title="Total Views"
                        value={overview.views}
                        icon={<Eye className="w-6 h-6" />}
                        variant="default"
                      />
                      <FBStatCard
                        title="Minutes Watched"
                        value={overview.watchTime}
                        subtitle="Combined video watch time"
                        variant="default"
                        formatter={(val) => formatCompactNumber(val)}
                        icon={<Clock className="w-6 h-6" />}
                      />
                      <FBStatCard
                        title="Net Following"
                        value={overview.netFollowers}
                        variant="default"
                        trend={{
                          value: Math.round(
                            (overview.followersGained /
                              (overview.netFollowers || 1)) *
                              100,
                          ),
                          isPositive: true,
                        }}
                        icon={<Users className="w-6 h-6" />}
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                      <div className="lg:col-span-8">
                        <FBLineChart
                          data={overview.viewsOverTime}
                          xKey="date"
                          yKey="views"
                          title="Audience Engagement Trend"
                        />
                      </div>
                      <div className="lg:col-span-4">
                        <FBContentList
                          title="Top Performing Posts"
                          content={overview.topContent}
                          layout="list"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="space-y-10">
                    <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/60 backdrop-blur-xl shadow-sm p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/70 via-white/40 to-blue-50/70 pointer-events-none" />
                      <div className="relative z-10 text-center sm:text-left mb-6 sm:mb-0">
                        <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-3">
                          Total Content Impressions
                        </p>
                        <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                          {formatCompactNumber(content.totalViews)}
                        </h2>
                      </div>
                      <div className="relative z-10 p-6 bg-blue-500/10 backdrop-blur-md rounded-full text-blue-600 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20">
                        <PlayCircle className="w-12 h-12" />
                      </div>
                    </div>

                    <FBContentList
                      title="Recent Published Content"
                      content={content.publishedContent as any}
                      layout="grid"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                      <FBDonutChart
                        title="Viewer Demographic Type"
                        data={content.viewerTypes}
                        disabled={content.viewerTypeUnavailable}
                        tooltipText="Facebook does not expose viewer type breakdown via API"
                      />
                      <div className="bg-white/70 p-10 rounded-[32px] shadow-sm border border-white/50 backdrop-blur-xl flex flex-col justify-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <AlertCircle className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">
                          Content Insight
                        </h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed text-sm">
                          Video content typically generates more engagement than
                          static images on your page.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "engagement" && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <FBStatCard
                        title="Reactions"
                        value={engagement.totals.reactions}
                        icon={<ThumbsUp className="w-6 h-6" />}
                        variant="default"
                      />
                      <FBStatCard
                        title="Comments"
                        value={engagement.totals.comments}
                        icon={<MessageCircle className="w-6 h-6" />}
                        variant="default"
                      />
                      <FBStatCard
                        title="Shares"
                        value={engagement.totals.shares}
                        icon={<Share2 className="w-6 h-6" />}
                        variant="default"
                      />
                      <FBStatCard
                        title="Total Interactions"
                        value={engagement.totals.total}
                        icon={<Activity className="w-6 h-6" />}
                        variant="default"
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                      <div className="lg:col-span-5">
                        <FBDonutChart
                          title="Interactions Breakdown"
                          data={[
                            {
                              label: "Reactions",
                              value: engagement.totals.reactions,
                            },
                            {
                              label: "Comments",
                              value: engagement.totals.comments,
                            },
                            {
                              label: "Shares",
                              value: engagement.totals.shares,
                            },
                          ]}
                        />
                      </div>
                      <div className="lg:col-span-7">
                        <FBLineChart
                          title="Interaction Velocity Over Time"
                          data={[]}
                          xKey="date"
                          yKey="value"
                          disabled={engagement.engagementOverTimeUnavailable}
                          tooltipText="Facebook does not expose engagement trends via current API version"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "audience" && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                      <div className="lg:col-span-4 flex flex-col gap-8">
                        <FBStatCard
                          title="Total Fanbase"
                          value={audience.followers}
                          icon={<Users className="w-6 h-6" />}
                        />
                        <FBDonutChart
                          title="Retention Split"
                          data={audience.watchTimeSplit}
                          disabled={audience.watchTimeSplitUnavailable}
                          tooltipText="Facebook does not expose detailed watch time split via Meta Graph API"
                        />
                      </div>
                      <div className="lg:col-span-8">
                        <FBBarChart
                          title="Audience Composition: Age & Gender"
                          data={audience.demographics.ageGender}
                          xKey="age"
                          bars={[
                            { key: "male", color: "#3B82F6", label: "Male" },
                            {
                              key: "female",
                              color: "#60A5FA",
                              label: "Female",
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                      <FBBarChart
                        title="Top Countries"
                        data={audience.demographics.countries}
                        xKey="name"
                        layout="vertical"
                        bars={[
                          {
                            key: "percent",
                            color: "#3B82F6",
                            label: "Percentage (%)",
                          },
                        ]}
                      />
                      <FBBarChart
                        title="Top Cities"
                        data={audience.demographics.cities}
                        xKey="name"
                        layout="vertical"
                        bars={[
                          {
                            key: "percent",
                            color: "#3B82F6",
                            label: "Percentage (%)",
                          },
                        ]}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "traffic" && (
                  <div className="space-y-10">
                    <FBBarChart
                      title="Traffic Source Attribution"
                      data={trafficSources.sources}
                      xKey="source"
                      layout="vertical"
                      bars={[
                        {
                          key: "percentage",
                          color: "#3B82F6",
                          label: "Percentage (%)",
                        },
                      ]}
                      disabled={trafficSources.trafficSourcesUnavailable}
                      tooltipText={trafficSources.reason}
                    />
                    {trafficSources.trafficSourcesUnavailable && (
                      <div className="bg-slate-50/50 border border-slate-200 p-8 rounded-3xl flex items-center gap-6 text-slate-800 shadow-sm">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <AlertCircle className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-1">
                            Data Source Limitation
                          </h4>
                          <p className="text-sm font-medium opacity-80 leading-relaxed text-slate-500">
                            {trafficSources.reason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Impressions Section (Restricted) */}
          <div className="mt-16 pt-12 border-t border-slate-200/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-100/50 rounded-2xl text-slate-500">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                  Restricted Studio Metrics
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FBStatCard
                title="Total Impressions"
                value={0}
                disabled
                variant="default"
                tooltipText="Facebook does not expose impressions via Meta Graph API"
              />
              <FBStatCard
                title="Ads Click-through Rate"
                value={0}
                disabled
                variant="default"
                tooltipText="Meta Graph API restriction"
              />
              <FBStatCard
                title="Impressions Watch Time"
                value={0}
                disabled
                variant="default"
                tooltipText="Unavailable metric"
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onConfirm={confirmDisconnect}
        title="Disconnect Facebook?"
        description="Are you sure you want to disconnect your Facebook Page? You can reconnect at any time to resume analytics tracking."
        confirmText="Disconnect Now"
        type="danger"
        isLoading={isDisconnecting}
      />
    </Layout>
  );
};

export default FacebookStatsDashboard;
