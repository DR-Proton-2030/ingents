"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export interface ChartDataPoint {
  month: string;
  followers: number;
  viewers: number;
}

export interface AudienceGrowthChartProps {
  data: ChartDataPoint[];
  formatNumber?: (num: number) => string;
}

const defaultFormatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

export default function AudienceGrowthChart({
  data,
  formatNumber = defaultFormatNumber,
}: AudienceGrowthChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.followers));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Audience Growth</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-sm text-slate-600">Followers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400" />
            <span className="text-sm text-slate-600">Viewers</span>
          </div>
        </div>
      </div>

      {/* Y-axis labels and chart */}
      <div className="flex">
        <div
          className="flex flex-col justify-between text-xs text-slate-400 pr-4 py-2"
          style={{ height: 200 }}
        >
          <span>200K</span>
          <span>100K</span>
          <span>50K</span>
          <span>10K</span>
        </div>

        {/* Bars */}
        <div
          className="flex-1 flex items-end justify-between gap-2 relative"
          style={{ height: 200 }}
        >
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map((_, i) => (
              <div key={i} className="border-b border-dashed border-slate-100" />
            ))}
          </div>

          {data.map((item, index) => (
            <div
              key={item.month}
              className="flex flex-col items-center flex-1 relative z-10"
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Tooltip */}
              {hoveredBar === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-10 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-20"
                >
                  Followers: {formatNumber(item.followers)}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800" />
                </motion.div>
              )}

              <div className="w-full flex flex-col items-center gap-0.5">
                {/* Followers bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(item.followers / maxValue) * 160}px`,
                  }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg cursor-pointer hover:from-amber-500 hover:to-amber-400 transition-colors"
                />
                {/* Viewers bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(item.viewers / maxValue) * 160}px`,
                  }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-purple-400 to-purple-300 rounded-b-lg cursor-pointer hover:from-purple-500 hover:to-purple-400 transition-colors"
                />
              </div>
              <span className="text-xs text-slate-500 mt-3">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
