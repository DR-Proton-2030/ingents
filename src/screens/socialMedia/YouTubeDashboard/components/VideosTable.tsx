"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Eye, ThumbsUp, MessageSquare, Clock, BarChart2 } from "lucide-react";

interface VideosTableProps {
  videos: any[];
}

const VideosTable = ({ videos }: VideosTableProps) => {
  const router = useRouter();
  const pathname = usePathname();

  if (!videos || videos.length === 0) return null;

  const handleRowClick = (videoId: string) => {
    router.push(`${pathname}/video/${videoId}`);
  };

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recent Content</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Performance of your most recent uploads</p>
        </div>
        <button className="bg-black text-white px-6 py-2.5 rounded-2xl text-xs font-bold hover:bg-gray-800 transition-colors">
          View All Content
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Video</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Visibility</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Date</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Views</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Likes</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Analytics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {videos.map((video) => (
              <tr 
                key={video.id} 
                onClick={() => handleRowClick(video.id)}
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
              >
                <td className="px-8 py-6 max-w-[400px]">
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={video.thumbnails?.medium?.url} 
                        className="w-32 h-20 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow" 
                        alt={video.title} 
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                        {video.duration 
                          ? video.duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '')
                          : '--:--'}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-medium">Video ID: {video.id}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    video.privacyStatus === 'public' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${video.privacyStatus === 'public' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {video.privacyStatus}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="text-xs font-bold text-gray-900">{new Date(video.publishedAt).toLocaleDateString()}</div>
                  <div className="text-[10px] text-gray-400 font-medium">Published</div>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="text-sm font-bold text-gray-900">{Number(video.statistics?.viewCount || 0).toLocaleString()}</div>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="text-sm font-bold text-gray-900">{Number(video.statistics?.likeCount || 0).toLocaleString()}</div>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center">
                    <button className="p-2 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <BarChart2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideosTable;
