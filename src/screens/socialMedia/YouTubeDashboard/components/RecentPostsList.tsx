"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { Play, Eye, MessageSquare, BarChart4 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface RecentPostsListProps {
  videos: any[];
}

const RecentPostsList = ({ videos }: RecentPostsListProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8 px-2">
        <h3 className="text-xl font-black text-slate-900">Recent Posts</h3>
        <button
          onClick={() => router.push(`${pathname}/videos`)}
          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {videos?.slice(0, 5).map((video, idx) => {
          const views = video.views || video.statistics?.viewCount || 0;
          const comments =
            video.comments || video.statistics?.commentCount || 0;
          const videoId = video.videoId || video.id;

          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-[30px] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100 relative"
            >
              <div
                className="relative w-24 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm cursor-pointer"
                onClick={() => router.push(`${pathname}/video/${videoId}`)}
              >
                <img
                  src={
                    video.thumbnail ||
                    video.thumbnails?.high?.url ||
                    video.thumbnails?.default?.url
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </div>

              <div className="min-w-0 flex-grow">
                <h4
                  className="text-[11px] font-black text-slate-900 truncate leading-tight mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => router.push(`${pathname}/video/${videoId}`)}
                >
                  {video.title}
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-md bg-blue-50">
                      <Eye className="w-2.5 h-2.5 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-600">
                      {formatCompactNumber(views)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-md bg-emerald-50">
                      <MessageSquare className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-600">
                      {formatCompactNumber(comments)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`${pathname}/video/${videoId}`)}
                className="p-3 rounded-2xl cursor-pointer bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-xl shadow-slate-200"
                title="View Analytics"
              >
                <BarChart4 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {!videos?.length && (
          <div className="py-10 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              No recent posts found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPostsList;
