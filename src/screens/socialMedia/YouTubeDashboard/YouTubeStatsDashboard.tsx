"use client";
import React, { useContext, useMemo, useState } from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import Layout from "@/screens/layout/Layout";
import { motion } from "framer-motion";
import ProfileCard from "@/screens/socialMedia/components/Dashboard/ProfileCard";
import PostActivity from "@/screens/socialMedia/components/Dashboard/PostActivity";
import PostSchedule from "@/screens/socialMedia/components/Dashboard/PostSchedule";
import ProfileViews from "@/screens/socialMedia/components/Dashboard/ProfileViews";
import AnomalyCard from "@/screens/socialMedia/components/Dashboard/AnomalyCard";
import PostInsights from "@/screens/socialMedia/components/Dashboard/PostInsights";
import YourAccounts from "@/screens/socialMedia/components/Dashboard/YourAccounts";
import Header from "@/screens/socialMedia/components/Header";
import Link from "next/link";
import { useYouTubeDetails } from "@/hooks/useYouTubeDetails";
import AuthContext from "@/contexts/authContext/authContext";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import YouTubeAnalyticsGrid from "./components/YouTubeAnalyticsGrid";
import VideosTable from "./components/VideosTable";
import ReachFunnel from "./components/ReachFunnel";
import RetentionAnalytic from "./components/RetentionAnalytic";
import DemographicsCharts from "./components/DemographicsCharts";
import InsightsCharts from "./components/InsightsCharts";
import TopVideosRank from "./components/TopVideosRank";
import RevenueOverview from "./components/RevenueOverview";
import DiscoveryDetails from "./components/DiscoveryDetails";
import CommunityEngagement from "./components/CommunityEngagement";
import { Award, TrendingUp, Users2, Search, Calendar, MessageSquare } from "lucide-react";

const YouTubeStatsDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { data, loading, error } = useYouTubeDetails((user as any)?._id || (user as any)?.id);

  const youtubeConnected = useMemo(() => {
    return Boolean((user as any)?.youtube?.access_token);
  }, [user]);

  const handleDisconnect = async () => {
    if (isDisconnecting) return;

    if (!youtubeConnected) {
      toast.info("YouTube is already disconnected");
      return;
    }

    const confirmed = window.confirm("Disconnect YouTube? You can reconnect anytime from Social Media.");
    if (!confirmed) return;

    const userId = (user as any)?._id || (user as any)?.id;
    try {
      setIsDisconnecting(true);
      const res = await fetch("/api/youtube/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || "Disconnect failed");

      if (payload?.user) setUser(payload.user);
      toast.success("YouTube disconnected");
      router.push("/site/social-media");
    } catch (err: any) {
      toast.error(err?.message || "Failed to disconnect");
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <Loading />
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout showSidebar={true}>
        <div className="min-h-screen bg-[#EAEEF6] flex flex-col items-center justify-center p-8">
          <div className="bg-white p-12 rounded-[50px] shadow-2xl shadow-blue-100 text-center max-w-md border border-white">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Connection Lost</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">{error || "We couldn't reach your YouTube data. Ensure your channel is properly linked."}</p>
            <Link href="/site/social-media" className="w-full bg-slate-900 text-white px-10 py-5 rounded-3xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 block text-center uppercase tracking-widest text-xs">
              Back to Center
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "reach", label: "Discovery & Reach", icon: Search },
    { id: "audience", label: "Audience", icon: Users2 },
    { id: "community", label: "Community & Schedule", icon: MessageSquare },
    { id: "revenue", label: "Revenue", icon: Award },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#EAEEF6] p-4 lg:p-12 font-sans">
        <div className="max-w-[1700px] mx-auto space-y-12">
          
          {/* Banner Image */}
          {data?.channel?.branding?.image?.bannerExternalUrl && (
            <div className="relative w-full h-48 rounded-[50px] overflow-hidden mb-12 shadow-2xl border-4 border-white">
               <img 
                 src={data.channel.branding.image.bannerExternalUrl} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                 alt="Channel Banner" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
               <div className="absolute bottom-6 right-8">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">Live Dashboard</span>
               </div>
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
             <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-50 transition-all duration-1000" />
                  <img 
                    src={data?.channel?.thumbnails?.high?.url || data?.channel?.thumbnails?.medium?.url} 
                    className="relative w-28 h-28 rounded-full border-4 border-white shadow-2xl object-cover" 
                    alt="" 
                  />
                  <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white ring-4 ring-red-50">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                </div>
                <div>
                   <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-3">{data?.channel?.title}</h1>
                   <div className="flex flex-wrap items-center gap-4">
                     <span className="px-5 py-2 rounded-2xl bg-white/60 backdrop-blur-sm text-xs font-black text-slate-600 uppercase tracking-widest border border-white/50">{data?.channel?.handle}</span>
                     <span className="w-2 h-2 rounded-full bg-slate-300" />
                     <span className="text-base font-black text-slate-500">{formatCompactNumber(data?.channel?.statistics?.subscriberCount)} <span className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Subscribers</span></span>
                     <span className="w-2 h-2 rounded-full bg-slate-300" />
                     <span className="text-base font-black text-slate-500">{formatCompactNumber(data?.channel?.statistics?.viewCount)} <span className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Views</span></span>
                     <span className="w-2 h-2 rounded-full bg-slate-300" />
                     <span className="text-base font-black text-slate-500">{formatCompactNumber(data?.channel?.statistics?.videoCount)} <span className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Videos</span></span>
                     <span className="w-2 h-2 rounded-full bg-slate-300" />
                     <span className="px-4 py-1.5 rounded-xl bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                        <img src={`https://flagcdn.com/w20/${data?.channel?.branding?.channel?.country?.toLowerCase() || 'in'}.png`} className="w-4 h-3 rounded-sm object-cover" alt="" />
                        {data?.channel?.branding?.channel?.country}
                     </span>
                   </div>
                   {data?.channel?.description && (
                     <p className="mt-4 text-sm font-medium text-slate-500 max-w-2xl line-clamp-2 leading-relaxed">
                       {data?.channel?.description}
                     </p>
                   )}
                   {data?.channel?.branding?.channel?.keywords && (
                     <div className="mt-4 flex flex-wrap gap-2">
                       {data.channel.branding.channel.keywords.split(' ').slice(0, 5).map((kw: string, i: number) => (
                         <span key={i} className="text-[9px] font-black text-slate-400 uppercase tracking-tighter border border-slate-200 px-2 py-0.5 rounded-lg bg-slate-50/50 italic">
                           {kw.replace(/"/g, '')}
                         </span>
                       ))}
                     </div>
                   )}
                </div>
             </div>
             
             <div className="flex items-center gap-5">
               <button
                 type="button"
                 onClick={handleDisconnect}
                 disabled={!youtubeConnected || isDisconnecting}
                 className="px-10 py-5 rounded-[28px] text-sm font-black border transition-all bg-white text-red-600 border-red-50 hover:bg-red-50 hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 uppercase tracking-widest"
               >
                 {isDisconnecting ? "Processing..." : "Disconnect Channel"}
               </button>
               <Link
                 href="/site/social-media"
                 className="bg-slate-900 text-white px-10 py-5 rounded-[28px] text-sm font-black flex items-center gap-3 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest"
               >
                 Dashboard Center
               </Link>
             </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto gap-2 p-2 bg-white/50 backdrop-blur-md rounded-[35px] border border-white/50 w-fit hidescroll">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-10 py-4 rounded-[28px] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                  activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-12">
              
              {activeTab === "overview" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Dashboard Summary Section */}
                  {data?.dashboard?.overview28d && (
                    <section className="bg-white p-8 rounded-[50px] shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Last 28 Days Performance</h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Official Studio Summary</p>
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                           Channel Hub
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                         <div className="p-6 rounded-[35px] bg-blue-50/50 border border-blue-100/50">
                            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Total Views</p>
                            <h4 className="text-3xl font-black text-slate-900">{formatCompactNumber(data.dashboard.overview28d.totalViews)}</h4>
                         </div>
                         <div className="p-6 rounded-[35px] bg-emerald-50/50 border border-emerald-100/50">
                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Watch hours</p>
                            <h4 className="text-3xl font-black text-slate-900">{Number(data.dashboard.overview28d.totalWatchTimeHours || 0).toFixed(2)}</h4>
                         </div>
                         <div className="p-6 rounded-[35px] bg-red-50/50 border border-red-100/50">
                            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">Gained</p>
                            <h4 className="text-3xl font-black text-slate-900">+{formatCompactNumber(Math.round(data.dashboard.overview28d.subscribersGained || 0))}</h4>
                         </div>
                         <div className="p-6 rounded-[35px] bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Flow</p>
                            <h4 className="text-3xl font-black text-slate-900">{formatCompactNumber(Math.round(data.dashboard.overview28d.netSubscribers || 0))}</h4>
                         </div>
                      </div>

                      {data.dashboard.overview28d.topContent?.length > 0 && (
                        <div>
                           <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 px-2">Top Performance Hub</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                              {data.dashboard.overview28d.topContent.map((video: any, idx: number) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-[30px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                   <div className="relative w-24 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                                      <img src={video.thumbnails?.default?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                      <div className="absolute inset-0 bg-black/20" />
                                   </div>
                                   <div className="flex flex-col justify-center min-w-0">
                                      <h5 className="text-[11px] font-black text-slate-900 truncate mb-1">{video.title}</h5>
                                      <div className="flex items-center gap-2">
                                         <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{formatCompactNumber(video.views)} Views</span>
                                         <span className="text-[10px] font-bold text-slate-400 uppercase">{video.duration.replace('PT','').toLowerCase()}</span>
                                      </div>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                    </section>
                  )}

                  <section>
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-3xl font-black text-slate-900 tracking-tight">Detailed Analytics</h2>
                    </div>
                    <YouTubeAnalyticsGrid 
                      overview={data?.analytics?.overview} 
                      dailyTrend={data?.analytics?.dailyTrend} 
                    />
                  </section>
                  <VideosTable videos={data?.recentVideos} />
                </div>
              )}

              {activeTab === "reach" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ReachFunnel reach={data?.analytics?.reach} />
                  <DiscoveryDetails 
                    searchTerms={data?.analytics?.topSearchTerms} 
                    externalSites={data?.analytics?.topExternalSites} 
                  />
                  <RetentionAnalytic retention={data?.analytics?.retention} />
                  <TopVideosRank topVideos={data?.analytics?.topVideos} />
                </div>
              )}

              {activeTab === "audience" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <DemographicsCharts 
                    demographics={{
                      ...data?.demographics,
                      ...data?.analytics?.audience,
                      geography: data?.analytics?.geography,
                      subscribedStatus: data?.analytics?.subscribedStatus
                    }} 
                  />
                  <InsightsCharts analytics={data?.analytics} />
                </div>
              )}

              {activeTab === "community" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CommunityEngagement 
                    comments={data?.recentComments} 
                    subscribers={data?.recentSubscribers}
                    schedule={data?.postSchedule}
                  />
                </div>
              )}

              {activeTab === "revenue" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <RevenueOverview revenue={data?.analytics?.revenue} />
                  <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100 text-center">
                     <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-2">Monetization Insight</h3>
                     <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                       Your estimated revenue is calculated based on ad impressions and playback based CPM. 
                       Keep creating high-retention content to increase your earnings potential.
                     </p>
                  </div>
                </div>
              )}

            </div>

            {/* Side Information Panel */}
            <div className="lg:col-span-4 space-y-12">
              <div className="p-2 bg-white/30 backdrop-blur-sm rounded-[52px] border border-white/40 shadow-sm">
                <ProfileCard 
                  data={data?.channel} 
                  demographics={{
                    ...data?.demographics,
                    ...data?.analytics?.audience
                  }} 
                  platform="youtube"
                />
              </div>
              
              <PostActivity activity={data?.postActivity} platform="youtube" />
              
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-2">Content Mix</h4>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-3xl bg-blue-50/50 border border-blue-100 flex flex-col items-center gap-2 group hover:bg-white hover:shadow-lg transition-all">
                       <span className="text-xl font-black text-blue-600">{data?.postActivity?.videos || 0}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Videos</span>
                    </div>
                    <div className="p-4 rounded-3xl bg-pink-50/50 border border-pink-100 flex flex-col items-center gap-2 group hover:bg-white hover:shadow-lg transition-all">
                       <span className="text-xl font-black text-pink-600">{data?.postActivity?.shorts || 0}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Shorts</span>
                    </div>
                    <div className="p-4 rounded-3xl bg-red-50/50 border border-red-100 flex flex-col items-center gap-2 group hover:bg-white hover:shadow-lg transition-all">
                       <span className="text-xl font-black text-red-600">{data?.postActivity?.lives || 0}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Lives</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Bottom Overview Section - Balanced Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12">
             <div className="h-full">
                <AnomalyCard statistics={data?.channel?.statistics} platform="youtube" />
             </div>
             
             <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 rounded-2xl bg-blue-50 text-blue-500 group-hover:scale-110 transition-transform shadow-sm">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Growth Breakdown</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Channel Expansion Metrics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="p-6 rounded-[30px] bg-green-50/30 border border-green-50 flex justify-between items-center group/item hover:bg-green-50/50 transition-colors">
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Gained</span>
                           <span className="text-3xl font-black text-green-600">+{formatCompactNumber(Math.round(data?.analytics?.overview?.subscribersGained || 0))}</span>
                         </div>
                        <div className="w-20 h-2 bg-green-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            className="h-full bg-green-500" 
                          />
                        </div>
                    </div>

                    <div className="p-6 rounded-[30px] bg-red-50/30 border border-red-50 flex justify-between items-center group/item hover:bg-red-50/50 transition-colors">
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">Lost</span>
                           <span className="text-3xl font-black text-red-600">-{formatCompactNumber(Math.round(data?.analytics?.overview?.subscribersLost || 0))}</span>
                         </div>
                        <div className="w-20 h-2 bg-red-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "30%" }}
                            className="h-full bg-red-500" 
                          />
                        </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Net Subscriber Flow</p>
                       <h4 className="text-5xl font-black text-blue-600 tracking-tighter">{formatCompactNumber(Math.round(data?.analytics?.overview?.netSubscribers || 0))}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-slate-900 uppercase">Top 5% Performance</p>
                        <p className="text-[10px] font-bold text-slate-400">Compared to peer channels</p>
                      </div>
                      <div className="p-5 bg-blue-600 text-white rounded-[30px] shadow-2xl shadow-blue-200 group-hover:rotate-12 transition-transform">
                          <Award className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default YouTubeStatsDashboard;
