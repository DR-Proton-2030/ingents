"use client";
import React, { useState } from "react";
import { MoreHorizontal, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState("Top Locations");

  const locations = [
    { name: "United States", value: 197520, percentage: 80, color: "bg-blue-500" },
    { name: "Brazil", value: 32985, percentage: 40, color: "bg-blue-400" },
    { name: "Switzerland", value: 10254, percentage: 20, color: "bg-blue-200" },
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-0.5 border-2 border-white">
              <Youtube className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">@samanthawilliam_</h3>
            <span className="text-xs text-gray-400 font-medium">YouTube</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">278,534</h2>
          <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Subscribers</span>
        </div>
      </div>

      <div className="bg-gray-50 p-1 rounded-2xl flex mb-8">
         {["Top Locations", "Age Range", "Gender"].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all duration-200 ${
               activeTab === tab
                 ? "bg-white text-gray-900 shadow-sm"
                 : "text-gray-400 hover:text-gray-600"
             }`}
           >
             {tab}
           </button>
         ))}
      </div>

      <div className="space-y-6">
        {locations.map((loc, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-gray-900">{loc.name}</span>
              <span className="text-gray-900">{loc.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loc.percentage}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className={`${loc.color} h-full rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;
