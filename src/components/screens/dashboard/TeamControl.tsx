"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  MessageCircle,
  Plus,
} from "lucide-react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import TeamMembersTable from "@/components/screens/dashboard/TeamMembersTable";
import { useRouter, useParams } from "next/navigation";
import { AddCircle } from "@solar-icons/react";
import InviteUsersModal from "@/components/shared/inviteUsersModal/InviteUsersModal";

export const TeamControl = () => {
  const { users } = useGetUsers();
  const router = useRouter();
  const params = useParams();
  const site = params?.site as string;
  const safeUsers = Array.isArray(users) ? users : [];
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenChat = (user: IUser) => {
    router.push(`/${site}/team-chat?userId=${user.id}`);
  };

  // Map users for the TeamMembersTable
  const mappedUsers = safeUsers.map((user: any) => ({
    _id: user._id,
    full_name: user.full_name,
    email: user.email || "no-email@example.com",
    role: user.role || "employee",
    has_joined: user.has_joined ?? false,
    profile_picture: user.profile_picture,
    events_count: user.events_count ?? 0,
  }));

  const visibleUsers = safeUsers.slice(0, 5);

  const joinedCount = safeUsers.filter((u: any) => u.has_joined).length;


  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  }
  return (
    <>
      <div className="rounded-[32px] ">
        <div className="relative rounded-[30px] bg-transparent pt-6">
          <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-8 w-[78%] -translate-x-1/2 rounded-[24px] bg-gray-200 shadow-[0_1px_0_rgba(0,0,0,0.12)]" />
          <div className="pointer-events-none absolute left-1/2 top-2 z-0 h-8 w-[88%] -translate-x-1/2 rounded-[24px] bg-gray-300 shadow-[0_2px_0_rgba(0,0,0,0.2)]" />

          <div className="relative z-10 h-72 overflow-y-auto hidescroll rounded-[26px] border border-[#5b5b5b] bg-[#2b2d31] px-5 pb-5 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-2xl font-  text-white [text-shadow:0_2px_2px_rgba(0,0,0,0.45)]" >
                Team members
              </div>
              <button onClick={handleInviteClick} className="flex items-center gap-1 rounded-full bg-[#4a4d52] px-3 py-1 text-sm font-medium text-white hover:bg-[#5e6167] transition-colors">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {visibleUsers.map((user: IUser, i) => {
                const isJoined = Boolean((user as any)?.has_joined);
                const initial = (
                  user?.full_name?.trim()?.charAt(0) ||
                  user?.email?.trim()?.charAt(0) ||
                  "U"
                ).toUpperCase();

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl py-1.5"
                    onClick={() => handleOpenChat(user)}
                  >
                    <div
                      className={`h-11 w-11 flex-shrink-0 rounded-full border flex items-center justify-center ${isJoined
                        ? "bg-[#4a4d52] border-[#5e6167]"
                        : "bg-[#f3f3f3] border-[#e7e7e7]"
                        }`}
                    >
                      {user?.profile_picture ? (
                        <Image
                          src={user.profile_picture}
                          alt={user.full_name}
                          width={44}
                          height={44}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          className={`text-base font-semibold ${isJoined ? "text-[#ececec]" : "text-[#1f2022]"
                            }`}
                        >
                          {initial}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-[17px] leading-tight ${isJoined ? "text-white/42 font-medium" : "text-white font-semibold"}`}>
                        {user?.full_name || "Unnamed Member"}
                      </p>
                      <p className={`mt-0.5 truncate text-[13px] ${isJoined ? "text-white/35" : "text-white/52"}`}>
                        {(user as any)?.role || "Team Member"}
                      </p>
                    </div>

                    <div className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 rounded-full text-white text-xs font-medium p-2 cursor-pointer">
                      <MessageCircle size={18} className="text-blue-100" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Drawer - Slides from right */}
      {typeof window !== "undefined" && createPortal(
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

      <InviteUsersModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
