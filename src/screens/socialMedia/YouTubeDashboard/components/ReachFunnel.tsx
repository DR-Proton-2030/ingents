"use client";
import React from "react";
import { ArrowRight, Eye, MousePointer2, BarChart3, TrendingUp } from "lucide-react";

interface ReachFunnelProps {
  reach: any;
}

const ReachFunnel = ({ reach }: ReachFunnelProps) => {
  const overview = reach?.overview || { impressions: 0, impressionsCtr: 0, views: 0 };
  
  const funnelSteps = [
    {
      label: "Impressions",
      value: Number(overview.impressions).toLocaleString(),
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
      value: Number(overview.views).toLocaleString(),
      subtext: "Views that came from those impressions",
      icon: BarChart3,
      color: "bg-violet-500"
    }
  ];

  return (
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
            {idx < funnelSteps.map.length - 1 && (
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
  );
};

export default ReachFunnel;
