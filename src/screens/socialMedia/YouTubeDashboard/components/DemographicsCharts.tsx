"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DemographicsChartsProps {
  demographics: {
    topLocations: any[];
    ageRange: any[];
    gender: any[];
    subscribedStatus?: any[];
  };
}

const COLORS = ['#3b82f6', '#d946ef', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const DemographicsCharts = ({ demographics }: DemographicsChartsProps) => {
  const { topLocations = [], ageRange = [], gender = [], subscribedStatus = [], geography = {} } = (demographics as any) || {};

  const countries = (geography as any)?.countries || topLocations;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-xl font-black text-slate-900">Gender</h3>
            {gender.length > 0 && (
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                {gender.reduce((acc: number, curr: any) => acc + Number(curr.value || 0), 0)}% Total
              </span>
            )}
          </div>
          <div className="h-[200px] w-full mt-auto">
            {gender.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gender}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="gender"
                  >
                    {gender.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <span className="text-slate-300 font-black">?</span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No gender data</p>
              </div>
            )}
          </div>
        </div>

        {/* Age Range Distribution */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 col-span-1 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-xl font-black text-slate-900">Age Range</h3>
            {ageRange.length > 0 && (
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                View Distribution
              </span>
            )}
          </div>
          <div className="h-[200px] w-full mt-auto">
            {ageRange.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageRange}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="ageRange" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 800, fill: '#9ca3af' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 800, fill: '#9ca3af' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                   <span className="text-slate-300 font-black">!</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting age demographics</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations / Geography */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-slate-900 mb-8">Top Geography</h3>
          <div className="space-y-6">
            {countries.length > 0 ? (
              countries.map((loc: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-black text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{loc.country || loc.countryCode || 'Other'}</span>
                    </div>
                    <span>{formatCompactNumber(loc.views)} views {loc.percentage ? `(${loc.percentage}%)` : ''}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full shadow-sm shadow-blue-100" 
                      style={{ width: `${loc.percentage || (loc.views / countries[0].views * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                 <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                 </div>
                 <p className="text-xs font-bold text-slate-400">Global reach data will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Subscriber Loyalty */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
           <h3 className="text-xl font-black text-slate-900 mb-8">Subscriber Loyalty</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-grow">
              <div className="h-[180px]">
                 {subscribedStatus.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subscribedStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="views"
                          nameKey="status"
                        >
                          <Cell fill="#6366f1" strokeWidth={0} />
                          <Cell fill="#dee2e6" strokeWidth={0} />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 ) : (
                    <div className="h-full flex items-center justify-center text-slate-200">
                       <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    </div>
                 )}
              </div>
              <div className="space-y-4">
                 {subscribedStatus.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-3xl bg-slate-50/50 border border-slate-100/50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.status}</p>
                       <div className="flex justify-between items-end">
                          <span className="text-xl font-black text-slate-900">{formatCompactNumber(item.views)}</span>
                          <span className="text-xs font-bold text-slate-500">Views</span>
                       </div>
                    </div>
                 ))}
                 {subscribedStatus.length === 0 && (
                    <p className="text-[10px] font-bold text-slate-400 text-center italic">Calculated based on 28-day watch history</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicsCharts;
