import Image from "next/image";
import React from "react";

export const TimeSchedule = () => {
  return (
    <div className="relative group rounded-[20px] bg-slate-900 shadow-xl p-5 overflow-hidden min-h-[280px] flex flex-col">
      <Image
        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop"
        alt="Lora Piterson"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Bottom Blur & Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-white/20 to-transparent z-10" />
      <div className="absolute inset-0 backdrop-blur-[4px] rounded-[20px] [mask-image:linear-gradient(to_top,white_40%,transparent_60%)] z-10" />

      <div className="relative z-20 flex flex-col h-full flex-grow">
        <div className="mb-3 flex items-center justify-between">
          <img
            className="h-10 w-10"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/1245px-Google_Meet_icon_%282020%29.svg.png" alt="" />
          <h3 className="flex items-center gap-1 text-xl font-semibold text-white">
            Schedule
          </h3>
          <button className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-2 py-1 text-xs text-white">
            Jan 2024
          </button>
        </div>

        <div className="mt-auto">
          <div className="text-sm text-gray-200">January</div>
          <div className="mt-1 text-3xl font-bold text-white">72%</div>
          <div className="text-xs text-gray-300">to full schedule</div>

          <div className="flex items-center gap-3 mt-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-3 text-sm text-white">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Meeting with boss
          </div>
        </div>
      </div>
    </div>
  );
};
