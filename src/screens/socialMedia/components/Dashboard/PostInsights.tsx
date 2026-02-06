"use client";
import React from "react";
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

interface PostInsightsProps {
  posts: any[];
  platform?: "youtube" | "facebook" | "x";
}

const PostInsights = ({ posts, platform = "youtube" }: PostInsightsProps) => {
  const isYouTube = platform === "youtube";
  const isFacebook = platform === "facebook";
  const isX = platform === "x";

  const latestPost = posts?.[0];
  
  const getReachCount = () => {
    if (isYouTube) return latestPost?.statistics?.viewCount || "0";
    return latestPost?.insights?.reach || latestPost?.public_metrics?.impression_count || "0";
  };

  const getEngagementCount = () => {
    if (isYouTube) return latestPost?.statistics?.likeCount || "0";
    return latestPost?.insights?.engagement || latestPost?.public_metrics?.like_count || "0";
  };

  const getEngagementLabel = () => {
    if (isYouTube) return "Likes";
    if (isX) return "Likes";
    return "Engagement";
  };

  const reachCount = getReachCount();
  const engagementCount = getEngagementCount();
  const engagementLabel = getEngagementLabel();

  // Use real data if available, otherwise empty set
  const reachChartData = posts?.slice(0, 7).reverse().map(p => ({ 
    v: Number(
      isYouTube 
        ? (p.statistics?.viewCount || 0) 
        : isX 
          ? (p.public_metrics?.impression_count || 0) 
          : (p.insights?.reach || 0)
    ) 
  })) || [];
  
  const engagementChartData = posts?.slice(0, 5).reverse().map(p => ({ 
    v: Number(
      isYouTube 
        ? (p.statistics?.likeCount || 0) 
        : isX 
          ? (p.public_metrics?.like_count || 0) 
          : (p.insights?.engagement || 0)
    ) 
  })) || [];

  const getThumbnail = () => {
    if (isYouTube) return latestPost?.thumbnails?.default?.url;
    if (isX) return latestPost?.profile_image_url; // X might not have a thumbnail for the tweet directly here easily without more data
    return latestPost?.full_picture;
  };

  const getDate = () => {
    const dateStr = isYouTube ? latestPost?.publishedAt : isX ? latestPost?.created_at : latestPost?.created_time;
    if (!dateStr) return "No recent posts";
    const date = new Date(dateStr);
    return `Posted on ${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Post Insights</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
            {getDate()}
          </p>
        </div>
        {getThumbnail() && (
            <img 
              src={getThumbnail()} 
              className="w-12 h-8 rounded-lg object-cover" 
              alt="" 
            />
        )}
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 mb-1">{isX ? "Impressions" : "Accounts reached"}</p>
            <h2 className="text-2xl font-bold text-gray-900">{Number(reachCount).toLocaleString()}</h2>
          </div>
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reachChartData}>
                <Bar dataKey="v" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 mb-1">{engagementLabel}</p>
            <h2 className="text-2xl font-bold text-gray-900">+{Number(engagementCount).toLocaleString()}</h2>
          </div>
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementChartData}>
                <Bar dataKey="v" fill="#d946ef" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
        <div className="flex-1">
          <h4 className="text-xs font-bold text-gray-900 mb-2">Latest {isYouTube ? "Video" : isX ? "Tweet" : "Post"}</h4>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-4 line-clamp-2">
            {latestPost?.title || latestPost?.text || latestPost?.message || "Connect your account to see your latest post insights and growth trends."}
          </p>
          <button className="text-blue-500 border border-blue-500 rounded-full px-4 py-2 text-[10px] font-bold hover:bg-blue-50 transition-colors w-full">
            View Analytics
          </button>
        </div>
        <div className="w-20 flex items-center justify-center">
            <div className="relative w-full aspect-square bg-yellow-50 rounded-2xl flex items-center justify-center overflow-hidden">
                 <div className="w-8 h-12 bg-red-400 rounded-lg absolute bottom-2 right-2 animate-bounce" style={{ animationDuration: '3s' }} />
                 <div className="w-10 h-10 bg-blue-500 rounded-full absolute -top-1 -left-1" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostInsights;
