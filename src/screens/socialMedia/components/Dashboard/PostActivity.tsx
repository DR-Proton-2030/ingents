"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PostActivityProps {
  activity: any;
  platform?: "youtube" | "facebook" | "x";
}

const PostActivity = ({ activity, platform = "youtube" }: PostActivityProps) => {
  const isYouTube = platform === "youtube";
  const isFacebook = platform === "facebook";
  const isX = platform === "x";

  let stats = [];

  if (isYouTube) {
    stats = [
      { label: "Shorts", value: activity?.shorts || "0" },
      { label: "Videos", value: activity?.videos || "0" },
      { label: "Lives", value: activity?.lives || "0" },
    ];
  } else if (isX) {
    stats = [
      { label: "Tweets", value: activity?.tweets || "0" },
      { label: "Retweets", value: activity?.retweets || "0" },
      { label: "Replies", value: activity?.replies || "0" },
    ];
  } else {
    stats = [
      { label: "Photos", value: activity?.photos || "0" },
      { label: "Videos", value: activity?.videos || "0" },
      { label: "Statuses", value: activity?.statuses || "0" },
    ];
  }

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  
  // Handle both [value, intensity] and {date, views, subscribersGained} formats
  const rawData = activity?.growthTrend || [];
  
  // Format data for the grid
  const gridData = React.useMemo(() => {
    if (!rawData.length) return [];
    
    // Most analytics dashboards show last 28-35 days in the activity grid
    // For large datasets (e.g. LIFETIME), we should only show the tail
    const displayData = rawData.length > 35 ? rawData.slice(-35) : rawData;
    
    return displayData.map((item: any) => {
      if (Array.isArray(item)) return item; 
      
      // Calculate intensity based on views or subscribersGained
      const value = item.views || item.subscribersGained || 0;
      let intensity = 0;
      if (value > 0) {
        if (value > 100) intensity = 3;
        else if (value > 10) intensity = 2;
        else intensity = 1;
      }
      
      return [value, intensity, item.date];
    });
  }, [rawData]);

  const getCircleStyle = (intensity: number) => {
    const colorClass = isYouTube ? "purple" : isX ? "slate" : "blue";
    switch (intensity) {
      case 3: return `bg-${isX ? "black" : `${colorClass}-600`} text-white shadow-lg shadow-${colorClass}-200`;
      case 2: return `bg-${isX ? "slate-800" : `${colorClass}-500`} text-white`;
      case 1: return `bg-${isX ? "slate-200" : `${colorClass}-200`} text-${isX ? "slate-900" : `${colorClass}-700`} font-bold`;
      default: return "bg-gray-100 text-gray-400";
    }
  };

  const getAccentColorClass = () => {
    if (isYouTube) return "purple";
    if (isX) return "slate";
    return "blue";
  };

  const accentColorClass = getAccentColorClass();

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Post Activity</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {rawData.length > 0 ? `Activity across ${rawData.length} days` : "No activity recorded"}
          </p>
        </div>
        <button className={`text-${isX ? "black" : `${accentColorClass}-500`} border border-${isX ? "black" : `${accentColorClass}-500`} rounded-full px-4 py-1.5 text-xs font-bold hover:bg-gray-50 transition-colors`}>
          Detailed View
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 my-6">
        {stats.map((stat, idx) => (
          <div key={idx}>
            <div className="text-3xl font-bold text-gray-900 leading-none mb-1">{stat.value}</div>
            <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-7 text-center">
          {days.map((day, idx) => (
            <span key={idx} className="text-[10px] font-bold text-gray-300 uppercase">{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3">
          {gridData.map((cell: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: Math.min(idx * 0.02, 1) }}
              className={`aspect-square rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${getCircleStyle(cell[1])}`}
              title={cell[2] ? `${cell[2]}: ${cell[0]} units` : undefined}
            >
              {cell[0] > 0 ? (cell[0] > 99 ? '99+' : cell[0]) : ""}
            </motion.div>
          ))}
        </div>
        <p className="text-[9px] text-gray-400 text-center italic mt-4">Showing most recent activity</p>
      </div>
    </div>
  );
};

export default PostActivity;
