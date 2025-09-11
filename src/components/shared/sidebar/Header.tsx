"use client";
import React from "react";

export default function SidebarHeader() {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <div>
          <h1 className="text-gray-800 font-semibold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            VERSACC
          </h1>
          <p className="text-gray-500 text-xs">App Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
