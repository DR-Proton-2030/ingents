"use client";
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiFilter,
} from "react-icons/fi";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import AuthContext from "@/contexts/authContext/authContext";
import { toast } from "react-toastify";
import {
  getScheduledPosts,
  cancelScheduledPost,
  reschedulePost,
  ScheduledPost,
} from "@/service/scheduler/scheduler.service";

interface ScheduledPostsProps {
  onEditPost?: (post: ScheduledPost) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <FaFacebook className="text-blue-600" />,
  instagram: <FaInstagram className="text-pink-600" />,
  youtube: <FaYoutube className="text-red-600" />,
  x: <FaXTwitter className="text-gray-900" />,
};

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    icon: <FiClock className="w-4 h-4" />,
  },
  processing: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: <FiLoader className="w-4 h-4 animate-spin" />,
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: <FiCheckCircle className="w-4 h-4" />,
  },
  failed: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: <FiXCircle className="w-4 h-4" />,
  },
  cancelled: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    icon: <FiXCircle className="w-4 h-4" />,
  },
};

export default function ScheduledPosts({ onEditPost }: ScheduledPostsProps) {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ status?: string; platform?: string }>({});
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [newScheduleDate, setNewScheduleDate] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("");

  const userId = user?._id || (user as any)?.id;

  useEffect(() => {
    if (userId) {
      fetchScheduledPosts();
    } else {
      setLoading(false);
    }
  }, [userId, filter]);

  const fetchScheduledPosts = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await getScheduledPosts(userId, filter);
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch scheduled posts:", error);
      toast.error(error.response?.data?.message || "Failed to fetch scheduled posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPost = async (postId: string) => {
    if (!confirm("Are you sure you want to cancel this scheduled post?")) return;

    try {
      const response = await cancelScheduledPost(postId);
      if (response.success) {
        toast.success("Post cancelled successfully");
        fetchScheduledPosts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel post");
    }
  };

  const handleReschedule = async () => {
    if (!selectedPost || !newScheduleDate || !newScheduleTime) {
      toast.error("Please select a new date and time");
      return;
    }

    try {
      const newScheduledAt = new Date(`${newScheduleDate}T${newScheduleTime}`).toISOString();
      const response = await reschedulePost(selectedPost._id, newScheduledAt);
      if (response.success) {
        toast.success("Post rescheduled successfully");
        setShowRescheduleModal(false);
        setSelectedPost(null);
        setNewScheduleDate("");
        setNewScheduleTime("");
        fetchScheduledPosts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reschedule post");
    }
  };

  const openRescheduleModal = (post: ScheduledPost) => {
    setSelectedPost(post);
    const scheduledDate = new Date(post.scheduled_at);
    setNewScheduleDate(scheduledDate.toISOString().split("T")[0]);
    setNewScheduleTime(scheduledDate.toTimeString().slice(0, 5));
    setShowRescheduleModal(true);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Scheduled Posts</h2>
              <p className="text-sm text-slate-500">Manage your upcoming posts</p>
            </div>
          </div>
          <button
            onClick={fetchScheduledPosts}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          <select
            value={filter.status || ""}
            onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filter.platform || ""}
            onChange={(e) => setFilter({ ...filter, platform: e.target.value || undefined })}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <FiLoader className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <FiCalendar className="w-12 h-12 mb-3" />
            <p className="text-lg font-medium">No scheduled posts</p>
            <p className="text-sm">Schedule your first post to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xl">
                      {platformIcons[post.platform]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[post.status].bg
                          } ${statusColors[post.status].text}`}
                        >
                          {statusColors[post.status].icon}
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        <span className="text-xs text-slate-500 capitalize">{post.platform}</span>
                      </div>
                      <p className="text-sm text-slate-800 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3.5 h-3.5" />
                          {formatDate(post.scheduled_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5" />
                          {formatTime(post.scheduled_at)}
                        </span>
                      </div>
                      {post.error_message && (
                        <div className="mt-2 flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                          <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-red-600">{post.error_message}</p>
                        </div>
                      )}
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.hashtags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                            >
                              #{tag.replace("#", "")}
                            </span>
                          ))}
                          {post.hashtags.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                              +{post.hashtags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {post.status === "pending" && (
                    <div className="flex items-center gap-1">
                      {onEditPost && (
                        <button
                          onClick={() => onEditPost(post)}
                          className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4 text-slate-600" />
                        </button>
                      )}
                      <button
                        onClick={() => openRescheduleModal(post)}
                        className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Reschedule"
                      >
                        <FiClock className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleCancelPost(post._id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Cancel"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showRescheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRescheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4">Reschedule Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newScheduleDate}
                    onChange={(e) => setNewScheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={newScheduleTime}
                    onChange={(e) => setNewScheduleTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="flex-1 px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
                >
                  Reschedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
