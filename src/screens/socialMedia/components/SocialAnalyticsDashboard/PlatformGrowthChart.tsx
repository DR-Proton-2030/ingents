"use client";
import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RefreshCw } from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import { getWeeklyEngagement, triggerInsightsSync } from "@/utils/api/insights/insights.api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ── Platform config ──────────────────────────────── */

const PLATFORMS = {
  youtube: {
    key: "youtube",
    label: "YouTube",
    metric: "Views",
    color: "#ef4444",
    gradientId: "gradYoutube",
    icon: <FaYoutube className="w-4 h-4" />,
  },
  facebook: {
    key: "facebook",
    label: "Facebook",
    metric: "Likes",
    color: "#2563eb",
    gradientId: "gradFacebook",
    icon: <FaFacebook className="w-4 h-4" />,
  },
  instagram: {
    key: "instagram",
    label: "Instagram",
    metric: "Likes",
    color: "#ec4899",
    gradientId: "gradInstagram",
    icon: <FaInstagram className="w-4 h-4" />,
  },
  x: {
    key: "x",
    label: "X",
    metric: "Likes",
    color: "#1f2937",
    gradientId: "gradX",
    icon: <FaXTwitter className="w-4 h-4" />,
  },
} as const;

type PlatformKey = keyof typeof PLATFORMS;

export interface WeeklyDataPoint {
  week: string;
  weekStart: string;
  youtube: number;
  facebook: number;
  instagram: number;
  x: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/* ── Custom tooltip ───────────────────────────────── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 min-w-[180px]">
      <p className="text-xs font-semibold text-slate-500 mb-2">Week of {label}</p>
      {payload.map((entry: any) => {
        const platform = PLATFORMS[entry.dataKey as PlatformKey];
        if (!platform) return null;
        return (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-slate-600">{platform.label}</span>
            </div>
            <span className="text-xs font-bold text-slate-800">
              {formatNumber(entry.value)} {platform.metric.toLowerCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main component ───────────────────────────────── */

export default function PlatformGrowthChart() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState<WeeklyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeksWindow, setWeeksWindow] = useState(6);
  const [activePlatforms, setActivePlatforms] = useState<Set<PlatformKey>>(
    new Set(["youtube", "facebook", "instagram", "x"])
  );

  const userId = (user as any)?._id || (user as any)?.id;

  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Trigger a background sync so engagement data stays fresh
      triggerInsightsSync(userId).catch(() => {});
      const baseWeeks = 6;
      const fallbackWeeks = 12;

      const hasNonZeroMetrics = (weeks: WeeklyDataPoint[]) =>
        weeks.some(
          (w) =>
            (w.youtube || 0) > 0 ||
            (w.facebook || 0) > 0 ||
            (w.instagram || 0) > 0 ||
            (w.x || 0) > 0
        );

      const res = await getWeeklyEngagement(userId, baseWeeks);
      if (res.success && res.result?.weeks) {
        const baseWeeksData = res.result.weeks as WeeklyDataPoint[];
        if (hasNonZeroMetrics(baseWeeksData)) {
          setData(baseWeeksData);
          setWeeksWindow(baseWeeks);
        } else {
          const fallbackRes = await getWeeklyEngagement(userId, fallbackWeeks);
          if (fallbackRes.success && fallbackRes.result?.weeks) {
            const fallbackData = fallbackRes.result.weeks as WeeklyDataPoint[];
            setData(fallbackData);
            setWeeksWindow(fallbackWeeks);
          } else {
            setData(baseWeeksData);
            setWeeksWindow(baseWeeks);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch weekly engagement:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const onManualSync = () => {
      fetchData();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("insights:manual-sync", onManualSync);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("insights:manual-sync", onManualSync);
      }
    };
  }, [fetchData]);

  const togglePlatform = (key: PlatformKey) => {
    setActivePlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key); // keep at least one active
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Summary totals
  const totals = useMemo(() => {
    const sums = { youtube: 0, facebook: 0, instagram: 0, x: 0 };
    data.forEach((d) => {
      sums.youtube += d.youtube || 0;
      sums.facebook += d.facebook || 0;
      sums.instagram += d.instagram || 0;
      sums.x += d.x || 0;
    });
    return sums;
  }, [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-48 mb-6" />
        <div className="h-[260px] bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 p-6"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Weekly Engagement
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            YT views &middot; FB / Insta / X likes &mdash; last {weeksWindow} weeks
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {(Object.values(PLATFORMS) as (typeof PLATFORMS)[PlatformKey][]).map((p) => (
            <button
              key={p.key}
              onClick={() => togglePlatform(p.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm transition-all border ${
                activePlatforms.has(p.key)
                  ? "border-slate-200 opacity-100"
                  : "border-transparent opacity-35"
              } hover:opacity-100`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-slate-600">{p.label}</span>
            </button>
          ))}
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
          <defs>
            {Object.values(PLATFORMS).map((p) => (
              <linearGradient
                key={p.gradientId}
                id={p.gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={p.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={p.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatNumber}
          />
          <Tooltip content={<CustomTooltip />} />

          {Object.values(PLATFORMS).map((p) =>
            activePlatforms.has(p.key) ? (
              <Area
                key={p.key}
                type="monotone"
                dataKey={p.key}
                stroke={p.color}
                strokeWidth={2.5}
                fill={`url(#${p.gradientId})`}
                dot={{ r: 3, fill: p.color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: p.color, stroke: "#fff", strokeWidth: 2 }}
              />
            ) : null
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary row */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-4 gap-4">
          {(Object.values(PLATFORMS) as (typeof PLATFORMS)[PlatformKey][]).map((p) => (
            <div
              key={p.key}
              className={`text-center transition-opacity ${
                activePlatforms.has(p.key) ? "opacity-100" : "opacity-35"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span style={{ color: p.color }}>{p.icon}</span>
                <span className="text-lg font-bold text-slate-800">
                  {formatNumber(totals[p.key])}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{p.metric}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
