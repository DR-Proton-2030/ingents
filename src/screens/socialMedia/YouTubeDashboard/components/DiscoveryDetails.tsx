"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { Search, Globe, ChevronRight } from "lucide-react";

interface DiscoveryDetailsProps {
  searchTerms: any[];
  externalSites: any[];
}

const DiscoveryDetails = ({ searchTerms = [], externalSites = [] }: DiscoveryDetailsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Search Terms */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Search Terms</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">What users search to find you</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl">
             <Search className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          {searchTerms.length > 0 ? (
            searchTerms.map((term, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400">#{(idx + 1).toString().padStart(2, '0')}</span>
                  <span className="text-xs font-black text-gray-700">{term.term}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-900">{formatCompactNumber(term.views)} views</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-slate-300" />
               </div>
               <p className="text-xs font-bold text-slate-400">No search term data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* External Sites */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">External Sources</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">External traffic origins</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl">
             <Globe className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="space-y-4">
          {externalSites.length > 0 ? (
            externalSites.map((site, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 font-black text-[10px] text-emerald-600">
                    {site.site.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-black text-gray-700">{site.site}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-900">{formatCompactNumber(site.views)} views</span>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{site.percentage}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-slate-300" />
               </div>
               <p className="text-xs font-bold text-slate-400">No external source data detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryDetails;
