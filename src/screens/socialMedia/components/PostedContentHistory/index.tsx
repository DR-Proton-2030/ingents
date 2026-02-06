"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiExternalLink,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiEye,
  FiPlay,
  FiFilter,
} from "react-icons/fi";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import AuthContext from "@/contexts/authContext/authContext";
import { toast } from "react-toastify";
import {
  getPostedContent,
  PostedContent,
} from "@/service/scheduler/scheduler.service";

interface PostedContentHistoryProps {
  limit?: number;
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <FaFacebook />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  x: <FaXTwitter />,
};

const platformBrandColors: Record<string, string> = {
  facebook: "text-blue-600 bg-blue-50",
  instagram: "text-pink-600 bg-pink-50",
  youtube: "text-red-600 bg-red-50",
  x: "text-slate-900 bg-slate-50",
};

export default function PostedContentHistory({ limit }: PostedContentHistoryProps) {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{ platform?: string }>({});

  const userId = user?._id || (user as any)?.id;

  useEffect(() => {
    if (userId) {
      fetchPostedContent();
    } else {
      setLoading(false);
    }
  }, [userId, filter]);

  const fetchPostedContent = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await getPostedContent(userId, { ...filter, limit });
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch posted content:", error);
      toast.error(error.response?.data?.message || "Failed to fetch posted content");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getMediaUrl = (post: PostedContent, index: number) => {
    const url = post.media_urls?.[index];
    if (!url) return null;

    // Handle YouTube
    if (post.platform === "youtube" && post.platform_post_id) {
      return `https://img.youtube.com/vi/${post.platform_post_id}/mqdefault.jpg`;
    }

    // Handle standard URL (images usually)
    return url;
  };

  const isVideo = (post: PostedContent) => {
    return post.media_type === "video" || post.platform === "youtube";
  };

  const getPlatformLink = (post: PostedContent) => {
    if (!post.platform_post_id) return "#";

    switch (post.platform) {
      case "youtube":
        return `https://www.youtube.com/watch?v=${post.platform_post_id}`;
      case "facebook":
        return `https://facebook.com/${post.platform_post_id}`;
      case "instagram":
        return `https://instagram.com/p/${post.platform_post_id}`;
      case "x":
        return `https://x.com/status/${post.platform_post_id}`;
      default:
        return "#";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Post History
            {loading && <FiLoader className="w-4 h-4 animate-spin text-indigo-500" />}
          </h2>
          <p className="text-sm text-slate-500">Manage and track your published content</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <select
              value={filter.platform || ""}
              onChange={(e) => setFilter({ ...filter, platform: e.target.value || undefined })}
              className="pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer appearance-none shadow-sm hover:border-slate-300"
            >
              <option value="">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="x">X (Twitter)</option>
            </select>
          </div>

          <button
            onClick={fetchPostedContent}
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            title="Refresh list"
          >
            <FiRefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {loading && posts.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm border border-slate-100 rounded-3xl">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
              <FiLoader className="absolute inset-0 m-auto w-6 h-6 text-indigo-600" />
            </div>
            <p className="mt-4 text-slate-500 font-medium">Loading your content history...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <FiCalendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No published content found</h3>
            <p className="text-slate-500 max-w-[280px] text-center mt-1">
              Start creating and publishing posts to see your history here.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post, idx) => (
              <motion.div
                key={(post as any)._id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all shadow"
              >
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-50 overflow-hidden">
                  <div
                    className={`h-full ${post.status === "published" ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Media Thumbnail */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 group/media shadow-sm">
                      {getMediaUrl(post, 0) ? (
                        isVideo(post) && post.platform !== "youtube" ? (
                          <video
                            src={getMediaUrl(post, 0)!}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={getMediaUrl(post, 0)!}
                            alt="Media preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${post.platform}&background=f1f5f9&color=64748b`;
                            }}
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                          {platformIcons[post.platform]}
                        </div>
                      )}

                      {/* Video Indicator */}
                      {isVideo(post) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/media:bg-black/40 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 sm:scale-100">
                            <FiPlay className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                          </div>
                        </div>
                      )}

                      {/* Multiple Media Badge */}
                      {post.media_urls && post.media_urls.length > 1 && (
                        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-white font-bold">
                          +{post.media_urls.length - 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg text-sm ${platformBrandColors[post.platform]}`}>
                            {platformIcons[post.platform]}
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                            {post.platform}
                          </span>
                        </div>

                        <a
                          href={getPlatformLink(post)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {post.content || "Untitled Post"}
                      </h3>

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3.5 h-3.5" />
                          {formatDate(post.posted_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5" />
                          {formatTime(post.posted_at)}
                        </div>
                      </div>

                      {/* Engagement Bar */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 group/stat">
                          <FiHeart className="w-3.5 h-3.5 text-slate-400 group-hover/stat:text-pink-500 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-600 tracking-tighter">
                            {formatNumber(post.engagement?.likes)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 group/stat">
                          <FiMessageCircle className="w-3.5 h-3.5 text-slate-400 group-hover/stat:text-blue-500 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-600 tracking-tighter">
                            {formatNumber(post.engagement?.comments)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 group/stat">
                          <FiEye className="w-3.5 h-3.5 text-slate-400 group-hover/stat:text-indigo-500 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-600 tracking-tighter">
                            {formatNumber(post.engagement?.views)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Error */}
                  {post.status === "failed" && (
                    <div className="mt-3 p-2 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                      <FiXCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <p className="text-[10px] font-medium text-red-600 truncate">
                        {post.error_message || "Publication failed"}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {loading && posts.length > 0 && (
        <div className="flex justify-center py-4">
          <FiLoader className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      )}
    </div>
  );
}

