import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";

const COLORS = [
  "#1877F2",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

interface FBLineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
  height?: number;
  disabled?: boolean;
  tooltipText?: string;
}

export const FBLineChart: React.FC<FBLineChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  height = 350,
  disabled = false,
  tooltipText,
}) => {
  const chartData = useMemo(() => data || [], [data]);

  return (
    <div
      className={`bg-white/60 p-10 rounded-[40px] border border-white/40 backdrop-blur-2xl shadow-xl transition-all hover:shadow-2xl ${disabled ? "opacity-50 grayscale select-none" : ""}`}
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Performance Trend
          </p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h3>
        </div>
        {tooltipText && (
          <TooltipProvider delayDuration={300}>
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help p-1 -m-1 outline-none opacity-40 hover:opacity-100 transition-opacity">
                  <Info className="w-4 h-4 text-slate-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl px-4 py-2 text-xs border-none shadow-2xl"
              >
                <p className="max-w-xs font-medium">{tooltipText}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        )}
      </div>
      <div style={{ width: "100%", height }}>
        {chartData.length === 0 || disabled ? (
          <div className="h-full flex flex-col items-center justify-center bg-white/40 rounded-[30px] text-slate-400 border border-dashed border-white/60">
            <TrendingUpIcon size={32} className="mb-4 opacity-20" />
            <span className="text-xs font-black uppercase tracking-widest">
              {disabled ? "Restricted via API" : "No Activity Data"}
            </span>
          </div>
        ) : (
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1877F2" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                dy={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                tickFormatter={(val) => formatCompactNumber(val)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  padding: "16px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                cursor={{ stroke: "#E2E8F0", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke="#1877F2"
                strokeWidth={4}
                dot={{ r: 0, fill: "#1877F2" }}
                activeDot={{
                  r: 6,
                  strokeWidth: 4,
                  stroke: "#fff",
                  fill: "#1877F2",
                }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

interface FBDonutChartProps {
  data: { label: string; value: number }[];
  title: string;
  height?: number;
  disabled?: boolean;
  tooltipText?: string;
}

export const FBDonutChart: React.FC<FBDonutChartProps> = ({
  data,
  title,
  height = 350,
  disabled = false,
  tooltipText,
}) => {
  const chartData = useMemo(() => data || [], [data]);

  return (
    <div
      className={`bg-white/60 p-10 rounded-[40px] border border-white/40 backdrop-blur-2xl shadow-xl transition-all hover:shadow-2xl ${disabled ? "opacity-50 grayscale select-none" : ""}`}
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Data Distribution
          </p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h3>
        </div>
        {tooltipText && (
          <TooltipProvider delayDuration={300}>
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help p-1 -m-1 outline-none opacity-40 hover:opacity-100 transition-opacity">
                  <Info className="w-4 h-4 text-slate-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl px-4 py-2 text-xs border-none shadow-2xl"
              >
                <p className="max-w-xs font-medium">{tooltipText}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        )}
      </div>
      <div style={{ width: "100%", height }}>
        {chartData.length === 0 || disabled ? (
          <div className="h-full flex flex-col items-center justify-center bg-white/40 rounded-[30px] text-slate-400">
            <span className="text-xs font-black uppercase tracking-widest">
              {disabled ? "Restricted Metric" : "No Data Points"}
            </span>
          </div>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                nameKey="label"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="outline-none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

interface FBBarChartProps {
  data: any[];
  xKey: string;
  bars: { key: string; color: string; label?: string }[];
  title: string;
  layout?: "horizontal" | "vertical";
  height?: number;
  disabled?: boolean;
  tooltipText?: string;
}

export const FBBarChart: React.FC<FBBarChartProps> = ({
  data,
  xKey,
  bars,
  title,
  layout = "horizontal",
  height = 350,
  disabled = false,
  tooltipText,
}) => {
  const chartData = useMemo(() => data || [], [data]);

  return (
    <div
      className={`bg-white/60 p-10 rounded-[40px] border border-white/40 backdrop-blur-2xl shadow-xl transition-all hover:shadow-2xl ${disabled ? "opacity-50 grayscale select-none" : ""}`}
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Comparative Insights
          </p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h3>
        </div>
        {tooltipText && (
          <TooltipProvider delayDuration={300}>
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help p-1 -m-1 outline-none opacity-40 hover:opacity-100 transition-opacity">
                  <Info className="w-4 h-4 text-slate-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl px-4 py-2 text-xs border-none shadow-2xl"
              >
                <p className="max-w-xs font-medium">{tooltipText}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        )}
      </div>
      <div style={{ width: "100%", height }}>
        {chartData.length === 0 || disabled ? (
          <div className="h-full flex flex-col items-center justify-center bg-white/40 rounded-[30px] text-slate-400 border border-dashed border-white/60">
            <span className="text-xs font-black uppercase tracking-widest">
              {disabled ? "Metric Limited" : "Insufficient Data"}
            </span>
          </div>
        ) : (
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout={layout}
              barSize={layout === "horizontal" ? 30 : 20}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={layout === "horizontal"}
                horizontal={layout === "vertical"}
                stroke="#F1F5F9"
              />
              {layout === "horizontal" ? (
                <>
                  <XAxis
                    dataKey={xKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(val) => formatCompactNumber(val)}
                  />
                </>
              ) : (
                <>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey={xKey}
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#1E293B", fontSize: 11, fontWeight: 800 }}
                    width={110}
                  />
                </>
              )}
              <Tooltip
                cursor={{ fill: "#f8fafc", radius: 8 }}
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              />
              {bars.map((bar, index) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  fill={bar.color}
                  name={bar.label || bar.key}
                  radius={layout === "horizontal" ? [8, 8, 0, 0] : [0, 8, 8, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const TrendingUpIcon = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
