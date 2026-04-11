import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PostedContent } from "@/service/scheduler/scheduler.service";

interface PostsAreaChartProps {
  posts: PostedContent[];
}

export function PostsAreaChart({ posts }: PostsAreaChartProps) {
  const data = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("en-US", { month: "short" });
      months[key] = 0;
    }
    posts.forEach((p) => {
      const d = new Date(p.posted_at);
      const key = d.toLocaleString("en-US", { month: "short" });
      if (key in months) months[key]++;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [posts]);

  return (
    <div className="rounded-[22px] bg-gradient-to-b from-[#f0f3fa] to-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5">
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
        >
          <defs>
            <linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              fontSize: "12px",
            }}
            formatter={(v: number) => [`${v} posts`, "Posts"]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#94a3b8"
            strokeWidth={2.5}
            fill="url(#postsGrad)"
            dot={{ r: 4, fill: "#94a3b8", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#64748b" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
