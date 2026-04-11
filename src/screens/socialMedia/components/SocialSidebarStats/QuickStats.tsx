import React from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { PostedContent } from "@/service/scheduler/scheduler.service";

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

interface QuickStatsProps {
  posts: PostedContent[];
}

export function QuickStats({ posts }: QuickStatsProps) {
  const totalEngagement = posts.reduce((sum, p) => {
    const e = p.engagement || {};
    return sum + (e.likes || 0) + (e.comments || 0) + (e.shares || 0) + (e.views || 0);
  }, 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">
            Total Reach
          </span>
        </div>
        <p className="text-xl font-bold text-slate-800">
          {formatNumber(totalEngagement)}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">All interactions</p>
      </div>
      <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-[11px] font-medium text-violet-600 uppercase tracking-wider">
            Published
          </span>
        </div>
        <p className="text-xl font-bold text-slate-800">{posts.length}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Recent posts</p>
      </div>
    </div>
  );
}
