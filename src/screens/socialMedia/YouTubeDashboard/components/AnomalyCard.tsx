"use client";
import React from "react";
import { Flag } from "lucide-react";
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

const data = [
  { value: 40 },
  { value: 60 },
  { value: 45 },
  { value: 80 },
  { value: 50 },
  { value: 100 }, // This will be the highlighted one
  { value: 65 },
  { value: 85 },
];

const AnomalyCard = () => {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">Anomaly Detected</h3>
        <div className="bg-orange-100 p-2 rounded-full">
           <Flag className="w-4 h-4 text-orange-600 fill-orange-600" />
        </div>
      </div>
      
      <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8 max-w-[280px]">
        Your followers are increasing beyond our predictions. It could be because someone shared one of your posts.
      </p>

      <div className="h-[120px] w-full relative mb-8">
        <div className="absolute top-0 right-[25%] z-10">
            <div className="bg-black text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                +1,092 Subscribers
            </div>
            <div className="w-1 h-4 bg-black/10 mx-auto mt-1 border-r border-dotted border-black/50" />
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 5 ? "#00c49f" : "#f0fdfa"} 
                  style={{ stroke: index === 5 ? '#2dd4bf' : 'none', strokeWidth: index === 5 ? 4 : 0, strokeDasharray: index === 5 ? '4 2' : 'none' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-bold text-gray-900 leading-none">98,2%</h2>
           <p className="text-xs text-gray-400 font-medium mt-2">Prediction 45%</p>
        </div>
        <button className="text-blue-500 border border-blue-500 rounded-full px-5 py-2 text-xs font-bold hover:bg-blue-50 transition-colors">
          See Details
        </button>
      </div>
    </div>
  );
};

export default AnomalyCard;
