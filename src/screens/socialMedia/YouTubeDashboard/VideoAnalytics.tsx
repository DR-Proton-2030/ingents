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
  Search, 
  MessageSquare, 
  Award, 
  Eye, 
  ThumbsUp, 
  Clock, 
  ArrowLeft,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
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

const VideoAnalytics = () => {
  const params = useParams();
  const videoId = params.videoId as string;
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const userId = (user as any)?._id || (user as any)?.id;

  const { data, loading, error } = useYouTubeVideoAnalytics(userId, videoId);

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
          <div className="bg-white p-12 rounded-[50px] shadow-2xl text-center max-w-md border border-white">
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

  const countryData = audience?.countries?.map((c: any) => ({
    name: c.country,
    value: c.views
  })) || [];

  const realtimeData = data?.realtime?.viewsByHour?.map((v: any, i: number) => ({
    hour: `H-${24 - i}`,
    views: v.views
  })).reverse() || [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899'];

  return (
    <Layout>
      <div className="min-h-screen bg-[#EAEEF6] p-4 lg:p-12 font-sans">
        <div className="max-w-[1500px] mx-auto space-y-12">
          
          {/* Back Button & Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.back()}
                className="p-4 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Video Performance</h1>
                <p className="text-slate-500 font-medium mt-1">Deep dive into individual content metrics</p>
              </div>
            </div>
          </div>

          {/* Video Title Card */}
          <div className="bg-white rounded-[50px] p-8 lg:p-12 shadow-sm border border-white flex flex-col xl:flex-row gap-12 items-start xl:items-center">
            <div className="relative group flex-shrink-0 w-full xl:w-[480px]">
              <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-amber-500 rounded-[40px] blur opacity-10 group-hover:opacity-25 transition duration-1000" />
              <img 
                src={video?.thumbnails?.maxres?.url || video?.thumbnails?.high?.url} 
                className="relative rounded-[35px] w-full h-auto shadow-2xl object-cover" 
                alt={video?.title}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-6 bg-white/20 backdrop-blur-md rounded-full">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
              </div>
            </div>
            <div className="flex-grow space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{video?.privacyStatus}</span>
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Published: {new Date(video?.publishedAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">{video?.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{video?.description}</p>
              
              <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-50">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard label="Views" value={formatCompactNumber(overview?.views)} icon={Eye} color="blue" />
            <ValueCard label="Watch Time" value={`${overview?.watchTimeHours?.toFixed(1)}h`} icon={Clock} color="purple" />
            <ValueCard label="Avg. Duration" value={overview?.averageViewDuration} icon={TrendingUp} color="emerald" />
            <ValueCard label="Engaged Views" value={formatCompactNumber(overview?.engagedViews)} icon={Users2} color="amber" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            
            {/* Left Column: Metrics & Charts */}
            <div className="xl:col-span-8 space-y-12">
              
              {/* Retention Curve */}
              <section className="bg-white p-8 lg:p-12 rounded-[50px] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Audience Retention</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Moment-by-moment Engagement</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm">
                    {engagement?.averageViewPercentage?.toFixed(1)}% Avg. Retention
                  </div>
                </div>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={retentionData}>
                      <defs>
                        <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                        labelStyle={{ fontWeight: 800, marginBottom: '6px' }}
                      />
                      <Area type="monotone" dataKey="ratio" name="Retention" stroke="#10b981" strokeWidth={4} fill="url(#colorRetention)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Real-time Activity chart */}
              {realtimeData.length > 0 && (
                <section className="bg-slate-900 p-8 lg:p-12 rounded-[50px] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-10 -mr-48 -mt-48" />
                   <div className="flex justify-between items-center mb-8 relative z-10">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Real-time Pulse</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Live audience activity (Last {data?.realtime?.window})</p>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                      </div>
                   </div>
                   
                   <div className="h-[200px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={realtimeData}>
                           <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', color: '#fff' }}
                            itemStyle={{ color: '#60a5fa' }}
                           />
                           <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                </section>
              )}

              {/* Traffic Sources */}
              <section className="bg-white p-8 lg:p-12 rounded-[50px] shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Traffic Sources</h3>
                <div className="space-y-6">
                  {reach?.trafficSources?.map((source: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{source.source.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-black text-slate-900">{source.views} Views</span>
                      </div>
                      <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(source.views / overview?.views) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${idx % 2 === 0 ? 'bg-blue-500' : 'bg-indigo-400'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Column: Audience & Device Panels */}
            <div className="xl:col-span-4 space-y-12">
              
              {/* Audience Breakdown */}
              <SummaryPanel title="Audience Insights" icon={Users2}>
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 px-4 bg-slate-50 rounded-[30px] border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subscribers Gained</p>
                      <span className="text-2xl font-black text-emerald-600">+{engagement?.subscribersGained || 0}</span>
                    </div>
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 px-2">Subscribed vs Not</h4>
                    <div className="space-y-4">
                      {audience?.subscribedStatus?.map((status: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${status.status === 'SUBSCRIBED' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                          <span className="flex-grow text-xs font-bold text-slate-600">{status.status}</span>
                          <span className="text-xs font-black text-slate-900">{Math.round((status.views / overview?.views) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SummaryPanel>

              {/* Devices Chart */}
              <SummaryPanel title="Device Type" icon={Monitor}>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                   {deviceData.map((d: any, i: number) => (
                     <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{d.name}</span>
                     </div>
                   ))}
                </div>
              </SummaryPanel>

              {/* Geography */}
              <SummaryPanel title="Top Geography" icon={Globe}>
                <div className="space-y-4">
                  {audience?.countries?.slice(0, 5).map((country: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 border border-slate-100/50">
                       <div className="flex items-center gap-3">
                          <img src={`https://flagcdn.com/w20/${country.country.toLowerCase()}.png`} className="w-6 h-4 rounded-sm shadow-sm" alt="" />
                          <span className="text-xs font-black text-slate-700">{country.country}</span>
                       </div>
                       <span className="text-xs font-black text-slate-900">{formatCompactNumber(country.views)} <span className="text-[10px] text-slate-400 ml-1">VIEWS</span></span>
                    </div>
                  ))}
                </div>
              </SummaryPanel>

              {/* Limitations & Status */}
              {limitations?.length > 0 && (
                <div className="bg-amber-50/50 p-8 rounded-[40px] border border-amber-100 border-dashed">
                   <div className="flex items-center gap-3 mb-6">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Data Limitations</h4>
                   </div>
                   <ul className="space-y-4">
                      {limitations.map((lim: any, i: number) => (
                        <li key={i} className="text-[10px] font-medium text-amber-700 leading-relaxed bg-white/50 p-3 rounded-2xl border border-amber-100">
                           <span className="font-bold block mb-1">Section: {lim.section}</span>
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
