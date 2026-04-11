import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Youtube, Facebook, Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { PostedContent } from "@/service/scheduler/scheduler.service";

const platformConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string; barColor: string }
> = {
  youtube: {
    icon: <Youtube className="w-3.5 h-3.5" />,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "YouTube",
    barColor: "#ef4444",
  },
  facebook: {
    icon: <Facebook className="w-3.5 h-3.5" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Facebook",
    barColor: "#2563eb",
  },
  instagram: {
    icon: <Instagram className="w-3.5 h-3.5" />,
    color: "text-pink-500",
    bg: "bg-pink-50",
    label: "Instagram",
    barColor: "#ec4899",
  },
  x: {
    icon: <FaXTwitter className="w-3.5 h-3.5" />,
    color: "text-gray-800",
    bg: "bg-gray-100",
    label: "X",
    barColor: "#1f2937",
  },
};

interface PostsPerPlatformChartProps {
  posts: PostedContent[];
}

export function PostsPerPlatformChart({ posts }: PostsPerPlatformChartProps) {
  const chartData = Object.entries(
    posts.reduce(
      (acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  )
    .map(([platform, count]) => ({
      platform: platformConfig[platform]?.label || platform,
      count,
      color: platformConfig[platform]?.barColor || "#94a3b8",
      key: platform,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-[#f2f5fd] rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          
         
        </div>
      </div>
      {!chartData.length ? (
        <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
          No posts yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={32} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="platform"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              formatter={(value: number) => [`${value} posts`, "Posts"]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={"rgba(221, 226, 255, 0.85)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
