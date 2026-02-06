"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfileViewsProps {
  statistics: any;
  data?: any[];
  platform?: "youtube" | "facebook" | "x";
}

const ProfileViews = ({ statistics, data, platform = "youtube" }: ProfileViewsProps) => {
  const isYouTube = platform === "youtube";
  const isFacebook = platform === "facebook";
  const isX = platform === "x";

  let accentColor = "#14b8a6"; // Default teal
  if (isFacebook) accentColor = "#2563eb"; // Blue
  if (isX) accentColor = "#000000"; // Black

  const chartData = data && data.length > 0 ? data.map((item: any) => ({
    time: item.time || item[0], // Handle both object and array formats
    views: item.views || item[1]
  })) : [];

  const getViewCount = () => {
    if (isYouTube) return statistics?.viewCount;
    return statistics?.fan_count || statistics?.page_views || statistics?.tweet_count || 0;
  };

  const getViewLabel = () => {
    if (isX) return "Tweets";
    return "views";
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">Profile Views Period</h3>
        <p className="text-xs text-gray-400 font-medium mt-1">The time when your followers visit your profile page.</p>
      </div>

      <div className="h-[180px] w-full relative">
        <div className="absolute top-0 left-[50%] -translate-x-1/2 z-10">
            <div className="bg-black text-white px-3 py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center whitespace-nowrap">
                <span>{Number(getViewCount() || 0).toLocaleString()} {getViewLabel()}</span>
                <div className="w-2 h-2 bg-black rotate-45 -mb-2 mt-1" />
            </div>
            <div className={`w-2 h-2 rounded-full border-2 border-white ${isYouTube ? "bg-teal-400" : isFacebook ? "bg-blue-400" : "bg-gray-400"} mx-auto mt-2`} />
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
              dy={10}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke={accentColor} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorViews)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfileViews;
