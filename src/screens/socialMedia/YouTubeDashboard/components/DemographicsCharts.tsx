"use client";
import React from "react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users2, Activity, UserCheck2, Smartphone, Cpu } from "lucide-react";
import { motion } from "framer-motion";

interface DemographicsChartsProps {
  demographics: {
    ageRange: any[];
    gender: any[];
    subscribedStatus?: any[];
    devices?: any[];
    operatingSystems?: any[];
  };
}

const COLORS = ['#0f172a', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const DemographicCard = ({ title, data, icon: Icon, labelKey, valueKey = "value" }: any) => {
  const processedData = data?.map((item: any, idx: number) => {
    let label = item[labelKey];
    if (label === "SUBSCRIBED") label = "Subscribed";
    if (label === "UNSUBSCRIBED") label = "Not Subscribed";
    if (label?.startsWith("age")) label = label.replace("age", "") + " Years";
    if (label === "female") label = "Female";
    if (label === "male") label = "Male";
    
    return {
      ...item,
      displayLabel: label,
      fill: COLORS[idx % COLORS.length]
    };
  }) || [];

  const total = processedData.reduce((acc: number, curr: any) => acc + (Number(curr[valueKey]) || 0), 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 min-w-[120px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].name}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-white">{formatCompactNumber(payload[0].value)}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Views</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-8 rounded-[50px] shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-500 group">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-900 group-hover:scale-110 transition-transform shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">{title}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Distribution</p>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="h-[200px] w-full relative mb-8">
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
               <span className="text-xs font-black uppercase text-slate-300">No Data Available</span>
            </div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
             <span className="text-xl font-black text-slate-900">{formatCompactNumber(total)}</span>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-50">
          {processedData.slice(0, 4).map((item: any, idx: number) => (
            <div key={idx} className="flex flex-col gap-1.5">
               <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
                     <span className="text-[11px] font-bold text-slate-600">{item.displayLabel}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900">{formatCompactNumber(item[valueKey])}</span>
               </div>
               <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: total > 0 ? `${(item[valueKey] / total * 100)}%` : "0%" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DemographicsCharts = ({ demographics }: DemographicsChartsProps) => {
  const { ageRange = [], gender = [], subscribedStatus = [], devices = [], operatingSystems = [] } = (demographics as any) || {};

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <DemographicCard 
          title="Gender" 
          data={gender} 
          icon={Users2} 
          labelKey="gender" 
          valueKey="views"
        />
        <DemographicCard 
          title="Age Group" 
          data={ageRange} 
          icon={Activity} 
          labelKey="ageGroup" 
          valueKey="views"
        />
        <DemographicCard 
          title="Subscriber Loyalty" 
          data={subscribedStatus} 
          icon={UserCheck2} 
          labelKey="status" 
          valueKey="views"
        />
        {devices.length > 0 && (
          <DemographicCard 
            title="Device Usage" 
            data={devices} 
            icon={Smartphone} 
            labelKey="deviceType" 
            valueKey="views"
          />
        )}
        {operatingSystems.length > 0 && (
          <DemographicCard 
            title="Operating Systems" 
            data={operatingSystems} 
            icon={Cpu} 
            labelKey="os" 
            valueKey="views"
          />
        )}
      </div>
    </div>
  );
};

export default DemographicsCharts;
