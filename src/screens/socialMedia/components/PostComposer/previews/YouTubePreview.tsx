"use client";
import React from "react";
import { FiMoreVertical, FiPlay, FiVideo } from "react-icons/fi";
import type { UploadedVideo } from "../types";

interface YouTubePreviewProps {
  title?: string;
  description: string;
  video: UploadedVideo | null;
}

export default function YouTubePreview({ title, description, video }: YouTubePreviewProps) {
  const hasVideo = Boolean(video?.preview || video?.url);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden w-full max-w-[420px] mx-auto shadow-lg">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            Y
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Your Channel</p>
            <p className="text-[11px] text-slate-500">Public · Just now</p>
          </div>
        </div>
        <FiMoreVertical className="text-slate-500" />
      </div>

      <div className="p-4">
        <p className="text-sm font-semibold text-slate-900 mb-1">
          {title?.trim() || "Untitled video"}
        </p>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">
          {description?.trim() || "Your video description will appear here..."}
        </p>
      </div>

      <div className="px-4 pb-4">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
          {hasVideo ? (
            <div className="relative aspect-video">
              {video?.preview ? (
                <video src={video.preview} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
                  <FiPlay className="w-6 h-6 text-slate-900 ml-0.5" />
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <FiVideo className="w-10 h-10 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No video selected</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Preview</span>
        <span>Comments off · Likes hidden</span>
      </div>
    </div>
  );
}
