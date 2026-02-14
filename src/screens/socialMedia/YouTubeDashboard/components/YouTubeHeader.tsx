"use client";
import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, TrendingUp } from "lucide-react";
import YouTubeStatsDeck from "./YouTubeStatsDeck";

interface YouTubeHeaderProps {
  data: any;
}

const YouTubeHeader: React.FC<YouTubeHeaderProps> = ({ data }) => {
  return (
    <section className="relative pt-6 pb-2">
      {/* Background Architecture - Subtle Gradient with Theme Accents */}
      <div className="absolute inset-0 -mt-24 -mx-10 rounded-b-[40px] bg-gradient-to-b from-white/80 via-orange-50/40 to-transparent pointer-events-none border-b border-white/50 backdrop-blur-sm" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        {/* Identity Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative group"
          >
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100">
              <img
                src={
                  data?.channel?.thumbnails?.high?.url ||
                  data?.channel?.thumbnails?.medium?.url
                }
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
              <TrendingUp className="w-5 h-5" />
            </div>
          </motion.div>

          <div className="space-y-4 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                {data?.channel?.branding?.channel?.country && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                    <img
                      src={`https://flagcdn.com/w20/${data.channel.branding.channel.country.toLowerCase()}.png`}
                      className="w-4 h-2.5 rounded-xs"
                      alt=""
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      {data.channel.branding.channel.country}
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                {data?.channel?.title}
              </h1>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group">
                <span className="text-sm font-semibold">
                  {data?.channel?.handle?.startsWith("@")
                    ? data.channel.handle
                    : `@${data.channel.handle}`}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {data?.channel?.snippet?.publishedAt && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <p className="text-sm font-bold text-slate-400">
                    Joined{" "}
                    {new Date(
                      data.channel.snippet.publishedAt,
                    ).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* High-Level Stats Deck */}
        <div className="w-full md:w-auto">
          <YouTubeStatsDeck data={data} />
        </div>
      </div>
    </section>
  );
};

export default YouTubeHeader;
