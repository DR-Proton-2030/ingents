"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Smartphone, Monitor, Tablet, Laptop, Search, Tv, Globe, Cpu } from "lucide-react";

interface InsightsChartsProps {
  analytics: {
    trafficSources: any[];
    devices: any[];
    operatingSystems: any[];
    products: any[];
  };
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const getDeviceIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'DESKTOP': return Monitor;
    case 'MOBILE': return Smartphone;
    case 'TABLET': return Tablet;
    case 'TV': return Tv;
    default: return Laptop;
  }
};

const InsightsCharts = ({ analytics }: InsightsChartsProps) => {
  const { trafficSources = [], devices = [], operatingSystems = [], products = [] } = analytics || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Products (YouTube Services) */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">YouTube Surfaces</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Discovery via Watch, Shorts, or Embeds</p>
            </div>
            <div className="p-3 bg-red-50 rounded-2xl">
               <Tv className="w-5 h-5 text-red-500" />
            </div>
          </div>
          
          <div className="space-y-5 flex-grow justify-center flex flex-col">
            {products.length > 0 ? (
              products.map((prod, idx) => (
                <div key={idx} className="space-y-2">
                   <div className="flex justify-between items-end">
                      <div className="flex items-baseline gap-2">
                         <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{prod.product}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">{prod.views} Views</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full shadow-sm" 
                        style={{ width: `${(prod.views / Math.max(...products.map(p => p.views))) * 100}%` }} 
                      />
                   </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting surface data...</p>
              </div>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Traffic Sources</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Where your discovery starts</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
               <Search className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          {trafficSources.length > 0 ? (
            <div className="space-y-5">
              {trafficSources.slice(0, 4).map((source, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0`} style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-xs font-black text-gray-700 truncate">{source.source}</span>
                    </div>
                    <span className="text-xs font-black text-gray-900">{Number(source.views).toLocaleString()} views</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length], width: `${(source.views / Math.max(...trafficSources.map(s => s.views))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[150px] text-center space-y-4">
              < Globe className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-medium text-gray-400 max-w-xs mx-auto">Expanding your reach</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsCharts;
