"use client";
import React, { useContext, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/screens/layout/Layout";
import AuthContext from "@/contexts/authContext/authContext";
import { useYouTubeVideoAnalytics } from "@/hooks/useYouTubeVideoAnalytics";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { 
  TrendingUp, 
  Users2, 
  MessageSquare, 
  Award, 
  Eye, 
  Clock, 
  ArrowLeft,
  Monitor,
  Share2,
  AlertCircle,
  Play
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from "framer-motion";

import DateRangeFilter from "@/components/shared/DateRangeFilter";
import { useState } from "react";
import DiscoveryDetails from "./components/DiscoveryDetails";
import DemographicsCharts from "./components/DemographicsCharts";

const VideoAnalytics = () => {
  const params = useParams();
  const videoId = params.videoId as string;
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const userId = (user as any)?._id || (user as any)?.id;
  const [dateRange, setDateRange] = useState("LAST_28_DAYS");

  const { data, loading, error } = useYouTubeVideoAnalytics(userId, videoId, dateRange);

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
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8">
          <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-md border border-white">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Analytics Error</h2>
            <p className="text-slate-500 font-medium mb-10">{error || "Could not load video analytics."}</p>
            <button 
              onClick={() => router.back()}
              className="w-full bg-slate-900 text-white px-10 py-5 rounded-3xl font-black hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { video, overview, reach, engagement, audience, retention, limitations } = data;

  const retentionData = retention?.curve?.map((point: any) => ({
    time: `${Math.round(point.elapsedVideoTimeRatio * 100)}%`,
    ratio: point.audienceWatchRatio * 100,
  })) || [];

  const deviceData = audience?.devices?.map((d: any) => ({
    name: d.deviceType,
    value: d.views
  })) || [];

  const realtimeData = data?.realtime?.viewsByHour?.map((v: any, i: number) => ({
    hour: `H-${24 - i}`,
    views: v.views
  })).reverse() || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899'];

  const demographicsData = {
    topLocations: audience?.countries?.map((c: any) => ({
      country: c.country,
      views: c.views,
      percentage: Math.round((c.views / (overview?.views || 1)) * 100)
    })) || [],
    ageRange: audience?.ageGroups?.map((a: any) => ({
      ageRange: a.ageGroup.replace('age', '').replace('-', ' - '),
      value: a.viewerPercentage
    })) || [],
    gender: audience?.gender?.map((g: any) => ({
      gender: g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
      value: g.viewerPercentage
    })) || [],
    subscribedStatus: audience?.subscribedStatus || []
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans">
        <div className="max-w-[1600px] mx-auto space-y-10">
          
          {/* Back Button & Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.back()}
                className="p-3.5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-slate-900 border border-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Video Performance</h1>
                <p className="text-slate-500 font-medium mt-1">Deep dive into individual content metrics</p>
              </div>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
               <DateRangeFilter value={dateRange} onChange={setDateRange} />
            </div>
          </div>

          {/* Video Title Card */}
          <div className="bg-white rounded-[40px] p-6 lg:p-10 shadow-sm border border-white/80 flex flex-col xl:flex-row gap-10 items-stretch">
            <div className="relative group flex-shrink-0 w-full xl:w-[440px]">
              <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-amber-500 rounded-[30px] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
              <div className="relative rounded-[28px] overflow-hidden aspect-video shadow-2xl">
                <img 
                  src={video?.thumbnails?.maxres?.url || video?.thumbnails?.high?.url} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={video?.title}
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-center space-y-5">
              <div className="flex flex-wrap gap-2.5">
                <span className="bg-emerald-50 text-emerald-600 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">{video?.privacyStatus}</span>
                <span className="bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">Published: {new Date(video?.publishedAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">{video?.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{video?.description}</p>
              
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime Views</span>
                  <span className="text-2xl font-black text-slate-900">{formatCompactNumber(video?.statistics?.viewCount)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Likes</span>
                  <span className="text-2xl font-black text-red-500">{formatCompactNumber(video?.statistics?.likeCount)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comments</span>
                  <span className="text-2xl font-black text-blue-500">{formatCompactNumber(video?.statistics?.commentCount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard label="Views" value={formatCompactNumber(overview?.views)} icon={Eye} color="blue" />
            <ValueCard label="Watch Time" value={`${overview?.watchTimeHours?.toFixed(1)}h`} icon={Clock} color="purple" />
            <ValueCard label="Avg. Duration" value={overview?.averageViewDuration} icon={TrendingUp} color="emerald" />
            <ValueCard label="Engaged Views" value={formatCompactNumber(overview?.engagedViews)} icon={Users2} color="amber" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column: Metrics & Charts */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Retention Curve */}
              <section className="bg-white p-8 lg:p-10 rounded-[40px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Audience Retention</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Moment-by-moment Engagement</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm border border-emerald-100/50">
                    {engagement?.averageViewPercentage?.toFixed(1)}% Avg. Retention
                  </div>
                </div>
                
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={retentionData}>
                      <defs>
                        <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                        labelStyle={{ fontWeight: 800, marginBottom: '6px' }}
                      />
                      <Area type="monotone" dataKey="ratio" name="Retention" stroke="#10b981" strokeWidth={4} fill="url(#colorRetention)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Traffic Sources */}
              <section className="bg-white p-8 lg:p-10 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Traffic Sources</h3>
                <div className="space-y-7">
                  {reach?.trafficSources?.map((source: any, idx: number) => (
                    <div key={idx} className="space-y-2.5">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{source.source.replace(/_/g, ' ')}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-black text-slate-900">{formatCompactNumber(source.views)} Views</span>
                           <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg">({source.watchTimeHours?.toFixed(1)}h)</span>
                        </div>
                      </div>
                      <div className="h-3.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(source.views / (overview?.views || 1)) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${idx % 2 === 0 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.3)]'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Discovery Details (Search Terms & External) */}
              <DiscoveryDetails 
                searchTerms={reach?.searchTerms}
                externalSites={reach?.externalSites}
              />

              {/* Demographics (Gender, Age, Location) */}
              <section className="space-y-8">
                 <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Audience Profile</h2>
                   <div className="h-px flex-grow mx-8 bg-slate-100" />
                 </div>
                 <DemographicsCharts demographics={demographicsData} />
              </section>

              {/* Operating Systems */}
              {audience?.operatingSystems?.length > 0 && (
                <section className="bg-white p-8 lg:p-10 rounded-[40px] shadow-sm border border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Operating Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {audience.operatingSystems.map((os: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-[30px] bg-slate-50/50 border border-slate-100 flex flex-col gap-2 hover:bg-slate-50 transition-colors group">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{os.os}</span>
                        <div className="flex justify-between items-end">
                          <span className="text-2xl font-black text-slate-900">{formatCompactNumber(os.views)}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg shadow-sm">{os.watchTimeHours?.toFixed(1)}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Right Column: Audience & Device Panels */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* Real-time Activity chart */}
              {realtimeData.length > 0 && (
                <section className="bg-slate-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
                   <div className="flex justify-between items-center mb-8 relative z-10">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Real-time Pulse</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Last {data?.realtime?.window}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                         <div className="w-2.2 h-2.2 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                      </div>
                   </div>
                   
                   <div className="h-[180px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={realtimeData}>
                           <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                            itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                           />
                           <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                </section>
              )}

              {/* Audience Breakdown */}
              <SummaryPanel title="Growth Insights" icon={Users2}>
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-emerald-50/50 rounded-[30px] border border-emerald-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subscribers</p>
                      <div className="flex items-center gap-2">
                         <span className="text-3xl font-black text-emerald-600">+{engagement?.subscribersGained || 0}</span>
                         <span className="text-[10px] font-bold text-red-500 bg-white px-2 py-0.5 rounded-lg">-{engagement?.subscribersLost || 0}</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-emerald-100">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-5 px-1 flex items-center gap-2">
                       <span className="w-1 h-3 bg-blue-500 rounded-full" />
                       Subscribed vs Not
                    </h4>
                    <div className="space-y-4">
                      {audience?.subscribedStatus?.map((status: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                          <div className={`w-2.5 h-2.5 rounded-full ${status.status === 'SUBSCRIBED' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-slate-300'}`} />
                          <span className="flex-grow text-[11px] font-bold text-slate-600">{status.status}</span>
                          <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-100">{Math.round((status.views / (overview?.views || 1)) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SummaryPanel>

              {/* Devices Chart */}
              <SummaryPanel title="Device Distribution" icon={Monitor}>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={6}
                        dataKey="value"
                      >
                        {deviceData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                   {deviceData.map((d: any, i: number) => (
                     <div key={i} className="flex items-center gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter truncate">{d.name}</span>
                     </div>
                   ))}
                </div>
              </SummaryPanel>

              {/* Engagement Detailed Panel */}
              <SummaryPanel title="Interaction Stats" icon={MessageSquare}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100 flex justify-between items-center group hover:bg-blue-50 transition-colors">
                    <div>
                      <p className="text-[10px] font-black text-blue-700 uppercase mb-1">Total Shares</p>
                      <span className="text-2xl font-black text-slate-900">{engagement?.shares || 0}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100 group-hover:scale-110 transition-transform">
                       <Share2 className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="p-5 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex justify-between items-center group hover:bg-indigo-50 transition-colors">
                    <div>
                      <p className="text-[10px] font-black text-indigo-700 uppercase mb-1">Playlist Adds</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-slate-900">+{engagement?.playlistAdds || 0}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-indigo-100">-{engagement?.playlistRemoves || 0}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
                       <Award className="w-5 h-5 text-indigo-500" />
                    </div>
                  </div>
                </div>
              </SummaryPanel>

              {/* Limitations & Status */}
              {limitations?.length > 0 && (
                <div className="bg-amber-50/30 p-8 rounded-[40px] border border-amber-100 border-dashed">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Data Limitations</h4>
                   </div>
                   <ul className="space-y-4">
                      {limitations.map((lim: any, i: number) => (
                        <li key={i} className="text-[10px] font-medium text-amber-700 leading-relaxed bg-white/70 p-4 rounded-2xl border border-amber-100 shadow-sm">
                           <span className="font-bold flex items-center gap-2 mb-2 text-amber-900">
                             <span className="w-1 h-3 bg-amber-400 rounded-full" />
                             {lim.section}
                           </span>
                           {lim.reason}
                        </li>
                      ))}
                   </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ValueCard = ({ label, value, icon: Icon, color }: any) => {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex flex-col gap-4 group hover:shadow-xl transition-all duration-500">
      <div className={`p-4 rounded-2xl w-fit ${colorMap[color]} group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <span className="text-3xl font-black text-slate-900">{value}</span>
      </div>
    </div>
  );
};

const SummaryPanel = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 bg-slate-50 rounded-xl">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export default VideoAnalytics;
