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
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Team Control</h3>
        <button className="rounded-lg p-2 hover:bg-gray-50">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="relative mb-3">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          className="w-full bg-gray-100 rounded-full border border-gray-200  pl-9 pr-3 py-3 mb-3 text-sm 
          placeholder:text-gray-400 focus:outline-none"
          placeholder="Search Team"
        />
      </div>
      <div className="space-y-3">
        {users?.map((user: IUser, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!user?.profile_picture ? (
                <div className="h-9 w-9 rounded-full bg-orange-400 flex items-center justify-center">
                  <span className="text-black font-medium">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <Image
                  src={user.profile_picture}
                  alt={user.full_name}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user?.full_name}
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
