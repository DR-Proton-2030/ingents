"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface InstagramPerformanceChartProps {
  history: any[];
}

const InstagramPerformanceChart = ({
  history,
}: InstagramPerformanceChartProps) => {
  const chartData =
    history?.map((item) => ({
      date: item.date
        ? new Date(item.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        : "N/A",
      reach: item.reach || 0,
      impressions: item.impressions || 0,
      followers: item.follower_count || 0,
    })) || [];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[40px] shadow-sm border border-white/50 p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Account Performance
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Historical reach and impressions
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-100">
            <div className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-[10px] font-black text-pink-700 uppercase">
              Reach
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-[10px] font-black text-purple-700 uppercase">
              Impressions
            </span>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorImpressions"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "24px",
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                  padding: "16px",
                  backdropFilter: "blur(12px)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
                labelStyle={{
                  fontWeight: 900,
                  color: "#0f172a",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
                itemStyle={{ fontSize: "12px", fontWeight: 700 }}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorImpressions)"
              />
              <Area
                type="monotone"
                dataKey="reach"
                stroke="#ec4899"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorReach)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
            <div className="p-4 bg-slate-50 rounded-full">
              <TrendingUp className="w-8 h-8 opacity-20" />
            </div>
            <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
              Collecting Performance Data...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramPerformanceChart;
