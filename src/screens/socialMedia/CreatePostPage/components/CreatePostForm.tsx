import React from "react";
import { FiEdit3, FiImage, FiX, FiClock, FiCalendar, FiSend } from "react-icons/fi";
import Link from "next/link";
import HashtagInput from "@/screens/socialMedia/components/PostComposer/HashtagInput";
import ImageUploader from "@/screens/socialMedia/components/PostComposer/ImageUploader";
import VideoUploader from "@/screens/socialMedia/components/PostComposer/VideoUploader";
import Scheduler from "@/screens/socialMedia/components/PostComposer/Scheduler";

interface CreatePostFormProps {
  postContent: string;
  setPostContent: (c: string) => void;
  images: any[];
  handleImageUpload: (f: FileList) => void;
  removeImage: (id: string) => void;
  video: any | null;
  handleVideoUpload: (f: File) => void;
  handleVideoUrlSubmit: (u: string) => void;
  removeVideo: () => void;
  youtubeThumbnail: any | null;
  handleYoutubeThumbnailUpload: (f: File) => void;
  removeYoutubeThumbnail: () => void;
  hashtags: string[];
  addHashtag: (t: string) => void;
  removeHashtag: (t: string) => void;
  selectedPlatforms: string[];
  showScheduler: boolean;
  setShowScheduler: (s: boolean) => void;
  scheduleDate: string;
  setScheduleDate: (d: string) => void;
  scheduleTime: string;
  setScheduleTime: (t: string) => void;
  isPosting: boolean;
  handlePost: () => void;
  basePath: string;
  userId: string;
  companyId: string;
}

import { useState } from "react";
import { Stars } from "@solar-icons/react";
import { generateAIContent } from "@/service/ai/ai.service";
import { toast } from "react-toastify";

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  postContent,
  setPostContent,
  images,
  handleImageUpload,
  removeImage,
  video,
  handleVideoUpload,
  handleVideoUrlSubmit,
  removeVideo,
  youtubeThumbnail,
  handleYoutubeThumbnailUpload,
  removeYoutubeThumbnail,
  hashtags,
  addHashtag,
  removeHashtag,
  selectedPlatforms,
  showScheduler,
  setShowScheduler,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  isPosting,
  handlePost,
  basePath,
  userId,
  companyId,
}) => {
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    if (!aiContext.trim()) {
      toast.error("Please enter what you want to generate");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generateAIContent(userId, companyId, aiContext);
      setPostContent(generatedContent);
      setShowAiPrompt(false);
    } catch (error: any) {
      console.log('`first`')
    } finally {
      setIsGenerating(false);
    }
  };
  const maxCharacters = 2200;
  const characterCount = postContent.length;

  return (
    <div className="p-6 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto hidescroll">
      {/* YouTube specific uploader first */}
      {selectedPlatforms.includes("youtube") && (
        <div className="space-y-4">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Video <span className="text-[11px] font-normal normal-case text-slate-400">(Required)</span>
          </label>
          <VideoUploader video={video} onUpload={handleVideoUpload} onUrlSubmit={handleVideoUrlSubmit} onRemove={removeVideo} />

          {/* YouTube Thumbnail */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Thumbnail <span className="text-[11px] font-normal normal-case text-slate-400">(optional)</span>
            </label>
            {youtubeThumbnail ? (
              <div className="flex items-start gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-40 rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <img src={youtubeThumbnail.preview} alt="Preview" className="w-full aspect-video object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Thumbnail selected</p>
                  <button type="button" onClick={removeYoutubeThumbnail} className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm">
                    <FiX className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-700">Add custom thumbnail</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors text-sm font-medium">
                    <FiImage className="w-4 h-4" /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleYoutubeThumbnailUpload(file);
                      e.currentTarget.value = "";
                    }} />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            {selectedPlatforms.includes("youtube") ? "Title & Description" : "Post Content"}
          </label>
          <button
            onClick={() => setShowAiPrompt(!showAiPrompt)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${showAiPrompt ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'}`}
          >
            <Stars size={18} className={showAiPrompt ? 'animate-spin-slow' : ''} />
            {showAiPrompt ? "CLOSE AI ASSISTANT" : "AI MAGIC"}
          </button>
        </div>

        {showAiPrompt && (
          <div className="mb-4 space-y-3 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-blue-100 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-[11px] text-blue-600 font-bold italic">
              "Describe the post you want, and AI will draft it for you."
            </p>
            <div className="relative">
              <textarea
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
                placeholder="e.g. Write a catchy post about our new summer collection launch with 20% discount..."
                className="w-full h-24 p-3 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating || !aiContext.trim()}
                className="absolute bottom-3 right-3 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Stars size={14} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder={selectedPlatforms.includes("youtube") ? "Enter title and description..." : "What's on your mind?"}
            className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all resize-none text-sm leading-relaxed"
            maxLength={maxCharacters}
          />
          <div className="absolute bottom-3 right-3">
            <div className={`text-xs font-medium px-2 py-1 rounded-md ${characterCount > maxCharacters * 0.9 ? "bg-amber-100 text-amber-600" : "bg-white text-slate-400 border border-slate-200"}`}>
              {characterCount}/{maxCharacters}
            </div>
          </div>
        </div>
      </div>

      <HashtagInput hashtags={hashtags} onAddHashtag={addHashtag} onRemoveHashtag={removeHashtag} />

      {/* Media for other platforms */}
      {(selectedPlatforms.some(p => ["instagram", "facebook", "X"].includes(p))) && (
        <div className="space-y-4">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Media <span className="text-[11px] font-normal normal-case text-slate-400">(Images/Video)</span>
          </label>
          <ImageUploader images={images} onUpload={handleImageUpload} onRemove={removeImage} />
          {!selectedPlatforms.includes("youtube") && (selectedPlatforms.includes("facebook") || selectedPlatforms.includes("X")) && (
            <VideoUploader video={video} onUpload={handleVideoUpload} onUrlSubmit={handleVideoUrlSubmit} onRemove={removeVideo} hideUrlInput={true} />
          )}
        </div>
      )}

      {/* Selection prompt if empty */}
      {selectedPlatforms.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-700 font-medium">Select a platform above to see media options</p>
        </div>
      )}

      {/* Scheduler */}
      <div className="pt-2">
        <button onClick={() => setShowScheduler(!showScheduler)} className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all ${showScheduler ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          <FiClock className="w-4 h-4" /> {showScheduler ? "Scheduled" : "Schedule for later"}
        </button>
        <Scheduler isOpen={showScheduler} date={scheduleDate} time={scheduleTime} onDateChange={setScheduleDate} onTimeChange={setScheduleTime} />
      </div>

      {/* Mobile Footer */}
      <div className="flex gap-3 pt-5 border-t border-slate-100 md:hidden">
        <Link href={basePath} className="flex-1 py-3 px-4 bg-slate-50 text-slate-600 rounded-xl font-medium hover:bg-slate-100 transition-colors text-center border border-slate-200">
          Cancel
        </Link>
        <button
          onClick={handlePost}
          disabled={isPosting || (!postContent.trim() && images.length === 0 && !video) || selectedPlatforms.length === 0}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isPosting || (!postContent.trim() && images.length === 0 && !video) || selectedPlatforms.length === 0 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"}`}
        >
          {isPosting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : showScheduler ? <FiCalendar className="w-4 h-4" /> : <FiSend className="w-4 h-4" />}
          {isPosting ? "Publishing..." : showScheduler ? "Schedule" : "Publish"}
        </button>
      </div>
    </div>
  );
};
