"use client";
import React, { useState } from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { Facebook, MoreHorizontal, Youtube, Twitter } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileCardProps {
  data: any;
  demographics: any;
  platform?: "youtube" | "facebook" | "x";
}

const ProfileCard = ({ data, demographics, platform = "youtube" }: ProfileCardProps) => {
  const [activeTab, setActiveTab] = useState("Top Locations");

  const getTabData = () => {
    switch (activeTab) {
      case "Top Locations":
        return demographics?.topLocations || [];
      case "Age Range":
        return demographics?.ageRange || [];
      case "Gender":
        return demographics?.gender || [];
      default:
        return [];
    }
  };

  const displayData = getTabData();

  const isYouTube = platform === "youtube";
  const isFacebook = platform === "facebook";
  const isX = platform === "x";

  const getPlatformIcon = () => {
    if (isYouTube) return <Youtube className="w-3 h-3 text-white" />;
    if (isFacebook) return <Facebook className="w-3 h-3 text-white" />;
    if (isX) return <Twitter className="w-3 h-3 text-white" />;
    return null;
  };

  const getPlatformColor = () => {
    if (isYouTube) return "bg-red-600";
    if (isFacebook) return "bg-blue-600";
    if (isX) return "bg-black";
    return "bg-gray-600";
  };

  const getBarColor = () => {
    if (isYouTube) return "bg-red-500";
    if (isFacebook) return "bg-blue-500";
    if (isX) return "bg-slate-900";
    return "bg-gray-500";
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={data?.thumbnails?.default?.url || data?.picture || data?.profile_image_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
            <div className={`absolute -bottom-1 -right-1 ${getPlatformColor()} rounded-full p-0.5 border-2 border-white`}>
              {getPlatformIcon()}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{data?.title || data?.handle || data?.name || "Channel Name"}</h3>
            <span className="text-xs text-gray-400 font-medium">{data?.handle || data?.username || "Social Profile"}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            {formatCompactNumber(
              isYouTube 
                ? data?.statistics?.subscriberCount 
                : (data?.fan_count || data?.public_metrics?.followers_count || 0)
            )}
          </h2>
          <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">
            {isYouTube ? "Subscribers" : "Followers"}
          </span>
        </div>
        
        {isYouTube && data?.statistics && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-50 mt-4">
             <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-gray-700">{formatCompactNumber(data.statistics.viewCount)}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Views</span>
             </div>
             <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-gray-700">{formatCompactNumber(data.statistics.videoCount)}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Videos</span>
             </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-1 rounded-2xl flex mb-8">
         {["Top Locations", "Age Range", "Gender"].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200 ${
               activeTab === tab
                 ? "bg-white text-gray-900 shadow-sm"
                 : "text-gray-400 hover:text-gray-600"
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      <div className="space-y-6 min-h-[150px]">
        {displayData.length > 0 ? (
          displayData.map((item: any, idx: number) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-gray-900">{item.name}</span>
                <span className="text-gray-900">{item.value?.toLocaleString() || item.percentage + "%"}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage || 0}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`${item.color || getBarColor()} h-full rounded-full`}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-4">
            <p className="text-xs font-medium">No {activeTab.toLowerCase()} data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
