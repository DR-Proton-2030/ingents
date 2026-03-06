"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Image as ImageIcon,
  PlayCircle,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  Eye,
  Clock,
  MousePointer2,
  Repeat2,
  Bookmark,
  MessageCircle,
  Heart,
  Share2,
} from "lucide-react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";

interface InstagramPostModalProps {
  selectedPost: any;
  onClose: () => void;
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function isVideoType(mediaType?: string) {
  const t = (mediaType || "").toUpperCase();
  return t === "VIDEO" || t === "REEL" || t === "REELS";
}

function isVideoUrl(url?: string) {
  if (!url) return false;
  return url.includes(".mp4");
}

function getInsightValue(insights: any[], name: string) {
  if (!insights || !Array.isArray(insights)) return 0;
  const item = insights.find((i: any) => i.name === name);
  return item?.values?.[0]?.value || 0;
}

export default function InstagramPostModal({
  selectedPost,
  onClose,
}: InstagramPostModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset index when a new post is selected
  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [selectedPost]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (selectedPost) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedPost, onClose]);

  if (!isMounted || typeof document === "undefined" || !selectedPost) {
    return null;
  }

  const modalMediaUrls =
    selectedPost.media_urls?.length > 0
      ? selectedPost.media_urls
      : [selectedPost.media_url || selectedPost.mediaUrl].filter(Boolean);

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMediaIndex < modalMediaUrls.length - 1) {
      setCurrentMediaIndex((prev) => prev + 1);
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((prev) => prev - 1);
    }
  };

  const modalContent = (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-12"
        style={{ position: "fixed" }}
      >
        {/* Backdrop - Decreased opacity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-black rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh] md:max-h-[800px] border border-white/10"
        >
          {/* Close Button - Desktop */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2.5 bg-black/50 hover:bg-black/80 text-white cursor-pointer rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Section */}
          <div className="relative flex-1 bg-black flex items-center justify-center group/slider min-h-[40vh] md:min-h-0 border-b md:border-b-0 border-white/10">
            {modalMediaUrls.length > 0 ? (
              <>
                {isVideoType(selectedPost.media_type) ||
                isVideoUrl(modalMediaUrls[currentMediaIndex]) ? (
                  <video
                    src={modalMediaUrls[currentMediaIndex]}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={modalMediaUrls[currentMediaIndex]}
                    className="w-full h-full object-contain"
                    alt={`Media ${currentMediaIndex + 1}`}
                  />
                )}

                {/* Slider Controls */}
                {modalMediaUrls.length > 1 && (
                  <>
                    {currentMediaIndex > 0 && (
                      <button
                        onClick={handlePrevMedia}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition-all opacity-0 group-hover/slider:opacity-100 transform translate-x-4 group-hover/slider:translate-x-0 border border-white/10 shadow-xl"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    )}
                    {currentMediaIndex < modalMediaUrls.length - 1 && (
                      <button
                        onClick={handleNextMedia}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition-all opacity-0 group-hover/slider:opacity-100 transform -translate-x-4 group-hover/slider:translate-x-0 border border-white/10 shadow-xl"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    )}

                    {/* Dots indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                      {modalMediaUrls.map((_: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentMediaIndex(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentMediaIndex ? "w-5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-white/50 flex flex-col items-center">
                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                <p>No media available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-[380px] lg:w-[420px] bg-white flex flex-col max-h-[50vh] md:max-h-full">
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between bg-white border-b border-gray-100/80 shadow-sm z-10 shrink-0 pr-16 md:pr-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-pink-50 text-pink-700 uppercase tracking-widest border border-pink-100">
                  {(selectedPost.media_type || "POST")
                    .toString()
                    .replaceAll("_", " ")}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-400 tracking-wide uppercase mx-12">
                {formatDate(selectedPost.timestamp)}
              </div>
            </div>

            {/* Caption & Overview (Scrollable) */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 relative">
              <div className="p-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-3">
                  Caption
                </h4>
                {selectedPost.caption ? (
                  <p className="text-[14px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedPost.caption}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic font-medium">
                    No caption provided.
                  </p>
                )}
              </div>

              {/* Performance Metrics Section */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4">
                  Performance Overview
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-hover hover:border-indigo-100 hover:bg-indigo-50/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                        Views
                      </span>
                    </div>
                    <div className="text-xl font-black text-gray-900">
                      {formatCompactNumber(selectedPost.overview?.views || 0)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-hover hover:border-blue-100 hover:bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                        Reach
                      </span>
                    </div>
                    <div className="text-xl font-black text-gray-900">
                      {formatCompactNumber(
                        selectedPost.overview?.accounts_reached || 0,
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-hover hover:border-purple-100 hover:bg-purple-50/30">
                    <div className="flex items-center gap-2 mb-1">
                      <MousePointer2 className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                        Interactions
                      </span>
                    </div>
                    <div className="text-xl font-black text-gray-900">
                      {formatCompactNumber(
                        selectedPost.overview?.interactions || 0,
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-hover hover:border-pink-100 hover:bg-pink-50/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5 text-pink-500" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                        Avg. Watch Time
                      </span>
                    </div>
                    <div className="text-xl font-black text-gray-900">
                      {selectedPost.overview?.average_watch_time
                        ? `${selectedPost.overview.average_watch_time}s`
                        : "—"}
                    </div>
                  </div>
                </div>

                {selectedPost.overview?.watch_time_total && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600">
                        Total Watch Time
                      </span>
                    </div>
                    <span className="text-sm font-black text-gray-900">
                      {(selectedPost.overview.watch_time_total / 3600).toFixed(
                        2,
                      )}
                      h
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="p-6 bg-white shrink-0 border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-4 gap-2 mb-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Likes
                    </span>
                  </div>
                  <span className="text-lg font-black text-gray-900 tracking-tight">
                    {formatCompactNumber(selectedPost.like_count || 0)}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageCircle className="w-3 h-3 text-blue-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Comments
                    </span>
                  </div>
                  <span className="text-lg font-black text-gray-900 tracking-tight">
                    {formatCompactNumber(selectedPost.comments_count || 0)}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Share2 className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Shares
                    </span>
                  </div>
                  <span className="text-lg font-black text-gray-900 tracking-tight">
                    {formatCompactNumber(
                      selectedPost.shares_count ??
                        getInsightValue(selectedPost.insights, "shares"),
                    )}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Bookmark className="w-3 h-3 text-purple-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Saved
                    </span>
                  </div>
                  <span className="text-lg font-black text-gray-900 tracking-tight">
                    {formatCompactNumber(
                      selectedPost.save_count ??
                        getInsightValue(selectedPost.insights, "saved"),
                    )}
                  </span>
                </div>

                {selectedPost.reposts_count !== undefined && (
                  <div className="flex flex-col items-center col-span-4 mt-2 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Repeat2 className="w-3 h-3 text-gray-400" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Reposts
                      </span>
                      <span className="text-sm font-black text-gray-900 ml-2">
                        {formatCompactNumber(selectedPost.reposts_count)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedPost.permalink && (
                <button
                  onClick={() => window.open(selectedPost.permalink, "_blank")}
                  className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:shadow-[0_8px_25px_-8px_rgba(219,39,119,0.5)] transform active:scale-[0.98] transition-all"
                >
                  View on Instagram
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
