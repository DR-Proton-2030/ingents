"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search as SearchIcon,
  Mic,
  Folder,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import MacModal from "../MacModal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="h-16  sticky top-0 bg-white flex items-center gap-4 px-4 md:px-6 border-b border-gray-100">
        {/* Left: Avatar + greeting */}

        {/* Assistant label with mic */}
        <div className="hidden md:flex items-center gap-2 pr-2 mr-2 border-r border-gray-200">
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative h-12 w-12 rounded-full flex items-center justify-center 
             bg-gradient-to-br from-purple-500/70 via-indigo-500/60 to-blue-500/70 
           
             backdrop-blur-xl border border-white/20 
             hover:scale-105 transition-transform duration-300"
            aria-label="Open Assistant"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent blur-xl animate-pulse" />
            <Mic className="relative h-6 w-6 text-white drop-shadow-lg" />
          </button>

          <span className="text-sm font-medium text-gray-700 mr-5">
            Virtual Assistant
          </span>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-end">
          <div className="relative w-full max-w-xl">
            <input
              className="w-full rounded-full border border-gray-200
               bg-white/80 pl-11 pr-4 py-2.5 text-sm placeholder:text-gray-400  focus:outline-none focus:ring-2 
               focus:ring-blue-100 focus:border-blue-300"
              placeholder="Search"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            className="h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
            aria-label="Files"
          >
            <Folder className="h-5 w-5 text-gray-700" />
          </button>
          <div className="relative">
            <button
              className="h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-700" />
            </button>
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </div>

          {/* Theme toggle look-alike */}
          <div className="ml-1 flex items-center gap-2">
            <button
              className="h-10 w-10 rounded-full bg-blue-500 text-white shadow-sm hover:bg-blue-600 flex items-center justify-center"
              aria-label="Light mode"
            >
              <Sun className="h-5 w-5" />
            </button>
            <button
              className="h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center"
              aria-label="Dark mode"
            >
              <Moon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Modal */}
      <MacModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
