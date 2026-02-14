"use client";
import React from "react";
import { motion } from "framer-motion";
import { Users2, Eye, PlayCircle } from "lucide-react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";

interface YouTubeStatsDeckProps {
  data: any;
}

const YouTubeStatsDeck: React.FC<YouTubeStatsDeckProps> = ({ data }) => {
  const statsDeck = [
    {
      label: "Subscribers",
      value: data?.channel?.statistics?.subscriberCount,
      icon: Users2,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Total Views",
      value: data?.channel?.statistics?.viewCount,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Library",
      value: data?.channel?.statistics?.videoCount,
      icon: PlayCircle,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {statsDeck.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-w-[140px] group hover:border-slate-300 transition-all"
        >
          <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-2xl mb-3`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCompactNumber(stat.value)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default YouTubeStatsDeck;
