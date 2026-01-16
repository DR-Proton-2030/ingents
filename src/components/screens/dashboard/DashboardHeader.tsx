"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { Lock, Plus } from "lucide-react";
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
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          {/* <p className="text-sm text-gray-500">
          Manage and track your beloved project
        </p> */}
          <div className="mt-1 flex items-center gap-3">

            {/* <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-medium text-white">
            <Lock className="h-3.5 w-3.5" /> Private Access
          </span> */}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center gap-2 rounded-full  
        border-gray-200 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-500 hover:to-orange-500 transition-all duration-300 ease-in-out px-5 py-3 text-sm font-medium text-gray-100 shadow-md shadow-gray-300
         hover:bg-gray-50 active:scale-95" onClick={handleScheduleClick}>
            <Calendar className="h-5 w-5 text-gray-100" /> Schedule Meeting
          </button>
          <button className="inline-flex items-center gap-2 rounded-full  
        border-gray-200 bg-black/80 px-5 py-3 text-sm font-medium text-gray-100 shadow-md shadow-gray-400 hover:bg-black/90 active:scale-95 transition-transform" onClick={handleInviteClick}>
            <Plus className="h-5 w-5 text-gray-300" /> Invite User
          </button>

        </div>
      </header>
      {isInviteModalOpen && (

        <CommonModal isOpen={isInviteModalOpen} onClose={handleCloseModal}>
          <InviteUsersModal onClose={handleCloseModal} />
        </CommonModal>
      )}

      <CreateMeetingDrawer
        isOpen={isScheduleDrawerOpen}
        onClose={handleCloseDrawer}
        onSuccess={() => {
          // You might want to refresh the meeting list here if needed
          console.log("Meeting scheduled successfully");
        }}
      />
    </>
  );
};
