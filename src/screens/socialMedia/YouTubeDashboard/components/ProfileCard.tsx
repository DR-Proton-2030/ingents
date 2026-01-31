"use client";
import React, { useState } from "react";
import { MoreHorizontal, Youtube } from "lucide-react";
import { motion } from "framer-motion";

const ProfileCard = ({ data, demographics }: { data: any, demographics: any }) => {
  const [activeTab, setActiveTab] = useState("Top Locations");

  const getTabData = () => {
    switch (activeTab) {
      case "Top Locations":
        return demographics?.topLocations || [];
      case "Age Range":
        return demographics?.ageRange || [];
      case "Gender":
        return demographics?.gender || [];
      default:
        return [];
    }
  };

  const displayData = getTabData();

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={data?.thumbnails?.default?.url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-0.5 border-2 border-white">
              <Youtube className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{data?.title || data?.handle || "Channel Name"}</h3>
            <span className="text-xs text-gray-400 font-medium">{data?.handle}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{Number(data?.statistics?.subscriberCount || 0).toLocaleString()}</h2>
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

      <div className="space-y-6 min-h-[150px]">
        {displayData.length > 0 ? (
          displayData.map((item: any, idx: number) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-gray-900">{item.name}</span>
                <span className="text-gray-900">{item.value?.toLocaleString() || item.percentage + "%"}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage || 0}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`${item.color || "bg-blue-500"} h-full rounded-full`}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-4">
            <p className="text-xs font-medium">No {activeTab.toLowerCase()} data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
