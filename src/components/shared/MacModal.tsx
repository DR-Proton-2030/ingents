"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
// removed unused imports

interface MacModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MacModal({ isOpen, onClose }: MacModalProps) {
  // const aiAgents = [ ... ];
  // kept for future use — commented out to avoid unused variable lint

  // ensure portal only renders on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur"
            onClick={onClose}
          />

          {/* Modal - Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 400,
              duration: 0.3,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex items-center justify-center flex-col space-y-4"
                >
                  <video
                    autoPlay={true}
                    loop={true}
                    muted={true}
                    className="h-96"
                    src="https://cdn.dribbble.com/userupload/4092388/file/original-f3ba952f70b42737e63565e8ca9c28f3.mp4"
                  ></video>
                  {/* Voice recording UI: animated bars + status */}
                  <div className="-mt-16 flex flex-col items-center">
                    <div className="bg-black/80 text-white text-xs rounded-full px-3 py-1 mb-2">
                      Listening...
                    </div>

                    <div className="w-56 h-12 bg rounded-2xl flex items-center justify-center px-4">
                      <div className="flex items-end space-x-1 h-8">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="bg-black/90 rounded-sm w-1"
                            animate={{
                              height: [4 + (i % 6), 18 - (i % 6), 4 + (i % 6)],
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.9,
                              delay: i * 0.03,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100/50 bg-gray-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Versacc AI
                      </p>
                      <p className="text-xs text-gray-500">
                        8 agents available
                      </p>
                    </div>
                  </div>
                  <button className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                    View All →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
