"use client";
import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiImage,
  FiHash,
  FiSend,
  FiCalendar,
  FiClock,
  FiEdit3,
  FiEye,
  FiVideo,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import AuthContext from "@/contexts/authContext/authContext";
import { toast } from "react-toastify";
import { uploadYoutubeVideo } from "@/service/youtube/youtube.service";
import { postFacebookContent } from "@/service/facebook/facebook.service";
import { postXContent } from "@/service/x/x.service";
import {
  schedulePost,
  SchedulePostData,
} from "@/service/scheduler/scheduler.service";
import Layout from "@/screens/layout/Layout";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import HashtagInput from "@/screens/socialMedia/components/PostComposer/HashtagInput";
import ImageUploader from "@/screens/socialMedia/components/PostComposer/ImageUploader";
import VideoUploader from "@/screens/socialMedia/components/PostComposer/VideoUploader";
import Scheduler from "@/screens/socialMedia/components/PostComposer/Scheduler";
import {
  InstagramPreview,
  FacebookPreview,
  XPreview,
} from "@/screens/socialMedia/components/PostComposer/previews";
import { YouTubePreview } from "@/screens/socialMedia/components/PostComposer/previews";
import {
  UploadedImage,
  UploadedVideo,
  PreviewPlatform,
  platformIcons,
} from "@/screens/socialMedia/components/PostComposer/types";

export default function CreatePostPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const [previewPlatform, setPreviewPlatform] =
    useState<PreviewPlatform>("instagram");
  const [postContent, setPostContent] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [video, setVideo] = useState<UploadedVideo | null>(null);
  const [youtubeThumbnail, setYoutubeThumbnail] = useState<UploadedImage | null>(null);
  const [youtubeThumbnailDataUrl, setYoutubeThumbnailDataUrl] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // Get connected platforms from user context
  const getConnectedPlatforms = () => {
    if (!user) return [];
    const platforms: string[] = [];
    const userData = user as any;

    if (userData.instagram?.id || userData.instagram?.name || userData.instagram?.access_token)
      platforms.push("instagram");
    if (userData.facebook?.page_id || userData.facebook?.name || userData.facebook?.access_token)
      platforms.push("facebook");
    if (userData.x?.id || userData.x?.name || userData.x?.access_token) platforms.push("X");
    if (userData.youtube?.id || userData.youtube?.name || userData.youtube?.access_token)
      platforms.push("youtube");

    // If no platforms detected but user exists, show all platforms as options
    if (platforms.length === 0) {
      return ["instagram", "facebook", "X", "youtube"];
    }

    return platforms;
  };

  const connectedPlatforms = getConnectedPlatforms();

  // Auto-select first available platform for preview
  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      const platformMap: Record<string, PreviewPlatform> = {
        instagram: "instagram",
        facebook: "facebook",
        X: "x",
        youtube: "youtube",
      };
      setPreviewPlatform(platformMap[selectedPlatforms[0]] || "instagram");
    }
  }, [selectedPlatforms]);

  const getPreviewCandidates = (): PreviewPlatform[] => {
    const source = selectedPlatforms.length > 0 ? selectedPlatforms : connectedPlatforms;
    const platformMap: Record<string, PreviewPlatform | undefined> = {
      instagram: "instagram",
      facebook: "facebook",
      X: "x",
      youtube: "youtube",
    };

    const mapped = source
      .map((p) => platformMap[p])
      .filter(Boolean) as PreviewPlatform[];

    const unique = Array.from(new Set(mapped));
    return unique.length > 0 ? unique : ["instagram"];
  };

  const previewCandidates = getPreviewCandidates();

  useEffect(() => {
    if (!previewCandidates.includes(previewPlatform)) {
      setPreviewPlatform(previewCandidates[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatforms.join("|"), connectedPlatforms.join("|")]);

  const handleImageUpload = (files: FileList) => {
    const newImages: UploadedImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
        });
      }
    });
    setImages((prev) => [...prev, ...newImages].slice(0, 10));
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleVideoUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setVideo({
      id: `${Date.now()}`,
      file,
      preview,
    });
  };

  const handleVideoUrlSubmit = (url: string) => {
    setVideo({
      id: `${Date.now()}`,
      preview: "",
      url,
    });
  };

  const removeVideo = () => {
    if (video?.preview) URL.revokeObjectURL(video.preview);
    setVideo(null);
  };

  const handleYoutubeThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Thumbnail must be an image");
      return;
    }

    // Keep this conservative to avoid request body limits
    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error("Thumbnail must be 2MB or smaller");
      return;
    }

    const preview = URL.createObjectURL(file);
    setYoutubeThumbnail((prev) => {
      if (prev?.preview) URL.revokeObjectURL(prev.preview);
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview,
      };
    });

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read thumbnail"));
      reader.readAsDataURL(file);
    });
    setYoutubeThumbnailDataUrl(dataUrl);
  };

  const removeYoutubeThumbnail = () => {
    setYoutubeThumbnail((prev) => {
      if (prev?.preview) URL.revokeObjectURL(prev.preview);
      return null;
    });
    setYoutubeThumbnailDataUrl(null);
  };

  const addHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags((prev) => [...prev, tag]);
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const setPreviewByPlatform = (platform: string) => {
    const platformMap: Record<string, PreviewPlatform | undefined> = {
      instagram: "instagram",
      facebook: "facebook",
      X: "x",
      youtube: "youtube",
    };
    const mapped = platformMap[platform];
    if (mapped) setPreviewPlatform(mapped);
  };

  const togglePlatformFromHeader = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const isSelected = prev.includes(platform);
      const next = isSelected ? prev.filter((p) => p !== platform) : [...prev, platform];

      if (!isSelected) {
        setPreviewByPlatform(platform);
      } else {
        const mappedCurrent = previewPlatform;
        const removedMapped =
          platform === "X" ? "x" : (platform as PreviewPlatform);
        if (mappedCurrent === removedMapped) {
          const nextCandidates = next.length > 0 ? next : connectedPlatforms;
          const nextPlatform = nextCandidates[0];
          if (nextPlatform) setPreviewByPlatform(nextPlatform);
        }
      }

      return next;
    });
  };

  const handlePost = async () => {
    if (!postContent.trim() && images.length === 0 && !video) return;
    if (selectedPlatforms.length === 0) return;

    setIsPosting(true);
    const userId = user?.id || (user as any)?._id;

    try {
      const isScheduled = showScheduler && scheduleDate && scheduleTime;

      if (isScheduled) {
        const scheduledDateTime = new Date(
          `${scheduleDate}T${scheduleTime}`
        ).toISOString();
        const mediaUrls = images.map((img) => img.preview);

        for (const platform of selectedPlatforms) {
          const platformMapping: Record<
            string,
            "facebook" | "instagram" | "youtube" | "x"
          > = {
            facebook: "facebook",
            instagram: "instagram",
            youtube: "youtube",
            X: "x",
          };

          const mappedPlatform = platformMapping[platform];
          if (!mappedPlatform) continue;

          const scheduleData: SchedulePostData = {
            user_id: userId,
            platform: mappedPlatform,
            content: postContent,
            media_urls: video?.url ? [video.url] : mediaUrls,
            media_type: video ? "video" : images.length > 0 ? "image" : "text",
            hashtags,
            scheduled_at: scheduledDateTime,
            page_id:
              mappedPlatform === "facebook"
                ? (user as any).facebook?.project_id
                : undefined,
            platform_specific_data:
              mappedPlatform === "youtube"
                ? {
                  title: postContent.slice(0, 100) || "Untitled Video",
                  privacyStatus: "public",
                  thumbnailDataUrl: youtubeThumbnailDataUrl || undefined,
                }
                : undefined,
          };

          await schedulePost(scheduleData);
        }

        toast.success("Posts scheduled successfully!");
        // Navigate back to social media page with scheduled tab
        const basePath = pathname.replace("/create-post", "");
        router.push(basePath);
      } else {
        // Immediate posting
        if (selectedPlatforms.includes("youtube")) {
          if (!video) {
            toast.error("Please provide a video for YouTube");
            setIsPosting(false);
            return;
          }

          let youtubeScheduleAt;
          if (showScheduler && scheduleDate && scheduleTime) {
            youtubeScheduleAt = new Date(
              `${scheduleDate}T${scheduleTime}`
            ).toISOString();
          }

          let ytResponse;
          if (video.file) {
            const ytFormData = new FormData();
            ytFormData.append("user_id", user?.id || (user as any)?._id || "");
            ytFormData.append("title", postContent.slice(0, 100) || "Untitled Video");
            ytFormData.append("description", postContent);
            ytFormData.append("tags", hashtags.join(","));
            ytFormData.append("privacyStatus", "public");
            ytFormData.append("video", video.file);
            if (youtubeScheduleAt) ytFormData.append("scheduleAt", youtubeScheduleAt);
            if (youtubeThumbnailDataUrl) ytFormData.append("thumbnailDataUrl", youtubeThumbnailDataUrl);

            ytResponse = await uploadYoutubeVideo(ytFormData);
          } else {
            ytResponse = await uploadYoutubeVideo({
              user_id: user?.id || (user as any)?._id || "",
              title: postContent.slice(0, 100) || "Untitled Video",
              description: postContent,
              tags: hashtags,
              privacyStatus: "public",
              videoURL: video.url || "https://placeholder-url.com/video.mp4",
              scheduleAt: youtubeScheduleAt,
              thumbnailDataUrl: youtubeThumbnailDataUrl || undefined,
            });
          }

          const thumbnailSet =
            (ytResponse as any)?.thumbnailSet ?? (ytResponse as any)?.details?.thumbnailSet;
          const thumbnailError =
            (ytResponse as any)?.thumbnailError ?? (ytResponse as any)?.details?.thumbnailError;
          if (youtubeThumbnailDataUrl && thumbnailSet === false && thumbnailError) {
            toast.warn(
              "Video uploaded, but YouTube thumbnail couldn't be set (channel may not be eligible for custom thumbnails).",
            );
          }

          toast.success(
            youtubeScheduleAt
              ? "YouTube video scheduled!"
              : "YouTube video upload started!"
          );
        }

        if (selectedPlatforms.includes("facebook")) {
          const fbFormData = new FormData();
          fbFormData.append("userId", user?.id || (user as any)?._id || "");
          fbFormData.append(
            "pageId",
            (user as any).facebook?.project_id || ""
          );
          fbFormData.append("message", postContent);

          if (images.length > 0) {
            fbFormData.append("image", images[0].file!);
          }
          if (video?.file) {
            fbFormData.append("video", video.file);
          } else if (video?.url) {
            fbFormData.append("videoURL", video.url);
          }

          await postFacebookContent(fbFormData);
          toast.success("Posted to Facebook!");
        }

        if (selectedPlatforms.includes("X")) {
          const xFormData = new FormData();
          xFormData.append("userId", user?.id || (user as any)?._id || "");
          xFormData.append("message", postContent);

          if (hashtags.length > 0) {
            xFormData.append("hashtags", hashtags.join(","));
          }

          if (images.length > 0) {
            xFormData.append("image", images[0].file!);
          }
          if (video?.file) {
            xFormData.append("video", video.file);
          } else if (video?.url) {
            xFormData.append("videoURL", video.url);
          }

          await postXContent(xFormData);
          toast.success("Posted to X!");
        }

        // Navigate back
        const basePath = pathname.replace("/create-post", "");
        router.push(basePath);
      }

      // Reset form
      setPostContent("");
      setImages([]);
      setVideo(null);
      removeYoutubeThumbnail();
      setHashtags([]);
      setSelectedPlatforms([]);
      setShowScheduler(false);
      setScheduleDate("");
      setScheduleTime("");
    } catch (error: any) {
      console.error("Post failed:", error);
      toast.error(error.message || "Failed to publish post");
    } finally {
      setIsPosting(false);
    }
  };

  const getFullContent = () => {
    const hashtagString = hashtags.join(" ");
    return hashtagString ? `${postContent}\n\n${hashtagString}` : postContent;
  };

  const characterCount = postContent.length;
  const maxCharacters = 2200;
  const basePath = pathname.replace("/create-post", "");

  return (
    <Layout>
      <div className="mx-auto px-5 max-w-7xl font-sans min-h-screen">
        {/* Header */}
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

          {/* Top-right: platform selection + publish */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {connectedPlatforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform);
                const config = platformIcons[platform];
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatformFromHeader(platform)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${isSelected
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
              disabled={
                isPosting ||
                (!postContent.trim() && images.length === 0 && !video) ||
                selectedPlatforms.length === 0
              }
              className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${isPosting ||
                (!postContent.trim() && images.length === 0 && !video) ||
                selectedPlatforms.length === 0
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

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiEdit3 className="w-4 h-4 text-slate-600" />
                </div>
                Compose
              </h2>
              <div className="text-xs text-slate-400">
                Step 1 of 2
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto hidescroll">
              {/* Platform selection moved to header */}

              {/* YouTube: Video + Thumbnail FIRST */}
              {selectedPlatforms.includes("youtube") && (
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Video
                    <span className="text-[11px] font-normal normal-case text-slate-400">
                      (Required for YouTube)
                    </span>
                  </label>
                  <VideoUploader
                    video={video}
                    onUpload={handleVideoUpload}
                    onUrlSubmit={handleVideoUrlSubmit}
                    onRemove={removeVideo}
                  />

                  {/* YouTube Thumbnail */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Thumbnail
                      <span className="text-[11px] font-normal normal-case text-slate-400">
                        (optional)
                      </span>
                    </label>

                    {youtubeThumbnail ? (
                      <div className="flex items-start gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="w-40 rounded-xl overflow-hidden border border-slate-200 bg-white">
                          <img
                            src={youtubeThumbnail.preview}
                            alt="Thumbnail preview"
                            className="w-full aspect-video object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">Thumbnail selected</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Recommended 1280×720, ≤ 2MB
                          </p>
                          <button
                            type="button"
                            onClick={removeYoutubeThumbnail}
                            className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                          >
                            <FiX className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-slate-700">Add a custom thumbnail</p>
                            <p className="text-xs text-slate-500 mt-1">JPG/PNG, ≤ 2MB</p>
                          </div>
                          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors text-sm font-medium">
                            <FiImage className="w-4 h-4" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void handleYoutubeThumbnailUpload(file);
                                e.currentTarget.value = "";
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Area - Shows as Title/Description for YouTube */}
              <div className="relative">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {selectedPlatforms.includes("youtube") ? "Title & Description" : "Post Content"}
                </label>
                <div className="relative">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder={selectedPlatforms.includes("youtube")
                      ? "Enter your video title and description..."
                      : "What's on your mind? Write your post here..."}
                    className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all resize-none text-sm leading-relaxed"
                    maxLength={maxCharacters}
                  />
                  <div className="absolute bottom-3 right-3">
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded-md ${characterCount > maxCharacters * 0.9
                        ? "bg-amber-100 text-amber-600"
                        : "bg-white text-slate-400 border border-slate-200"
                        }`}
                    >
                      {characterCount}/{maxCharacters}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hashtags / Tags */}
              <HashtagInput
                hashtags={hashtags}
                onAddHashtag={addHashtag}
                onRemoveHashtag={removeHashtag}
              />

              {/* Media Section for Instagram/Facebook/X (not YouTube) */}
              {(selectedPlatforms.includes("instagram") ||
                selectedPlatforms.includes("facebook") ||
                selectedPlatforms.includes("X")) && !selectedPlatforms.includes("youtube") && (
                  <div className="space-y-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Media
                      <span className="text-[11px] font-normal normal-case text-slate-400">
                        {selectedPlatforms.includes("instagram")
                          ? "(Up to 10 images for carousel)"
                          : "(Images or Video)"}
                      </span>
                    </label>

                    {/* Image Upload */}
                    <ImageUploader
                      images={images}
                      onUpload={handleImageUpload}
                      onRemove={removeImage}
                    />

                    {/* Video Upload for Facebook/X */}
                    {(selectedPlatforms.includes("facebook") || selectedPlatforms.includes("X")) && (
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          Video
                          <span className="text-[11px] font-normal normal-case text-slate-400">
                            (optional)
                          </span>
                        </label>
                        <VideoUploader
                          video={video}
                          onUpload={handleVideoUpload}
                          onUrlSubmit={handleVideoUrlSubmit}
                          onRemove={removeVideo}
                        />
                      </div>
                    )}
                  </div>
                )}

              {/* Media for platforms when YouTube is ALSO selected (e.g., YouTube + Instagram) */}
              {selectedPlatforms.includes("youtube") &&
                (selectedPlatforms.includes("instagram") ||
                  selectedPlatforms.includes("facebook") ||
                  selectedPlatforms.includes("X")) && (
                  <div className="space-y-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Images
                      <span className="text-[11px] font-normal normal-case text-slate-400">
                        (For Instagram, Facebook, X)
                      </span>
                    </label>

                    <ImageUploader
                      images={images}
                      onUpload={handleImageUpload}
                      onRemove={removeImage}
                    />
                  </div>
                )}

              {/* No platform selected message */}
              {selectedPlatforms.length === 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-700 font-medium">
                    Select a platform above to see media options
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Different platforms support different media types
                  </p>
                </div>
              )}

              {/* Scheduler */}
              <div>
                <button
                  onClick={() => setShowScheduler(!showScheduler)}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all ${showScheduler
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  <FiClock className="w-4 h-4" />
                  {showScheduler ? "Scheduled" : "Schedule for later"}
                </button>
                <Scheduler
                  isOpen={showScheduler}
                  date={scheduleDate}
                  time={scheduleTime}
                  onDateChange={setScheduleDate}
                  onTimeChange={setScheduleTime}
                />
              </div>

              {/* Post Button - Mobile Only */}
              <div className="flex gap-3 pt-5 border-t border-slate-100 md:hidden">
                <Link
                  href={basePath}
                  className="flex-1 py-3 px-4 bg-slate-50 text-slate-600 rounded-xl font-medium hover:bg-slate-100 transition-colors text-center border border-slate-200"
                >
                  Cancel
                </Link>
                <button
                  onClick={handlePost}
                  disabled={
                    isPosting ||
                    (!postContent.trim() &&
                      images.length === 0 &&
                      !video) ||
                    selectedPlatforms.length === 0
                  }
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isPosting ||
                    (!postContent.trim() &&
                      images.length === 0 &&
                      !video) ||
                    selectedPlatforms.length === 0
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
          </motion.div>

          {/* Right Column - Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 lg:sticky lg:top-5 lg:h-fit"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FiEye className="w-4 h-4 text-slate-600" />
                  </div>
                  Preview
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  {previewPlatform === "x"
                    ? "X"
                    : previewPlatform === "youtube"
                      ? "YouTube"
                      : previewPlatform.charAt(0).toUpperCase() + previewPlatform.slice(1)}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-b from-slate-50 to-white min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewPlatform}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-center"
                  >
                    {previewPlatform === "instagram" && (
                      <InstagramPreview
                        content={getFullContent()}
                        images={images}
                      />
                    )}
                    {previewPlatform === "facebook" && (
                      <FacebookPreview
                        content={getFullContent()}
                        images={images}
                      />
                    )}
                    {previewPlatform === "x" && (
                      <XPreview
                        content={getFullContent()}
                        images={images}
                      />
                    )}
                    {previewPlatform === "youtube" && (
                      <YouTubePreview
                        title={"New video"}
                        description={getFullContent()}
                        video={video}
                        thumbnailPreview={youtubeThumbnail?.preview}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {!postContent && images.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <FiEye className="w-7 h-7 text-slate-300" />
                    </div>
                    <p className="font-medium text-slate-500">No preview yet</p>
                    <p className="text-sm mt-1">Start composing to see a live preview</p>
                  </div>
                )}
              </div>

              {/* Preview Footer */}
              {(postContent || images.length > 0) && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Previewing as {previewPlatform === 'x' ? 'X (Twitter)' : previewPlatform.charAt(0).toUpperCase() + previewPlatform.slice(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Live preview
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
