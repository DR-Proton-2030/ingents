"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { Lock, Plus, Video } from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";
import CommonModal from "@/components/shared/commonModal/CommonModal";
import InviteUsersModal from "@/components/shared/inviteUsersModal/InviteUsersModal";
import { Calendar } from "@solar-icons/react";
import CreateMeetingDrawer from "./CreateMeetingDrawer";

export const DashboardHeader = () => {
  const { user } = useContext(AuthContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = React.useState(false);

  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };

  const handleScheduleClick = () => {
    setIsScheduleDrawerOpen(true);
  };

  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
  }

  const handleCloseDrawer = () => {
    setIsScheduleDrawerOpen(false);
  }

  return (
    <>

      <div className="flex items-center gap-4">
        <button
          onClick={handleScheduleClick}
          className="mt-4 w-full rounded-2xl bg-[#f0f1f3] py-2.5 cursor-pointer px-5 text-slate-900 text-sm leading-none font-medium flex items-center justify-center gap-2 hover:bg-[#e8eaee] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="p-1 rounded-md bg-green-500 text-white">

            <Video className="h-5 w-5 text-white/70 " />
          </div>
          Schedule Meeting
        </button>
        {/* <button className="inline-flex items-center gap-2 rounded-full  
        border-gray-200 bg-black/80 px-5 py-3 text-sm font-medium text-gray-100 shadow-md shadow-gray-400 hover:bg-black/90 active:scale-95 transition-transform" onClick={handleInviteClick}>
            <Plus className="h-5 w-5 text-gray-300" /> Invite User
          </button> */}

      </div>
      <InviteUsersModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseModal}
      />

      <CreateMeetingDrawer
        isOpen={isScheduleDrawerOpen}
        onClose={handleCloseDrawer}
        onSuccess={() => {
          console.log("Meeting scheduled successfully");
        }}
      />
    </>
  );
};
