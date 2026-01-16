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

export const TeamControl = () => {
  const { users } = useGetUsers();
  const safeUsers = Array.isArray(users) ? users : [];
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

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
      <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-4 overflow-x-auto">
        <div className="mb-3 flex items-center justify-between relative">
          <h3 className="text-base font-semibold text-gray-900">Team Control</h3>
          <div className="relative">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-gray-50"
              onClick={() => setOpen((v) => !v)}
            >
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setOpen(false);
                    setModalOpen(true);
                  }}
                >
                  View all
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="relative mb-3">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="w-full bg-gray-100 rounded-full border border-gray-200  pl-9 pr-3 py-3  text-sm 
          placeholder:text-gray-400 focus:outline-none"
            placeholder="Search Team"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          {filteredUsers.map((user: IUser, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user?.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt={user.full_name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg flex items-center
                 justify-center text-sm font-semibold text-orange-100">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U")}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user?.full_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {/* {m.tasks} Task handled */}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <button className="rounded-lg p-2 bg-blue-500/20 hover:bg-blue-500/30">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </button>
                <button className="rounded-lg p-2 bg-green-500/20 hover:bg-green-500/30">
                  <Video className="h-4 w-4 text-green-500" />
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
        document.body
      )}
    </>
  );
};
