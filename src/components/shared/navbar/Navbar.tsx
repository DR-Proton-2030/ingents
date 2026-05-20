"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
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
import AuthContext from "@/contexts/authContext/authContext";
import { UniversalSearch } from "./UniversalSearch";
import { ChatRound } from "@solar-icons/react/ssr";
import { Settings } from "@solar-icons/react";

export default function Navbar() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <>
      <nav className="h-20 z-[99] rounded-t-3xl sticky top-0 bg-white/70 backdrop-blur-md flex items-center gap-4 px-4 md:px-8 border-b border-gray-100">
        {/* Left: Avatar + greeting */}

        {/* Assistant label with mic */}
        <div className="hidden md:flex items-center gap-2 pr-4 mr-2 border-r border-gray-100">
          <div className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            {user?.company_details?.logo && (
              <img
                src={user.company_details.logo}
                alt="Company Logo"
                className="h-10 w-auto"
              />
            )}
          </div>
        </div>

        {/* Center: Universal Search */}
        <div className="flex-1 max-w-2xl mx-auto">
          <UniversalSearch />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">

          {/* <div className="relative">
            <button
              className="h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-700" />
            </button>
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </div> */}

          {/* Theme toggle look-alike */}
          <div className="ml-1 flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard/team-chat")}
              className="h-10 w-10 rounded-full bg-blue-500 text-white shadow-sm hover:bg-blue-600 flex items-center justify-center cursor-pointer"
              aria-label="Chat"
            >
              <ChatRound className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push("/dashboard/storage")}
              className="h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
              aria-label="Files"
            >
              <Folder className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => router.push("/dashboard/profile-settings")}
              className="h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center"
              aria-label="Dark mode"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Modal */}
      <MacModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
