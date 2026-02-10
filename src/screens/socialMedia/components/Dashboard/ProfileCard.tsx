"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { 
  Facebook, 
  MoreHorizontal, 
  Youtube, 
  Twitter
} from "lucide-react";

interface ProfileCardProps {
  data: any;
  platform?: "youtube" | "facebook" | "x";
}

const ProfileCard = ({ data, platform = "youtube" }: ProfileCardProps) => {
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

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
      {/* Profile Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={data?.thumbnails?.high?.url || data?.thumbnails?.default?.url || data?.picture || data?.profile_image_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"}
              alt="Avatar"
              className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 ${getPlatformColor()} rounded-full p-1 border-2 border-white shadow-sm`}>
              {getPlatformIcon()}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-900 leading-tight truncate max-w-[150px]">{data?.title || data?.handle || data?.name || "Channel Name"}</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data?.handle || data?.username || "Social Profile"}</span>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Main Stat */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            {formatCompactNumber(
              isYouTube 
                ? data?.statistics?.subscriberCount 
                : (data?.fan_count || data?.public_metrics?.followers_count || 0)
            )}
          </h2>
          <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
            {isYouTube ? "Subscribers" : "Followers"}
          </span>
        </div>
        
        {isYouTube && data?.statistics && (
          <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                <span className="text-lg font-black text-slate-900 block">{formatCompactNumber(data.statistics.viewCount)}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lifetime Views</span>
             </div>
             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                <span className="text-lg font-black text-slate-900 block">{formatCompactNumber(data.statistics.videoCount)}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Videos</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
