"use client"

import React, { useEffect, useState } from "react";
import { markAttendance, checkAttendance } from "@/utils/api/user/user.api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, CheckCircle2 } from "lucide-react";

const AttendancePromptModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      await markAttendance();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to mark attendance", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[440px] bg-white rounded-[12px] shadow-2xl overflow-hidden shadow-black/20"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <X className="w-5 h-5 text-gray-900" strokeWidth={3} />
            </button>

            {/* Top Decoration Section */}
            <div className="relative h-[220px] bg-[#EEF1FF] flex items-center justify-center overflow-hidden">
              {/* Abstract Shapes */}
              {/* Left Squiggle */}
              <svg className="absolute left-10 top-10 w-12 h-16 text-[#A0D468]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M10 2c1 1 2 4 1 6s-2 4-1 6 2 4 1 6" strokeLinecap="round" />
              </svg>
              {/* Blue Blobs */}
              <div className="absolute top-12 right-20 w-4 h-4 rounded-full border-4 border-[#3B5998] opacity-60" />
              <div className="absolute top-1/2 left-20 w-8 h-4 bg-[#DCE2FF] rounded-full" />
              <div className="absolute bottom-10 right-24 w-12 h-3 bg-[#DCE2FF] rounded-full" />

              {/* X decorations */}
              <div className="absolute bottom-16 left-24 text-[#8AD442] font-bold text-xl rotate-45">+</div>

              {/* Wave */}
              <svg className="absolute bottom-12 right-12 w-12 h-4 text-[#3B5998]" viewBox="0 0 48 12" fill="none" stroke="currentColor" strokeWidth={3}>
                <path d="M0 6c6-6 12-6 18 0s12 6 18 0" strokeLinecap="round" />
              </svg>

              {/* Main Illustration: Envelope */}
              <div className="relative z-10 scale-110">
                <div className="w-32 h-20 border-4 border-[#3B4CFF] rounded-xl flex items-center justify-center bg-white shadow-sm relative">
                  {/* Paper sticking out */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-24 bg-white border-4 border-[#3B4CFF]/10 rounded-lg shadow-sm flex items-center justify-center">
                    {/* Paper lines */}
                    <div className="absolute top-4 left-3 right-3 h-1 bg-[#F0F2FF]" />
                    <div className="absolute top-7 left-3 right-3 h-1 bg-[#F0F2FF]" />

                    {/* Green Checkmark */}
                    <div className="w-10 h-10 rounded-full border-2 border-[#8AD442] flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-[#8AD442] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={5}>
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Envelope body flap */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 border-t-2 border-[#3B4CFF]/20 overflow-hidden rounded-xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-t-[40px] border-t-[#3B4CFF]/10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-10 pt-10 text-center bg-white">
              <h2 className="text-[22px] font-semibold text-[#0A053C] mb-2">
                Do You want to Login today?
              </h2>
              <p className="text-[#6B7280] text-[12px] leading-relaxed mb-10 max-w-[300px] mx-auto font-medium">
                Mark your attendance for today and track your productive hours effortlessly.
              </p>

              <div className="flex items-center justify-center gap-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-10 py-3 cursor-pointer rounded-full font-bold text-sm flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5  rounded-full animate-spin" />
                  ) : (
                    "Yes, Please"
                  )}
                </motion.button>

                {/* <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#0A053C] font-bold text-[18px] underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity"
                >
                  Cancel
                </button> */}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AttendancePromptModal;
