"use client";
import React from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function Profile() {
  return (
    <Link
      href={""}
      className="flex items-center justify-between px-4 py-4 mt-5 rounded-2xl text-sm bg-gradient-to-r from-white/60 via-white/40 to-white/60 text-gray-800 backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src="https://t3.ftcdn.net/jpg/01/73/77/00/360_F_173770068_LRQyNUZQn9WtQyJoJsOEwK8qwBzypBm0.jpg"
            alt="Profile"
            className="rounded-full object-cover h-10 w-10 border-2 border-white/50"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
        </div>
        <span className="font-semibold text-gray-800">Tuhin Thakur</span>
      </div>

      <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all">
        <Settings className="w-4 h-4 text-gray-600 hover:text-purple-600 transition-colors" />
      </div>
    </Link>
  );
}
