"use client";
import React from "react";
import { TrendingUp, Award, Play, Eye, Clock, ThumbsUp, MessageSquare, ExternalLink } from "lucide-react";

interface TopVideosRankProps {
  topVideos: any[];
}

const TopVideosRank = ({ topVideos }: TopVideosRankProps) => {
  if (!topVideos || topVideos.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Performing Content</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Deep dive into your highest engaging videos</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-2xl shadow-sm border border-amber-100">
          <Award className="w-6 h-6 text-amber-500" />
        </div>
      </div>

      <div className="space-y-8">
        {topVideos.map((video, idx) => {
          const retention = Number(video.averageViewPercentage || 0).toFixed(1);
          const likes = Number(video.statistics?.likeCount || 0).toLocaleString();
          const comments = Number(video.statistics?.commentCount || 0).toLocaleString();
          
          return (
            <div key={idx} className="relative group bg-slate-50/30 p-5 rounded-[32px] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
              {/* Rank Badge */}
              <div className={`absolute -top-3 -left-3 w-10 h-10 flex items-center justify-center rounded-2xl text-lg font-black z-10 shadow-lg ${
                idx === 0 ? 'bg-amber-500 text-white rotate-[-12deg]' :
                idx === 1 ? 'bg-slate-400 text-white rotate-[-8deg]' :
                idx === 2 ? 'bg-orange-400 text-white rotate-[-5deg]' :
                'bg-slate-100 text-slate-400'
              }`}>
                {idx + 1}
              </div>

              <div className="flex flex-col xl:flex-row gap-6">
                {/* Thumbnail Area */}
                <div className="relative flex-shrink-0 group/thumb">
                  <img 
                    src={video.thumbnails?.medium?.url || video.thumbnails?.high?.url} 
                    className="w-full xl:w-48 h-32 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow" 
                    alt={video.title} 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                     <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-black px-2 py-0.5 rounded-lg backdrop-blur-md">
                    {video.duration?.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '') || '--:--'}
                  </div>
                </div>

                {/* Info Area */}
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-3 gap-4">
                    <h4 className="text-base font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {video.title || `Video ${video.videoId}`}
                    </h4>
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Metrics Row 1 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Views</span>
                       <div className="flex items-center gap-1.5 font-black text-slate-900">
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>{Number(video.views).toLocaleString()}</span>
                       </div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Watch Time</span>
                       <div className="flex items-center gap-1.5 font-black text-slate-900">
                          <Clock className="w-3.5 h-3.5 text-purple-500" />
                          <span>{video.watchTimeMinutes}m</span>
                       </div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Retention</span>
                       <div className="flex items-center gap-1.5 font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg w-fit">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{retention}%</span>
                       </div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Duration</span>
                       <div className="flex items-center gap-1.5 font-black text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span>{video.averageViewDuration}s</span>
                       </div>
                    </div>
                  </div>

                  {/* Metrics Row 2 (Engagement) */}
                  <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                     <div className="flex items-center gap-2 group/item">
                        <div className="p-1.5 rounded-lg bg-pink-50 text-pink-500 group-hover/item:bg-pink-100 transition-colors">
                           <ThumbsUp className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{likes} <span className="text-slate-300">Likes</span></span>
                     </div>
                     <div className="flex items-center gap-2 group/item">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 group-hover/item:bg-indigo-100 transition-colors">
                           <MessageSquare className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{comments} <span className="text-slate-300">Comments</span></span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopVideosRank;
