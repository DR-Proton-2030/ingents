"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { ArrowRight, Eye, MousePointer2, BarChart3, TrendingUp } from "lucide-react";

interface ReachFunnelProps {
  reach: any;
}

const ReachFunnel = ({ reach }: ReachFunnelProps) => {
  const overview = reach?.overview || { impressions: 0, impressionsCtr: 0, views: 0 };
  
  const funnelSteps = [
    {
      label: "Impressions",
      value: formatCompactNumber(overview.impressions),
      subtext: "How many times your thumbnails were shown",
      icon: Eye,
      color: "bg-blue-500"
    },
    {
      label: "Click-Through Rate (CTR)",
      value: `${(overview.impressionsCtr || 0).toFixed(1)}%`,
      subtext: "Views per impressions shown",
      icon: MousePointer2,
      color: "bg-indigo-500"
    },
    {
      label: "Views from Impressions",
      value: formatCompactNumber(overview.views),
      subtext: "Views that came from those impressions",
      icon: BarChart3,
      color: "bg-violet-500"
    }
  ];

  const bySource = reach?.bySource || [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="mb-8">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Reach Funnel</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Understanding how your content is discovered</p>
        </div>

        <div className="relative space-y-4">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
                <div className={`p-4 rounded-2xl ${step.color} text-white shadow-lg`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-baseline gap-2">
                     <h4 className="text-2xl font-black text-slate-900">{step.value}</h4>
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{step.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">{step.subtext}</p>
                </div>
              </div>
              {idx < funnelSteps.length - 1 && (
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-white p-1 rounded-full border border-slate-100 shadow-sm">
                     <ArrowRight className="w-4 h-4 text-slate-300 rotate-90" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {bySource.length > 0 && (
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-slate-900 mb-6">Discovery by Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bySource.map((source: any, idx: number) => (
              <div key={idx} className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{source.source.replace(/_/g, ' ')}</p>
                  <p className="text-lg font-black text-slate-900">{formatCompactNumber(source.views)}</p>
                </div>
                {source.impressions > 0 && (
                   <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">CTR</p>
                      <p className="text-xs font-black text-indigo-600">{Number(source.impressionsCtr).toFixed(1)}%</p>
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReachFunnel;
