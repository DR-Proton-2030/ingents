"use client"

import React, { useEffect, useState } from "react";
import CommonModal from "@/components/shared/commonModal/CommonModal";
import { markAttendance, checkAttendance } from "@/utils/api/user/user.api";

const AttendancePromptModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initCheck = async () => {
      try {
        const response = await checkAttendance();
        if (response && !response.hasAttended) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to check attendance state", error);
      }
    };
    initCheck();
  }, []);

  const handleLogin = async () => {
    try {
      await markAttendance();
      // Need to inform the user or refresh stats if they are actively looking at the attendance matrix!
      // But page load handles most state updates
    } catch (error) {
      console.error("Failed to mark attendance", error);
    } finally {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    // Optionally: do not save today's date if you want them to be prompted again upon reload,
    // or maybe save a 'skipped' status if they shouldn't be bothered again.
  };

  return (
    <CommonModal isOpen={isOpen} onClose={handleCancel} maxWidth={400}>
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-[#1d76ea]/10 rounded-full flex items-center justify-center mb-5">
          <svg
            className="w-8 h-8 text-[#1d76ea]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
          Daily Attendance
        </h2>
        <p className="text-zinc-500 mb-8">
          Are you trying to login to the work for today?
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1d76ea] text-white font-medium hover:bg-[#0b5cd5] transition-colors shadow-lg shadow-blue-500/20"
          >
            Yes, login
          </button>
        </div>
      </div>
    </CommonModal>
  );
};

export default AttendancePromptModal;
