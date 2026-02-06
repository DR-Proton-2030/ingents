"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Clock, Percent, Info } from "lucide-react";

interface RetentionAnalyticProps {
  retention: any;
}

const RetentionAnalytic = ({ retention }: RetentionAnalyticProps) => {
  const averages = retention?.averages || { averageViewDuration: 0, averageViewPercentage: 0 };
  const daily = retention?.daily || [];

  const chartData = daily.map((item: any) => ({
    date: item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A',
    duration: Number(item.averageViewDuration || 0),
    percentage: Number(item.averageViewPercentage || 0)
  }));

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Audience Retention</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Maintaining viewer engagement over time</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Duration</p>
              <div className="flex items-center gap-2 justify-end">
                 <Clock className="w-4 h-4 text-blue-500" />
                 <span className="text-xl font-black text-slate-900">{averages.averageViewDuration}s</span>
              </div>
           </div>
           <div className="w-px h-10 bg-slate-100" />
           <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Percentage</p>
              <div className="flex items-center gap-2 justify-end">
                 <Percent className="w-4 h-4 text-emerald-500" />
                 <span className="text-xl font-black text-slate-900">{(averages.averageViewPercentage || 0).toFixed(1)}%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip 
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
              labelStyle={{ fontWeight: 800, marginBottom: '6px' }}
            />
            <Area 
              type="monotone" 
              dataKey="percentage" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={0} 
            />
            <Area 
              type="monotone" 
              dataKey="duration" 
              name="Duration (s)"
              stroke="#3b82f6" 
              strokeWidth={3} 
              fill="url(#colorDuration)" 
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex items-start gap-3">
         <Info className="w-4 h-4 text-blue-500 mt-0.5" />
         <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
           Retention shows which moments in your videos are most engaging. Typical retention for high-performing content is above 40%.
         </p>
      </div>
    </div>
  );
};

export default RetentionAnalytic;
