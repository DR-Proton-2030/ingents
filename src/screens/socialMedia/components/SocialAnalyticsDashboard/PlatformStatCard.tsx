"use client";
import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Link2, Settings, Unplug } from "lucide-react";

export interface PlatformStatCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  followers: string;
  views?: string;
  color: string;
  bgColor: string;
  connected: boolean;
  index?: number;
  onConnect?: () => void;
  onManage?: () => void;
  onDisconnect?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const platformThemes: Record<
  string,
  {
    gradient: string;
    iconBg: string;
    accent: string;
    ring: string;
    connectBtn: string;
    badge: string;
  }
> = {
  instagram: {
    gradient: "from-purple-500/5 via-pink-500/5 to-orange-400/5",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    accent: "text-pink-500",
    ring: "ring-pink-500/20",
    connectBtn:
      "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-pink-500/25",
    badge: "bg-pink-50 text-pink-600",
  },
  facebook: {
    gradient: "from-blue-500/5 to-blue-600/5",
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    accent: "text-blue-600",
    ring: "ring-blue-500/20",
    connectBtn: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25",
    badge: "bg-blue-50 text-blue-600",
  },
  youtube: {
    gradient: "from-red-500/5 to-red-600/5",
    iconBg: "bg-gradient-to-br from-red-500 to-red-600",
    accent: "text-red-500",
    ring: "ring-red-500/20",
    connectBtn: "bg-red-500 hover:bg-red-600 shadow-red-500/25",
    badge: "bg-red-50 text-red-600",
  },
  x: {
    gradient: "from-gray-800/5 to-gray-900/5",
    iconBg: "bg-gradient-to-br from-gray-800 to-gray-900",
    accent: "text-gray-900",
    ring: "ring-gray-500/20",
    connectBtn: "bg-gray-800 hover:bg-gray-900 shadow-gray-800/25",
    badge: "bg-gray-100 text-gray-700",
  },
};

const defaultTheme = {
  gradient: "from-slate-500/5 to-slate-600/5",
  iconBg: "bg-gradient-to-br from-slate-500 to-slate-600",
  accent: "text-slate-600",
  ring: "ring-slate-500/20",
  connectBtn: "bg-slate-600 hover:bg-slate-700 shadow-slate-500/25",
  badge: "bg-slate-100 text-slate-600",
};

export default function PlatformStatCard({
  id,
  name,
  icon,
  followers,
  views,
  color,
  bgColor,
  connected,
  index = 0,
  onConnect,
  onManage,
  onDisconnect,
  onRefresh,
  refreshing = false,
}: PlatformStatCardProps) {
  const theme = platformThemes[id] ?? defaultTheme;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className={`relative rounded-2xl bg-white border border-slate-200/60 hover:border-slate-200 transition-all duration-300 group overflow-hidden hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]`}
    >
      
     

      <div className="relative p-5">
        {/* Header: icon + name + status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl ${theme.iconBg} flex-shrink-0 flex items-center justify-center text-white shadow-sm`}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800 truncate">{name}</h3>
              
            </div>
          </div>

          
        </div>

        {/* Stats */}
        <div className="mb-4">
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {followers}
            </span>
            <span
              className={`text-xs font-semibold pb-1 text-gray-500`}
            >
              {id === "youtube" ? "Subscribers" : "Followers"}
            </span>
          </div>
         
        </div>

        {/* Actions */}
        {connected ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onManage?.();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60 transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-black" />
            </button>
            {connected && onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!refreshing) onRefresh();
              }}
              disabled={refreshing}
                 className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60 transition-all"
          
              title={refreshing ? "Refreshing..." : "Refresh stats"}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  refreshing
                    ? "animate-spin text-blue-500"
                    : "text-black -600"
                }`}
              />
            </button>
          )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDisconnect?.();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold text-red-500 bg-red-50/50 hover:bg-red-50 border border-red-100 transition-all"
            >
              <Unplug className="w-3 h-3" />
            </button>
            
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect?.();
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-black shaow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
               bg-gray-100 `}
          >
            <Link2 className="w-4 h-4" />
            Connect
          </button>
        )}
      </div>
    </motion.div>
  );
}
