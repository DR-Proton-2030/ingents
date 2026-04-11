import React from "react";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiSend, FiClock } from "react-icons/fi";
import { platformIcons } from "@/screens/socialMedia/components/PostComposer/types";

interface CreatePostHeaderProps {
  basePath: string;
  connectedPlatforms: string[];
  selectedPlatforms: string[];
  togglePlatformFromHeader: (platform: string) => void;
  handlePost: () => void;
  isPosting: boolean;
  postContent: string;
  images: any[];
  video: any | null;
  showScheduler: boolean;
}

export const CreatePostHeader: React.FC<CreatePostHeaderProps> = ({
  basePath,
  connectedPlatforms,
  selectedPlatforms,
  togglePlatformFromHeader,
  handlePost,
  isPosting,
  postContent,
  images,
  video,
  showScheduler,
}) => {
  const isPublishDisabled =
    isPosting ||
    (!postContent.trim() && images.length === 0 && !video) ||
    selectedPlatforms.length === 0;

  return (
    <div className="flex items-center justify-between mb-6 pt-5">
      <div className="flex items-center gap-4">
        <Link
          href={basePath}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm hover:shadow"
        >
          <FiArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Create Post</h1>
          <p className="text-sm text-slate-500">
            Compose and preview your content before publishing
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {connectedPlatforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform);
            const config = platformIcons[platform];
            return (
              <button
                key={platform}
                onClick={() => togglePlatformFromHeader(platform)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  isSelected
                    ? `${config.bgColor} text-white shadow-sm`
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
                title={`Select ${config.name}`}
              >
                {config.icon}
                <span className="hidden lg:inline">{config.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handlePost}
          disabled={isPublishDisabled}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
            isPublishDisabled
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
          }`}
        >
          {isPosting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publishing...
            </>
          ) : showScheduler ? (
            <>
              <FiCalendar className="w-4 h-4" />
              Schedule
            </>
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              Publish
            </>
          )}
        </button>
      </div>
    </div>
  );
};
