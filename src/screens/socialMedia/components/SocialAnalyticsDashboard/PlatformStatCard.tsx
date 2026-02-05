"use client";
import React from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export interface PlatformStatCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  followers: string;
  color: string;
  bgColor: string;
  connected: boolean;
  index?: number;
  onConnect?: () => void;
  onManage?: () => void;
  onRefresh?: () => void;
}

export default function PlatformStatCard({
  id,
  name,
  icon,
  followers,
  color,
  bgColor,
  connected,
  index = 0,
  onConnect,
  onManage,
  onRefresh,
}: PlatformStatCardProps) {
  const getConnectButtonStyles = () => {
    switch (id) {
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600";
      case "facebook":
        return "bg-blue-600 hover:bg-blue-700";
      case "youtube":
        return "bg-red-500 hover:bg-red-600";
      case "x":
        return "bg-gray-800 hover:bg-gray-900";
      default:
        return "bg-slate-600 hover:bg-slate-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative p-5 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div
        className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={color}>{icon}</div>
          {connected && onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors group/refresh"
              title="Refresh stats"
            >
              <RefreshCw className="w-4 h-4 text-slate-400 group-hover/refresh:text-slate-600 group-hover/refresh:rotate-180 transition-all duration-300" />
            </button>
          )}
        </div>
        <div className="text-3xl font-bold text-slate-800 mb-1">{followers}</div>
        <div className="text-sm text-slate-500">Followers</div>

        {/* Connect or Manage button */}
        {connected ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onManage?.();
            }}
            className="mt-3 w-full py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Manage
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect?.();
            }}
            className={`mt-3 w-full py-2 rounded-lg text-sm font-medium text-white transition-colors ${getConnectButtonStyles()}`}
          >
            Connect
          </button>
        )}
      </div>
    </motion.div>
  );
}
