"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  MoreHorizontal,
  Search as SearchIcon,
  MessageSquare,
  Video,
  X,
  Zap,
} from "lucide-react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import TeamMembersTable from "@/components/screens/dashboard/TeamMembersTable";

export const TeamControl = () => {
  const { users } = useGetUsers();
  const safeUsers = Array.isArray(users) ? users : [];
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const mappedUsers = safeUsers.map((user: any, index: number) => ({
    _id: user._id,
    full_name: user.full_name,
    email: user.email || "no-email@example.com",
    role: user.role || "employee",
    has_joined: user.has_joined ?? false,
    profile_picture: user.profile_picture,
    events_count: user.events_count ?? 0,
  }));

  const filteredUsers = safeUsers.filter((user) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      (user?.full_name || "").toLowerCase().includes(term) ||
      (user?.email || "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="relative group overflow-hidden rounded-[24px] bg-[#0b0118]/80 backdrop-blur-[12px] border border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.1)] p-5 transition-all duration-500 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]">
        {/* Cyberpunk Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

        {/* Glow corner */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-magenta-500/10 blur-[40px] rounded-full"></div>

        <div className="mb-5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <h3 className="text-lg font-bold tracking-tight text-white uppercase italic">
              <span className="text-cyan-400">Cyber</span> Team
            </h3>
          </div>

          <div className="relative">
            <button
              type="button"
              className="rounded-lg p-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              onClick={() => setOpen((v) => !v)}
            >
              <MoreHorizontal className="h-5 w-5 text-cyan-300" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-cyan-500/30 bg-[#150229] shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 p-1 backdrop-blur-xl">
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-medium text-cyan-100 hover:bg-cyan-500/20 rounded-lg transition-all"
                  onClick={() => {
                    setOpen(false);
                    setModalOpen(true);
                  }}
                >
                  <SearchIcon className="w-4 h-4" />
                  View All Personnel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative mb-5 z-10 group/input">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500/50 transition-colors group-focus-within/input:text-cyan-400" />
          <input
            className="w-full bg-black/40 rounded-xl border border-white/5 pl-11 pr-4 py-3.5 text-sm text-cyan-100
            placeholder:text-cyan-900 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all shadow-inner"
            placeholder="Search Network..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-cyan-500/50 transition-all duration-300 group-focus-within/input:w-full"></div>
        </div>

        <div className="space-y-4 relative z-10 max-h-[380px] pr-2 overflow-y-auto custom-cyber-scrollbar">
          {filteredUsers.length > 0 ? filteredUsers.map((user: IUser, i) => (
            <div key={i} className="group/item flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-cyan-500/5 hover:border-cyan-500/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-[8px] rounded-full scale-0 group-hover/item:scale-110 transition-transform duration-300"></div>
                  {user?.profile_picture ? (
                    <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-cyan-500 to-magenta-500">
                      <Image
                        src={user.profile_picture}
                        alt={user.full_name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover bg-[#0b0118]"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ff00ff]/20 to-[#00ffff]/20 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,255,255,0.2)] flex items-center
                    justify-center text-sm font-bold text-cyan-400">
                      {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "?")}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#0b0118] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-100 truncate group-hover/item:text-cyan-300 transition-colors">
                    {user?.full_name}
                  </div>
                  <div className="text-[10px] uppercase tracking-tighter text-cyan-500/60 font-mono flex items-center gap-1">
                    <span className="w-1 h-1 bg-cyan-500/40 rounded-full"></span>
                    {user?.role || "Agent"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center h-9 w-9 rounded-lg bg-black/40 border border-white/5 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="flex items-center justify-center h-9 w-9 rounded-lg bg-black/40 border border-white/5 text-gray-400 hover:text-magenta-400 hover:border-magenta-500/30 hover:bg-magenta-500/10 hover:shadow-[0_0_10px_rgba(255,0,255,0.2)] transition-all">
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-10">
              <p className="text-sm text-cyan-900 italic">No signals found in current sector...</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Members Drawer - Slides from right */}
      {createPortal(
        <div
          className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${modalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setModalOpen(false)}
        >
          {/* Backdrop with extreme blur and dark tint */}
          <div className="absolute inset-0 bg-[#050110]/80 backdrop-blur-md" />

          {/* Drawer Panel */}
          <div
            className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-[#0b0118] border-l border-cyan-500/20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${modalOpen ? "translate-x-0" : "translate-x-full"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header Decorative */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-cyan-500 bg-[length:200%_100%] animate-cyber-gradient"></div>

            {/* Drawer Content */}
            <div className="h-full overflow-auto cyber-panel-container">
              <TeamMembersTable
                data={mappedUsers}
                onClose={() => setModalOpen(false)}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx global>{`
        .custom-cyber-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-cyber-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-cyber-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2);
          border-radius: 10px;
        }
        .custom-cyber-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
        @keyframes cyber-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-cyber-gradient {
          animation: cyber-gradient 3s linear infinite;
        }
      `}</style>
    </>
  );
};
