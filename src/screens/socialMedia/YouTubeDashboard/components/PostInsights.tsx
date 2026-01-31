"use client";
import React from "react";
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const PostInsights = ({ videos }: { videos: any[] }) => {
  const latestVideo = videos?.[0];
  const reachCount = latestVideo?.statistics?.viewCount || "0";
  const likeCount = latestVideo?.statistics?.likeCount || "0";

  // Use real data if available, otherwise empty set
  const reachChartData = videos?.slice(0, 7).reverse().map(v => ({ v: Number(v.statistics?.viewCount || 0) })) || [];
  const likeChartData = videos?.slice(0, 5).reverse().map(v => ({ v: Number(v.statistics?.likeCount || 0) })) || [];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Post Insights</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
            {latestVideo ? `Posted on ${new Date(latestVideo.publishedAt).toLocaleDateString()} - ${new Date(latestVideo.publishedAt).toLocaleTimeString()}` : "No recent posts"}
          </p>
        </div>
        {latestVideo?.thumbnails?.default?.url && (
            <img src={latestVideo.thumbnails.default.url} className="w-12 h-8 rounded-lg object-cover" alt="" />
        )}
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 mb-1">Accounts reached</p>
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
            <p className="text-[10px] font-bold text-gray-400 mb-1">Likes</p>
            <h2 className="text-2xl font-bold text-gray-900">+{Number(likeCount).toLocaleString()}</h2>
          </div>
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={likeChartData}>
                <Bar dataKey="v" fill="#d946ef" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
        <div className="flex-1">
          <h4 className="text-xs font-bold text-gray-900 mb-2">Latest Video</h4>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-4">
            {latestVideo?.title || "Connect your account to see your latest post insights and growth trends."}
          </p>
          <button className="text-blue-500 border border-blue-500 rounded-full px-4 py-2 text-[10px] font-bold hover:bg-blue-50 transition-colors w-full">
            View Analytics
          </button>
        </div>
        <div className="w-20 flex items-center justify-center">
            <div className="relative w-full aspect-square bg-yellow-50 rounded-2xl flex items-center justify-center">
                 <div className="w-8 h-12 bg-red-400 rounded-lg absolute bottom-2 right-2 animate-bounce" style={{ animationDuration: '3s' }} />
                 <div className="w-10 h-10 bg-blue-500 rounded-full absolute -top-1 -left-1" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostInsights;

