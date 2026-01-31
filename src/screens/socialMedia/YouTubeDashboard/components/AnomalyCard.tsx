"use client";
import React from "react";
import { Flag } from "lucide-react";
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

const AnomalyCard = ({ statistics }: { statistics: any }) => {
  const subscriberCount = Number(statistics?.subscriberCount || 0);
  
  // Neutral state if no significant data
  if (!statistics) {
    return (
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
        <Flag className="w-12 h-12 text-gray-200 mb-4" />
        <h3 className="text-lg font-bold text-gray-400">No anomalies detected</h3>
        <p className="text-xs text-gray-300 text-center mt-2 max-w-[200px]">
          We'll notify you here if we detect unusual activity in your channel's growth.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">Growth Status</h3>
        <div className="bg-green-100 p-2 rounded-full">
           <Flag className="w-4 h-4 text-green-600 fill-green-600" />
        </div>
      </div>
      
      <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8 max-w-[280px]">
        Your channel is maintaining a healthy growth rate. Keep creating content to see more insights!
      </p>

      <div className="h-[120px] w-full relative mb-8">
        <div className="absolute top-0 right-[25%] z-10">
            <div className="bg-black text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                {subscriberCount.toLocaleString()} Subscribers
            </div>
            <div className="w-1 h-4 bg-black/10 mx-auto mt-1 border-r border-dotted border-black/50" />
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[{v: 40}, {v: 60}, {v: 45}, {v: 80}, {v: 50}, {v: 100}, {v: 65}, {v: 85}]}>
            <Bar dataKey="v" radius={[4, 4, 0, 0]}>
              {[40, 60, 45, 80, 50, 100, 65, 85].map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 5 ? "#10b981" : "#f0fdf4"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-bold text-gray-900 leading-none">Healthy</h2>
           <p className="text-xs text-gray-400 font-medium mt-2">Status: Active</p>
        </div>
        <button className="text-blue-500 border border-blue-500 rounded-full px-5 py-2 text-xs font-bold hover:bg-blue-50 transition-colors">
          Explore
        </button>
      </div>
    </div>
  );
};

export default AnomalyCard;
