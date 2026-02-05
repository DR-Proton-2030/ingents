"use client";
import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface PostScheduleProps {
  schedule?: any[];
}

const PostSchedule = ({ schedule }: PostScheduleProps) => {
  const defaultSchedule = [
    {
      time: "09:15",
      title: "Sometimes we forgot about the most important things in...",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop",
      color: "bg-purple-100/50 border-purple-200",
      textColor: "text-purple-900",
      timeBg: "bg-purple-600",
      accent: "bg-purple-500",
      top: "10px"
    },
    {
      time: "12:30",
      title: "Quick reminder to having proper lunch and you can back to...",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop",
      color: "bg-pink-100/50 border-pink-200",
      textColor: "text-pink-900",
      timeBg: "bg-pink-600",
      accent: "bg-pink-500",
      top: "240px"
    }
  ];

  const displaySchedule = (schedule && schedule.length > 0) ? schedule.map((item, idx) => {
    console.log("Mapping item:", item);
    let displayTime = item.time;
    let topPosition = item.top;

    if (item.scheduledAt && !displayTime) {
      const date = new Date(item.scheduledAt);
      if (!isNaN(date.getTime())) {
        displayTime = date.getHours().toString().padStart(2, '0') + ':' + 
                      date.getMinutes().toString().padStart(2, '0');
        
        const h = date.getHours();
        const m = date.getMinutes();
        const baseHour = 9;
        
        const hourDiff = h - baseHour;
        const minuteOffset = (m / 60) * 68;
        topPosition = `${(hourDiff * 68) + 10 + minuteOffset - 30}px`;
      }
    }

    return {
      ...item,
      time: displayTime || item.time || "00:00",
      image: item.full_picture || item.image || item.thumbnails?.default?.url || item.thumbnails?.medium?.url,
      color: item.color || (idx % 2 === 0 ? "bg-purple-100/50 border-purple-200" : "bg-pink-100/50 border-pink-200"),
      textColor: item.textColor || (idx % 2 === 0 ? "text-purple-900" : "text-pink-900"),
      timeBg: item.timeBg || (idx % 2 === 0 ? "bg-purple-600" : "bg-pink-600"),
      accent: item.accent || (idx % 2 === 0 ? "bg-purple-500" : "bg-pink-500"),
      top: topPosition || (idx === 0 ? "10px" : idx === 1 ? "78px" : `${idx * 120}px`)
    };
  }) : defaultSchedule;

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00","19:00","20:00","21:00","22:00","23:00","24:00"];

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Post Schedule</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">{displaySchedule.length} posts scheduled</p>
        </div>
        <button className="text-blue-500 border border-blue-500 rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1 hover:bg-blue-50 transition-colors">
          <Plus className="w-3 h-3 child-stroke-3" /> Add Post
        </button>
      </div>

      <div className="mt-8 relative h-[450px] overflow-y-auto custom-scrollbar">
        <div className="relative min-h-[750px] w-full">
          {/* Hour lines */}
          <div className="space-y-12 pb-6">
            {hours.map((hour) => (
              <div key={hour} className="flex items-center gap-4 h-5">
                <span className="text-[10px] font-bold text-gray-400 w-10 text-right">{hour}</span>
                <div className="flex-1 border-t border-dotted border-gray-200" />
              </div>
            ))}
          </div>

          {/* Schedule Cards Area */}
          <div className="absolute top-0 left-16 right-4 bottom-0 pointer-events-none min-h-full">
            {displaySchedule.map((item, idx) => {
              // Ensure we have a valid top position string
              const finalTop = item.top && item.top.endsWith('px') ? item.top : (idx * 100 + 10) + 'px';
              
              return (
                <motion.div 
                  key={idx}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ top: finalTop }}
                  className={`absolute left-0 right-0 pointer-events-auto ${item.color} border rounded-2xl p-3 flex gap-3 shadow-md z-10 min-h-[60px]`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${item.accent} rounded-l-2xl`} />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${item.timeBg} text-[10px] text-white px-2 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap`}>
                        {item.time}
                      </span>
                    </div>
                    <p className={`text-[11px] font-bold ${item.textColor} leading-tight line-clamp-2`}>
                      {item.title}
                    </p>
                  </div>
                  {(item.image || item.full_picture || item.permalink_url) && (
                    <img 
                      src={item.image || item.full_picture || item.permalink_url} 
                      className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100 flex-shrink-0" 
                      alt="" 
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSchedule;
