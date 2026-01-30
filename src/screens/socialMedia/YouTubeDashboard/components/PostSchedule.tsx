"use client";
import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const PostSchedule = () => {
  const schedule = [
    {
      time: "09:15",
      title: "Sometimes we forgot about the most important things in...",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
      color: "bg-purple-100 border-purple-200",
      textColor: "text-purple-900",
      timeBg: "bg-purple-600"
    },
    {
      time: "12:30",
      title: "Quick reminder to having proper lunch and you can back to...",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop",
      color: "bg-pink-50 border-pink-100",
      textColor: "text-pink-900",
      timeBg: "bg-pink-600"
    }
  ];

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Post Schedule</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">25 posts scheduled</p>
        </div>
        <button className="text-blue-500 border border-blue-500 rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1 hover:bg-blue-50 transition-colors">
          <Plus className="w-3 h-3 child-stroke-3" /> Add Post
        </button>
      </div>

      <div className="mt-8 relative">
        {/* Hour lines */}
        <div className="space-y-12">
          {hours.map((hour) => (
            <div key={hour} className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-400 w-10">{hour}</span>
              <div className="flex-1 border-t border-dotted border-gray-200" />
            </div>
          ))}
        </div>

        {/* Schedule Cards */}
        <div className="absolute top-2 left-14 right-0 space-y-4">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative top-[22px] bg-purple-100/50 border border-purple-200 rounded-2xl p-3 flex gap-3 shadow-sm"
          >
             <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-2xl" />
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <span className="bg-purple-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold">09:15</span>
               </div>
               <p className="text-[10px] font-bold text-purple-900 leading-relaxed max-w-[140px]">
                 Sometimes we forgot about the most important things in...
               </p>
             </div>
             <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop" className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative top-[95px] bg-pink-100/50 border border-pink-200 rounded-2xl p-3 flex gap-3 shadow-sm"
          >
             <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 rounded-l-2xl" />
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <span className="bg-pink-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold">12:30</span>
               </div>
               <p className="text-[10px] font-bold text-pink-900 leading-relaxed max-w-[140px]">
                 Quick reminder to having proper lunch and you can back to...
               </p>
             </div>
             <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop" className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PostSchedule;
