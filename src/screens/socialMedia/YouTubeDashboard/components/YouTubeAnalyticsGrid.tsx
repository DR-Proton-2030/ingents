"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Eye, Clock, UserPlus, MousePointer2, BarChart3, TrendingUp } from "lucide-react";

interface YouTubeAnalyticsGridProps {
  overview: any;
  dailyTrend: any[];
}

const AnalyticsCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color.bg}`}>
        <Icon className={`w-6 h-6 ${color.text}`} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const YouTubeAnalyticsGrid = ({ overview, dailyTrend }: YouTubeAnalyticsGridProps) => {
  const chartData = dailyTrend?.map(item => ({
    date: item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A',
    views: item.views || 0,
    subs: item.subscribersGained || 0,
    impressions: item.impressions || 0
  })) || [];

  const cards = [
    {
      label: "Views",
      value: formatCompactNumber(overview?.views || 0),
      icon: Eye,
      color: { bg: "bg-blue-50", text: "text-blue-500" },
      trend: 12
    },
    {
      label: "Impressions",
      value: formatCompactNumber(overview?.impressions || 0),
      icon: TrendingUp,
      color: { bg: "bg-emerald-50", text: "text-emerald-500" },
      trend: 5
    },
    {
      label: "Watch Time (Min)",
      value: formatCompactNumber(overview?.watchTimeMinutes || 0),
      icon: Clock,
      color: { bg: "bg-purple-50", text: "text-purple-500" },
      trend: 8
    },
    {
      label: "Subscribers",
      value: formatCompactNumber(overview?.subscribersGained || 0),
      icon: UserPlus,
      color: { bg: "bg-red-50", text: "text-red-500" },
      trend: 15
    },
    {
      label: "Avg. Duration",
      value: `${Math.floor((overview?.averageViewDuration || 0) / 60)}:${((overview?.averageViewDuration || 0) % 60).toString().padStart(2, '0')}`,
      icon: BarChart3,
      color: { bg: "bg-indigo-50", text: "text-indigo-500" },
      trend: 3
    },
    {
      label: "CTR (%)",
      value: `${(overview?.impressionsCtr || 0).toFixed(1)}%`,
      icon: MousePointer2,
      color: { bg: "bg-orange-50", text: "text-orange-500" },
      trend: -2
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <AnalyticsCard key={idx} {...card} />
        ))}
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Performance Over Time</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Full funnel analysis for the selected period</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100">
               <div className="w-2 h-2 rounded-full bg-blue-500" />
               <span className="text-[10px] font-black text-blue-700 uppercase">Views</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-black text-emerald-700 uppercase">Impressions</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100">
               <div className="w-2 h-2 rounded-full bg-red-500" />
               <span className="text-[10px] font-black text-red-700 uppercase">Subs</span>
             </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViewsMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                labelStyle={{ fontWeight: 700, marginBottom: '4px', fontSize: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="impressions" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorImpressions)" 
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorViewsMain)" 
              />
              <Area 
                type="monotone" 
                dataKey="subs" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={0} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default YouTubeAnalyticsGrid;
