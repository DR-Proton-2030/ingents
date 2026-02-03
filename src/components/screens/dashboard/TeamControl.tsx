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
} from "lucide-react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import TeamMembersTable from "@/components/screens/dashboard/TeamMembersTable";
import { useRouter, useParams } from "next/navigation";

export const TeamControl = () => {
  const { users } = useGetUsers();
  const router = useRouter();
  const params = useParams();
  const site = params?.site as string;
  const safeUsers = Array.isArray(users) ? users : [];
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpenChat = (user: IUser) => {
    router.push(`/${site}/team-chat?userId=${user.id}`);
  };

  // Map users for the TeamMembersTable
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
      <div className="rounded-[22px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-3">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Team Control</h3>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-gray-50 text-gray-400 transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            <MoreHorizontal className="h-6 w-6" />
          </button>
        </div>

        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 font-bold" />
          <input
            className="w-full bg-[#f8f9fb] rounded-2xl border border-gray-100 pl-11 pr-4 py-3.5 text-sm font-medium
          placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/5 transition-all"
            placeholder="Search Team"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredUsers.map((user: IUser, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className="relative">
                  {user?.profile_picture ? (
                    <Image
                      src={user.profile_picture}
                      alt={user.full_name}
                      width={48}
                      height={48}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 shadow-md flex items-center
                   justify-center text-base font-bold text-white uppercase">
                      {user?.full_name ? user.full_name.charAt(0) : (user?.email ? user.email.charAt(0) : "U")}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-gray-900 leading-tight">
                    {user?.full_name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenChat(user)}
                  className="h-7 w-7 rounded-md bg-[#eef2ff] flex items-center justify-center hover:bg-[#e0e7ff] transition-all active:scale-90"
                >
                  <MessageSquare className="h-4 w-4 text-[#3b82f6]" strokeWidth={2.5} />
                </button>
                <button className="h-7 w-7 rounded-md bg-[#ecfdf5] flex items-center justify-center hover:bg-[#d1fae5] transition-all active:scale-90">
                  <Video className="h-4 w-4 text-[#10b981]" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Team Members Drawer - Slides from right */}
      {createPortal(
        <div
          className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${modalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setModalOpen(false)}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Drawer Panel */}
          <div
            className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${modalOpen ? "translate-x-0" : "translate-x-full"
              }`}
            onClick={(e) => e.stopPropagation()}
          >


            {/* Drawer Content */}
            <div className="h-full overflow-auto">
              <TeamMembersTable
                data={mappedUsers}
                onClose={() => setModalOpen(false)}
              />
            </div>
          </div>
        </div>,
        typeof window !== "undefined" ? document.body : ({} as HTMLElement)
      )}
    </>
  );
};
