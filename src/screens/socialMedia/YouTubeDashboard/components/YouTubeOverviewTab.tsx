"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import YouTubeAnalyticsGrid from "./YouTubeAnalyticsGrid";
import GeographySection from "./GeographySection";

interface YouTubeOverviewTabProps {
  data: any;
  dateRange: string;
}

const YouTubeOverviewTab: React.FC<YouTubeOverviewTabProps> = ({
  data,
  dateRange,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dashboard Summary Section */}
      {data?.dashboard?.overview28d && (
        <section className="bg-white p-8 rounded-[50px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {dateRange === "LAST_28_DAYS"
                  ? "Last 28 Days Performance"
                  : "Overall Channel Performance"}
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                {data?.channel?.title} Analytics
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
              Channel Hub
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 rounded-[35px] bg-blue-50/50 border border-blue-100/50">
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">
                Total Views
              </p>
              <h4 className="text-3xl font-black text-slate-900">
                {formatCompactNumber(data.dashboard.overview28d.totalViews)}
              </h4>
            </div>
            <div className="p-6 rounded-[35px] bg-emerald-50/50 border border-emerald-100/50">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
                Watch hours
              </p>
              <h4 className="text-3xl font-black text-slate-900">
                {Number(
                  data.dashboard.overview28d.totalWatchTimeHours || 0,
                ).toFixed(2)}
              </h4>
            </div>
            <div className="p-6 rounded-[35px] bg-red-50/50 border border-red-100/50">
              <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">
                Gained
              </p>
              <h4 className="text-3xl font-black text-slate-900">
                +{" "}
                {formatCompactNumber(
                  Math.round(data.dashboard.overview28d.subscribersGained || 0),
                )}
              </h4>
            </div>
            <div className="p-6 rounded-[35px] bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Net Flow
              </p>
              <h4 className="text-3xl font-black text-slate-900">
                {formatCompactNumber(
                  Math.round(data.dashboard.overview28d.netSubscribers || 0),
                )}
              </h4>
            </div>
          </div>

          {data.dashboard.overview28d.topContent?.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 px-2">
                Top Performance Hub
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.dashboard.overview28d.topContent.map(
                  (video: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() =>
                        router.push(
                          `${pathname}/video/${video.videoId || video.id}`,
                        )
                      }
                      className="flex text-left w-full gap-4 p-4 rounded-[30px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                      <div className="relative w-24 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                        <img
                          src={video.thumbnails?.default?.url}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h5 className="text-[11px] font-black text-slate-900 truncate mb-1">
                          {video?.title}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                            {formatCompactNumber(video?.views)} Views
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {video?.duration
                              ?.replace("PT", "")
                              ?.toLowerCase() || "0:00"}
                          </span>
                        </div>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Detailed Analytics
          </h2>
        </div>
        <YouTubeAnalyticsGrid
          overview={data?.analytics?.overview}
          dailyTrend={data?.analytics?.dailyTrend}
        />
      </section>

      <GeographySection
        topLocations={
          data?.demographics?.topLocations ||
          data?.analytics?.audience?.topLocations ||
          []
        }
      />
    </div>
  );
};

export default YouTubeOverviewTab;
