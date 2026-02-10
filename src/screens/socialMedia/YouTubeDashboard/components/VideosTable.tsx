"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe, Lock, ExternalLink, ChartNoAxesColumn } from "lucide-react";

interface VideosTableProps {
  videos: any[];
  title?: string;
  showHeader?: boolean;
}

const formatDuration = (duration: string) => {
  if (!duration) return "00:00";
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return duration;

  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");

  if (hours) {
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
  return `${minutes || "0"}:${seconds.padStart(2, "0")}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatNumber = (num: string | number) => {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number(num));
};

const VideosTable = ({ videos, title = "Channel Content", showHeader = true }: VideosTableProps) => {
  const router = useRouter();
  const pathname = usePathname();

  if (!videos || videos.length === 0) return null;

  const handleRowClick = (videoId: string) => {
    // Navigate to video details or analytics page
    // For now we might want to just open the YouTube URL or a detail page
    // router.push(`${pathname}/video/${videoId}`);
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const handleAnalyticsClick = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    // Logic to navigate to analytics page
    const basePath = pathname.includes("/videos") ? pathname.replace("/videos", "") : pathname;
    router.push(`${basePath}/video/${videoId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      {showHeader && (
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">Manage and analyze your videos</p>
          </div>
          <div className="flex gap-2">
             {/* Potential filters or actions can go here */}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">Video</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visibility</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Restrictions</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Views</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Comments</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Likes</th>
              <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Analytics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {videos.map((video: any) => (
              <tr
                key={video.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                {/* Video Column with Thumbnail & Details */}
                <td className="px-6 py-4">
                  <div className="flex gap-4 items-start">
                    <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => handleRowClick(video.id)}>
                      <img
                        src={video.thumbnails?.medium?.url || video.thumbnails?.default?.url}
                        className="w-32 h-[72px] rounded-lg object-cover shadow-sm ring-1 ring-black/5"
                        alt={video.title}
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 py-0.5 rounded backdrop-blur-[2px]">
                        {formatDuration(video.duration)}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                         <ExternalLink className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <h4 
                        className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug cursor-pointer hover:text-blue-600"
                        onClick={() => handleRowClick(video.id)}
                        title={video.title}
                      >
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed" title={video.description}>
                        {video.description || "No description provided."}
                      </p>
                      {video.tags && video.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {video.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                              #{tag}
                            </span>
                          ))}
                          {video.tags.length > 3 && (
                            <span className="text-[10px] text-gray-400 px-1 py-0.5">+{video.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Visibility */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    {video.privacyStatus === 'public' ? (
                      <Globe className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="capitalize">{video.privacyStatus}</span>
                  </div>
                </td>

                {/* Restrictions */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-gray-700">
                        {video.madeForKids ? "Made for kids" : "None"}
                    </span>
                    {video.licensedContent && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            © Licensed
                        </span>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900">{formatDate(video.publishedAt)}</span>
                    <span className="text-xs text-gray-500">Published</span>
                  </div>
                </td>

                {/* Views */}
                <td className="px-4 py-4 text-right whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 block">
                    {formatNumber(video.statistics?.viewCount || 0)}
                  </span>
                </td>

                {/* Comments */}
                <td className="px-4 py-4 text-right whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 block">
                    {formatNumber(video.statistics?.commentCount || 0)}
                  </span>
                </td>

                {/* Likes (vs Dislikes if available, usually just Likes %) */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(video.statistics?.likeCount || 0)}
                    </span>
                    <div className="h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-gray-900 w-full" style={{ width: '100%' }}></div> 
                    </div>
                  </div>
                </td>

                {/* Analytics Action */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={(e) => handleAnalyticsClick(e, video.id)}
                    className="p-2 text-gray-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="View Analytics"
                  >
                    <ChartNoAxesColumn className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 block text-xs text-gray-500 text-center">
            Showing {videos.length} videos from channel based on recent uploads.
      </div>
    </div>
  );
};

export default VideosTable;

