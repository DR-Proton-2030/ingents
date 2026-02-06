"use client";
import React from "react";
import { FiMoreVertical, FiPlay, FiVideo } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import type { UploadedVideo } from "../types";

interface YouTubePreviewProps {
  title?: string;
  description: string;
  video: UploadedVideo | null;
  thumbnailPreview?: string;
}

export default function YouTubePreview({ title, description, video, thumbnailPreview }: YouTubePreviewProps) {
  const hasVideo = Boolean(video?.preview || video?.url);
  const videoSrc = video?.preview || video?.url;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-[420px] mx-auto shadow-xl group transition-all hover:border-red-200">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm border border-red-700/10">
            Y
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate tracking-tight">Your Channel</p>
            <p className="text-[11px] text-slate-500 font-medium">Public · Scheduled for upload</p>
          </div>
        </div>
        <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
          <FiMoreVertical className="text-slate-400" />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight">
          {title?.trim() || "Untitled Video"}
        </h3>
        <p className="text-sm text-slate-600 whitespace-pre-wrap line-clamp-3 leading-relaxed">
          {description?.trim() || "Your video description will appear here. Tell your viewers about your content..."}
        </p>
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner relative group/media">
          {thumbnailPreview ? (
            <div className="relative aspect-video">
              <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10 group-hover/media:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transform transition-transform group-hover/media:scale-110">
                  <FiPlay className="w-8 h-8 text-white ml-1 fill-white" />
                </div>
              </div>
            </div>
          ) : hasVideo ? (
            <div className="relative aspect-video bg-black">
              {videoSrc ? (
                videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be') ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <div className="text-center">
                      <FaYoutube className="w-12 h-12 text-red-600 mx-auto mb-2" />
                      <p className="text-xs text-white px-4">YouTube video link detected</p>
                    </div>
                  </div>
                ) : (
                  <video src={videoSrc} className="w-full h-full object-contain" />
                )
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/media:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-red-600/95 flex items-center justify-center shadow-xl transform transition-transform group-hover/media:scale-110">
                  <FiPlay className="w-8 h-8 text-white ml-1 fill-white" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white font-bold tracking-tight">
                0:42
              </div>
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center text-slate-400 bg-slate-50 border-2 border-dashed border-slate-200 m-1 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
                  <FiVideo className="w-8 h-8 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">No video selected</p>
                  <p className="text-[11px] text-slate-400">Preview will show here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            Preview Mode
          </div>
        </div>
        <span className="text-[10px] font-medium px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">HD 4K</span>
      </div>
    </div>
  );
}
