"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users2, Activity, Globe, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface InstagramDemographicsChartsProps {
  demographics: {
    city?: Record<string, number>;
    country?: Record<string, number>;
    gender?: Record<string, number>;
    age?: Record<string, number>;
  };
}

const COLORS = [
  "#0f172a",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
];

const DemographicCard = ({
  title,
  data,
  icon: Icon,
  labelKey,
  valueKey = "value",
  type = "pie",
}: any) => {
  const processedData =
    data?.map((item: any, idx: number) => {
      let label = item[labelKey];
      if (label === "F") label = "Female";
      if (label === "M") label = "Male";
      if (label === "U") label = "Unknown";

      return {
        ...item,
        displayLabel: label,
        fill: COLORS[idx % COLORS.length],
      };
    }) || [];

  const total = processedData.reduce(
    (acc: number, curr: any) => acc + (Number(curr[valueKey]) || 0),
    0,
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 min-w-[120px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            {payload[0].name}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-white">
              {formatCompactNumber(payload[0].value)}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Followers
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-8 rounded-[50px] shadow-sm border border-gray-100 flex flex-col h-[500px] hover:shadow-xl transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-900 group-hover:scale-110 transition-transform shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              Distribution
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total
          </span>
          <span className="text-lg font-black text-slate-900">
            {formatCompactNumber(total)}
          </span>
        </div>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        {type === "pie" ? (
          <>
            <div className="h-[200px] w-full relative mb-6 shrink-0">
              {processedData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey={valueKey}
                      nameKey="displayLabel"
                      stroke="none"
                    >
                      {processedData.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          className="outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={false}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-200">
                  <span className="text-xs font-black uppercase text-slate-300">
                    No Data Available
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50 overflow-y-auto pr-2 custom-scrollbar">
              {processedData.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-[11px] font-bold text-slate-600">
                        {item.displayLabel}
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900">
                      {formatCompactNumber(item[valueKey])}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width:
                          total > 0
                            ? `${(item[valueKey] / total) * 100}%`
                            : "0%",
                      }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-5 pt-2">
            {processedData.length > 0 ? (
              processedData.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 max-w-[80%]">
                      <span className="text-[10px] font-black text-slate-400 w-5">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-700 truncate">
                        {item.displayLabel}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">
                        {formatCompactNumber(item[valueKey])}
                      </span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {total > 0
                          ? ((item[valueKey] / total) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width:
                          total > 0
                            ? `${(item[valueKey] / total) * 100}%`
                            : "0%",
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-slate-900 to-slate-700 shadow-sm"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-200">
                <span className="text-xs font-black uppercase text-slate-300">
                  No Data Available
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e8f0;
        }
      `}</style>
    </div>
  );
};

const InstagramDemographicsCharts = ({
  demographics,
}: InstagramDemographicsChartsProps) => {
  const { city = {}, country = {}, gender = {}, age = {} } = demographics || {};

  const processData = (data: Record<string, number>, labelKey: string) => {
    return Object.entries(data)
      .map(([label, value]) => ({
        [labelKey]: label,
        value: value,
      }))
      .sort((a, b) => b.value - a.value);
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
        <DemographicCard
          title="Gender"
          data={processData(gender, "gender")}
          icon={Users2}
          labelKey="gender"
          valueKey="value"
          type="pie"
        />
        <DemographicCard
          title="Age Group"
          data={processData(age, "ageGroup")}
          icon={Activity}
          labelKey="ageGroup"
          valueKey="value"
          type="pie"
        />
        <DemographicCard
          title="Top Countries"
          data={processData(country, "country")}
          icon={Globe}
          labelKey="country"
          valueKey="value"
          type="bar"
        />
        <DemographicCard
          title="Top Cities"
          data={processData(city, "city")}
          icon={MapPin}
          labelKey="city"
          valueKey="value"
          type="bar"
        />
      </div>
    </div>
  );
};

export default InstagramDemographicsCharts;
