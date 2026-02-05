"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
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
  facebook: <FaFacebook className="text-blue-600" />,
  instagram: <FaInstagram className="text-pink-600" />,
  youtube: <FaYoutube className="text-red-600" />,
  x: <FaXTwitter className="text-gray-900" />,
};

const platformColors: Record<string, string> = {
  facebook: "border-blue-200 bg-blue-50",
  instagram: "border-pink-200 bg-gradient-to-r from-purple-50 to-pink-50",
  youtube: "border-red-200 bg-red-50",
  x: "border-gray-200 bg-gray-50",
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
      weekday: "short",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Post History</h2>
              <p className="text-sm text-slate-500">Your published content</p>
            </div>
          </div>
          <button
            onClick={fetchPostedContent}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <select
            value={filter.platform || ""}
            onChange={(e) => setFilter({ ...filter, platform: e.target.value || undefined })}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="x">X (Twitter)</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <FiCalendar className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm">Your published posts will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border ${platformColors[post.platform]} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                    {platformIcons[post.platform]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {post.status === "published" ? (
                            <FiCheckCircle className="w-3 h-3" />
                          ) : (
                            <FiXCircle className="w-3 h-3" />
                          )}
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        {post.is_scheduled && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                            Scheduled
                          </span>
                        )}
                      </div>
                      {post.platform_post_id && (
                        <a
                          href="#"
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          title="View on platform"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <p className="text-sm text-slate-800 line-clamp-2 mb-2">{post.content}</p>

                    {/* Media Preview */}
                    {post.media_urls && post.media_urls.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {post.media_urls.slice(0, 3).map((url, idx) => (
                          <div
                            key={idx}
                            className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden"
                          >
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                        {post.media_urls.length > 3 && (
                          <div className="w-16 h-16 rounded-lg bg-slate-300 flex items-center justify-center text-sm font-medium text-slate-600">
                            +{post.media_urls.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    {post.engagement && (
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <FiHeart className="w-3.5 h-3.5 text-red-400" />
                          {formatNumber(post.engagement.likes)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <FiMessageCircle className="w-3.5 h-3.5 text-blue-400" />
                          {formatNumber(post.engagement.comments)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <FiShare2 className="w-3.5 h-3.5 text-green-400" />
                          {formatNumber(post.engagement.shares)}
                        </div>
                        {post.engagement.views !== undefined && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <FiEye className="w-3.5 h-3.5 text-purple-400" />
                            {formatNumber(post.engagement.views)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Date & Time */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {formatDate(post.posted_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" />
                        {formatTime(post.posted_at)}
                      </span>
                    </div>

                    {/* Hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.hashtags.slice(0, 5).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-white/70 text-slate-600 text-xs rounded-full border border-slate-200"
                          >
                            #{tag.replace("#", "")}
                          </span>
                        ))}
                        {post.hashtags.length > 5 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                            +{post.hashtags.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Error Message */}
                    {post.error_message && (
                      <div className="mt-2 p-2 bg-red-100 rounded-lg">
                        <p className="text-xs text-red-600">{post.error_message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
