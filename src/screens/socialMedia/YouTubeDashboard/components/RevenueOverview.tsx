"use client";
import React from "react";
import { DollarSign, BarChart, TrendingUp, Wallet, ShieldCheck } from "lucide-react";

interface RevenueOverviewProps {
  revenue: any;
}

const RevenueOverview = ({ revenue }: RevenueOverviewProps) => {
  const overview = revenue?.overview || { estimatedRevenue: 0, adImpressions: 0, monetizedPlaybacks: 0, playbackBasedCpm: 0 };
  
  const stats = [
    {
      label: "Est. Revenue",
      value: `$${Number(overview.estimatedRevenue).toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      label: "Ad Impressions",
      value: Number(overview.adImpressions).toLocaleString(),
      icon: BarChart,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      label: "Monetized Playbacks",
      value: Number(overview.monetizedPlaybacks).toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      label: "Playback CPM",
      value: `$${Number(overview.playbackBasedCpm).toFixed(2)}`,
      icon: Wallet,
      color: "text-amber-500",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Performance</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Earnings and monetization metrics</p>
        </div>
        <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100">
           <DollarSign className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
               <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueOverview;
