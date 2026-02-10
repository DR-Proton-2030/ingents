"use client";
import React, { useContext, useState, useMemo } from "react";
import Layout from "@/screens/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  PlayCircle, 
  Share2, 
  PieChart, 
  Activity, 
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  Globe,
  Monitor,
  AlertCircle,
  Eye,
  Clock,
  ArrowRight
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

const TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "content", label: "Content", icon: PlayCircle },
  { id: "engagement", label: "Engagement", icon: Share2 },
  { id: "audience", label: "Audience", icon: Users },
  { id: "traffic", label: "Traffic Sources", icon: Globe },
];

const FacebookStatsDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [dateRange, setDateRange] = useState("LAST_28_DAYS");

  const { data: liveData, loading, error } = useFacebookDetails((user as any)?._id || user?.id, user?.facebook?.project_id, dateRange);

  const dashboardData = useMemo(() => {
    return liveData;
  }, [liveData]);

  const facebookConnected = React.useMemo(() => {
    return Boolean((user as any)?.facebook?.access_token || (user as any)?.facebook?.page_id);
  }, [user]);

  // Check if account has zero activity data
  const isDataEmpty = useMemo(() => {
    if (!dashboardData) return false;
    return (
      (dashboardData.overview?.views === 0) && 
      (dashboardData.content?.publishedContent?.length === 0) &&
      (dashboardData.engagement?.totals?.total === 0)
    );
  }, [dashboardData]);

  const handleDisconnect = async () => {
    if (isDisconnecting) return;
    const confirmed = window.confirm("Disconnect Facebook? You can reconnect anytime.");
    if (!confirmed) return;

    try {
      setIsDisconnecting(true);
      const res = await fetch("/api/facebook/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      if (res.ok) {
        toast.success("Facebook disconnected");
        router.push("/site/social-media");
      }
    } catch (err) {
      toast.error("Failed to disconnect");
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  if (error || !dashboardData) {
    return (
      <Layout>
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8">
          <div className="bg-white/60 backdrop-blur-2xl p-12 rounded-[50px] shadow-2xl text-center max-w-md border border-white">
            <div className="w-20 h-20 bg-red-50/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100/30">
               <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">API Sync Failed</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">{error || "We couldn't reach your Facebook data. Ensure your page is properly authorized and connected."}</p>
            <div className="flex flex-col gap-4">
               <button 
                 onClick={() => window.location.reload()}
                 className="w-full bg-[#1877F2] text-white px-10 py-5 rounded-3xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 uppercase tracking-widest text-xs"
               >
                 Retry Synchronization
               </button>
               <Link href="/site/social-media" className="w-full bg-slate-900 text-white px-10 py-5 rounded-3xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 block text-center uppercase tracking-widest text-xs">
                 Back to Center
               </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  const { page, overview, content, engagement, audience, trafficSources, impressions } = dashboardData;

  return (
    <Layout>
      <div className="min-h-screen bg-transparent pb-24 font-sans">
        
        {/* Top Navigation Header Integration */}
        <div className="max-w-[1700px] mx-auto px-4 lg:px-12 py-8">
          <Header />
        </div>

        <div className="max-w-[1700px] mx-auto space-y-12 px-4 lg:px-12">
          
          {/* Page Profile Header */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[60px] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-white rounded-[50px] shadow-2xl shadow-blue-100 overflow-hidden border border-white">
              {/* Cover Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <img 
                  src={page.cover.source} 
                  alt="Cover" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Profile Info Overlay */}
              <div className="relative px-12 pb-10 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                <div className="relative -mt-24 group/avatar">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur opacity-40 animate-pulse"></div>
                  <img 
                    src={page.picture.data.url} 
                    alt={page.name} 
                    className="relative w-40 h-40 rounded-full border-8 border-white shadow-2xl object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-4 border-white">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mb-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{page.name}</h1>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-bold text-sm">
                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <Activity className="w-4 h-4 text-blue-500" /> {page.category}
                    </span>
                    <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <Users className="w-4 h-4 text-blue-500" /> {formatCompactNumber(page.fan_count)} <span className="text-[10px] uppercase tracking-widest text-slate-400 opacity-70">Followers</span>
                    </span>
                    <a 
                      href={page.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-all hover:translate-x-1"
                    >
                     <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 mb-2">
                  <a 
                    href={page.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-slate-900 text-white px-10 py-5 rounded-[28px] text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-200"
                  >
                    Manage Page
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex overflow-x-auto gap-3 p-3 bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white/60 w-fit shadow-xl shadow-blue-900/5 hidescroll">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-10 py-5 rounded-[30px] font-black text-xs uppercase tracking-[0.15em] whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-xl shadow-orange-500/30 scale-105" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
            </div>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
          </div>

          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            {isDataEmpty ?
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 p-24 rounded-[60px] border border-white/80 backdrop-blur-3xl shadow-2xl text-center space-y-8"
              >
                <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto border border-blue-100/30">
                  <Activity className="w-12 h-12 text-blue-500 opacity-40 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">No Insights Available Yet</h2>
                  <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                    It looks like this account doesn't have enough recent activity to generate insights. 
                    Data will appear here automatically once there are views or new posts on your page.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <a 
                    href={page.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1877F2] text-white px-10 py-5 rounded-[28px] text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
                  >
                    Go to Facebook Page
                  </a>
                </div>
              </motion.div>
            : 
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
              {activeTab === "overview" && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FBStatCard title="Total Views" value={overview.views} icon={<Eye className="w-6 h-6" />} variant="blue" />
                    <FBStatCard 
                      title="Minutes Watched" 
                      value={overview.watchTime} 
                      subtitle="Combined video watch time"
                      variant="emerald"
                      formatter={(val) => formatCompactNumber(val)}
                      icon={<Clock className="w-6 h-6" />} 
                    />
                    <FBStatCard 
                      title="Net Following" 
                      value={overview.netFollowers} 
                      variant="red"
                      trend={{ value: Math.round((overview.followersGained / (overview.netFollowers || 1)) * 100), isPositive: true }}
                      icon={<Users className="w-6 h-6" />} 
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                      <FBLineChart 
                        data={overview.viewsOverTime} 
                        xKey="date" 
                        yKey="views" 
                        title="Audience Engagement Trend" 
                      />
                    </div>
                    <div className="lg:col-span-4">
                      <FBContentList title="Top Performing Posts" content={overview.topContent} layout="list" />
                    </div>
                  </div>
                </div>
              )}

               {activeTab === "content" && (
                <div className="space-y-12">
                  <div className="bg-white/60 p-12 rounded-[50px] shadow-xl backdrop-blur-2xl border border-white flex items-center justify-between group">
                    <div>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3">Lifecycle Insight</p>
                      <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
                        {formatCompactNumber(content.totalViews)}
                        <span className="text-xl text-slate-400 ml-4 font-bold tracking-normal uppercase opacity-60">Total Content Impressions</span>
                      </h2>
                    </div>
                    <div className="p-8 bg-blue-50/50 backdrop-blur-md rounded-[40px] text-blue-600 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-blue-100/30">
                      <PlayCircle className="w-16 h-16" />
                    </div>
                  </div>
                  
                  <FBContentList title="Recent Published Content" content={content.publishedContent as any} layout="grid" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <FBDonutChart 
                      title="Viewer Demographic Type" 
                      data={content.viewerTypes} 
                      disabled={content.viewerTypeUnavailable}
                      tooltipText="Facebook does not expose viewer type breakdown via API"
                    />
                    <div className="bg-white/60 p-12 rounded-[50px] shadow-xl border border-white backdrop-blur-2xl flex flex-col justify-center text-center">
                       <div className="w-16 h-16 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100/30">
                          <AlertCircle className="w-8 h-8 text-blue-600" />
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 mb-2">Content Insight</h3>
                       <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                         Video content typically generates 3x more engagement than static images on your page.
                       </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "engagement" && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FBStatCard title="Reactions" value={engagement.totals.reactions} icon={<ThumbsUp />} variant="blue" />
                    <FBStatCard title="Comments" value={engagement.totals.comments} icon={<MessageCircle />} variant="emerald" />
                    <FBStatCard title="Shares" value={engagement.totals.shares} icon={<Share2 />} variant="amber" />
                    <FBStatCard title="Total Interactions" value={engagement.totals.total} icon={<Activity />} variant="red" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                      <FBDonutChart 
                        title="Interactions Breakdown" 
                        data={[
                          { label: "Reactions", value: engagement.totals.reactions },
                          { label: "Comments", value: engagement.totals.comments },
                          { label: "Shares", value: engagement.totals.shares }
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
                <div className="space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4">
                      <FBStatCard title="Total Fanbase" value={audience.followers} icon={<Users />} />
                      <div className="mt-8">
                        <FBDonutChart 
                          title="Retention Split" 
                          data={audience.watchTimeSplit} 
                          disabled={audience.watchTimeSplitUnavailable}
                          tooltipText="Facebook does not expose detailed watch time split via Meta Graph API"
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-8">
                      <FBBarChart 
                        title="Audience Composition: Age & Gender" 
                        data={audience.demographics.ageGender} 
                        xKey="age"
                        bars={[
                          { key: "male", color: "#1877F2", label: "Male" },
                          { key: "female", color: "#F472B6", label: "Female" }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <FBBarChart 
                      title="Geographic Insights: Top Countries" 
                      data={audience.demographics.countries} 
                      xKey="name"
                      layout="vertical"
                      bars={[{ key: "percent", color: "#1877F2", label: "Percentage (%)" }]}
                    />
                    <FBBarChart 
                      title="Geographic Insights: Top Cities" 
                      data={audience.demographics.cities} 
                      xKey="name"
                      layout="vertical"
                      bars={[{ key: "percent", color: "#1877F2", label: "Percentage (%)" }]}
                    />
                  </div>
                </div>
              )}

              {activeTab === "traffic" && (
                <div className="space-y-12">
                  <FBBarChart 
                    title="Traffic Source Attribution" 
                    data={trafficSources.sources} 
                    xKey="source"
                    layout="vertical"
                    bars={[{ key: "percentage", color: "#42B72A", label: "Percentage (%)" }]}
                    disabled={trafficSources.trafficSourcesUnavailable}
                    tooltipText={trafficSources.reason}
                  />
                  {trafficSources.trafficSourcesUnavailable && (
                    <div className="bg-amber-50 border border-amber-200 p-8 rounded-[40px] flex items-center gap-6 text-amber-800 shadow-sm shadow-amber-900/5">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black mb-1">Data Source Limitation</h4>
                        <p className="text-sm font-medium opacity-80 leading-relaxed">{trafficSources.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              </motion.div>
            }
          </AnimatePresence>

          {/* Impressions Section (Restricted) */}
          <div className="mt-20 pt-20 border-t border-slate-200">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-amber-50 rounded-3xl text-amber-500">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Restricted Studio Metrics</h3>
                <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em] mt-1">Platform Restrictions Apply</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
              <FBStatCard title="Total Impressions" value={0} disabled variant="amber" tooltipText="Facebook does not expose impressions via Meta Graph API" />
              <FBStatCard title="Ads Click-through Rate" value={0} disabled variant="amber" tooltipText="Meta Graph API restriction" />
              <FBStatCard title="Impressions Watch Time" value={0} disabled variant="amber" tooltipText="Unavailable metric" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6 p-10 bg-white/60 backdrop-blur-2xl rounded-[50px] shadow-xl border border-white">
             <div className="text-center sm:text-left">
               <h4 className="text-xl font-black text-slate-900 mb-1">Management Hub</h4>
               <p className="text-sm font-medium text-slate-400">Manage your linked accounts and dashboard settings.</p>
             </div>
             <div className="flex flex-wrap justify-center gap-4">
               <button
                 onClick={handleDisconnect}
                 disabled={!facebookConnected || isDisconnecting}
                 className="px-8 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest border transition-all bg-white/80 text-red-600 border-red-50 hover:bg-red-50 active:scale-95 disabled:opacity-50 shadow-sm"
               >
                 {isDisconnecting ? "Processing..." : "Disconnect Page"}
               </button>
               <Link 
                 href="/site/social-media" 
                 className="bg-slate-900 text-white px-8 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-400/20 flex items-center gap-3"
               >
                 Return to Center <ArrowRight className="w-4 h-4" />
               </Link>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );

};

export default FacebookStatsDashboard;
