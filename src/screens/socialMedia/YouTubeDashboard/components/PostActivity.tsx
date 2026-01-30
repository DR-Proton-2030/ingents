"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const PostActivity = () => {
  const stats = [
    { label: "Shorts", value: "687" },
    { label: "Videos", value: "189" },
    { label: "Lives", value: "24" },
  ];

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  
  // Mock grid data [value, isActive/intensity]
  const gridData = [
    [0, 0], [0, 0], [35, 3], [7, 1], [9, 1], [6, 1], [1, 0],
    [1, 0], [7, 1], [18, 2], [24, 3], [18, 2], [9, 1], [24, 3],
    [6, 1], [18, 2], [9, 1], [8, 1], [24, 3], [24, 3], [8, 1],
    [32, 3], [8, 1], [24, 3], [2, 0], [9, 1], [0, 0], [0, 0]
  ];

  const getCircleStyle = (intensity: number) => {
    switch (intensity) {
      case 3: return "bg-purple-600 text-white shadow-lg shadow-purple-200";
      case 2: return "bg-purple-500 text-white";
      case 1: return "bg-purple-200 text-purple-700 font-bold";
      default: return "bg-gray-100 text-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Post Activity</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">From 15 Feb - 15 May, 2024</p>
        </div>
        <button className="text-blue-500 border border-blue-500 rounded-full px-4 py-1.5 text-xs font-bold hover:bg-blue-50 transition-colors">
          Change Period
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 my-8">
        {stats.map((stat, idx) => (
          <div key={idx}>
            <div className="text-3xl font-bold text-gray-900 leading-none mb-1">{stat.value}</div>
            <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-7 text-center">
          {days.map((day, idx) => (
            <span key={idx} className="text-[10px] font-bold text-gray-300 uppercase">{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3">
          {gridData.map((cell, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.01 }}
              className={`aspect-square rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${getCircleStyle(cell[1])}`}
            >
              {cell[0] > 0 ? cell[0] : ""}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostActivity;
