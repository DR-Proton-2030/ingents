"use client";
import React from "react";
import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, LucideIcon } from "lucide-react";
import Link from "next/link";
import DateRangeFilter from "@/components/shared/DateRangeFilter";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface YouTubeNavigationProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  handleDisconnect: () => void;
}

const YouTubeNavigation: React.FC<YouTubeNavigationProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  dateRange,
  setDateRange,
  handleDisconnect,
}) => {
  return (
    <div className="mt-12 flex flex-col xl:flex-row items-center justify-between gap-6 p-2 bg-white/60 backdrop-blur-md rounded-[32px] border border-white/50 shadow-sm">
      <div className="flex items-center gap-1 w-full xl:w-auto overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3.5 rounded-3xl cursor-pointer text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap relative group ${
              activeTab === tab.id
                ? "text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl shadow-[0_10px_28px_-12px_rgba(249,115,22,0.65)]"
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6,
                }}
              />
            )}
            <tab.icon
              className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}
            />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 w-full xl:w-auto justify-between md:justify-end">
        <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-xs">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <button
              onClick={handleDisconnect}
              className="w-11 h-11 bg-red-400 cursor-pointer text-white hover:text-black rounded-2xl flex items-center justify-center transition-all border border-slate-100 shadow-sm active:scale-95"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-2xl z-[100]">
              Disconnect Account
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
            </div>
          </div>
          <Link
            href="/site/social-media"
            className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-2xl text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back Center
          </Link>
        </div>
      </div>
    </div>
  );
};

export default YouTubeNavigation;
