"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { Globe } from "lucide-react";

interface GeographySectionProps {
  topLocations: any[];
}

const GeographySection = ({ topLocations }: GeographySectionProps) => {
  console.log("topLocations", topLocations)
  return (
    <section className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-2xl bg-slate-900 shadow-xl shadow-slate-200">
           <Globe className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Audience Geography</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Global Reach Breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topLocations?.map((loc: any, idx: number) => (
          <div key={idx} className="p-6 rounded-[35px] bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border-2 border-white">
                    <img 
                      src={`https://flagcdn.com/w80/${(loc.country || loc.countryCode || 'un')?.toLowerCase()}.png`} 
                      className="w-full h-full object-cover" 
                      alt={loc.country}
                      onError={(e: any) => e.target.src = 'https://flagcdn.com/w80/un.png'}
                    />
                 </div>
                 <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{loc.country || loc.countryCode}</span>
              </div>
              {/* <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                {loc.percentage ? `${loc.percentage}%` : '---'}
              </span> */}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</span>
                  <span className="text-2xl font-black text-slate-900">{formatCompactNumber(loc.views)}</span>
                </div>
                {/* <div className="flex flex-col text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retention</span>
                  <span className="text-sm font-black text-slate-700">{loc.averageViewDuration ? `${Math.floor(loc.averageViewDuration / 60)}m` : 'N/A'}</span>
                </div> */}
              </div>
              
              {/* <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${loc.percentage || (loc.views / (topLocations[0]?.views || 1) * 100)}%` }}
                />
              </div> */}
            </div>
          </div>
        ))}
        
        {(!topLocations || topLocations.length === 0) && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global reach data will appear here shortly</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GeographySection;
