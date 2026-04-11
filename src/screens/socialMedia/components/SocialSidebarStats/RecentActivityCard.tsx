import React from "react";
import { motion } from "framer-motion";
import {
  Youtube,
  Facebook,
  Instagram,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { PostedContent } from "@/service/scheduler/scheduler.service";

const platformConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string; barColor: string }
> = {
  youtube: {
    icon: <Youtube className="w-3.5 h-3.5" />,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "YouTube",
    barColor: "#ef4444",
  },
  facebook: {
    icon: <Facebook className="w-3.5 h-3.5" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Facebook",
    barColor: "#2563eb",
  },
  instagram: {
    icon: <Instagram className="w-3.5 h-3.5" />,
    color: "text-pink-500",
    bg: "bg-pink-50",
    label: "Instagram",
    barColor: "#ec4899",
  },
  x: {
    icon: <FaXTwitter className="w-3.5 h-3.5" />,
    color: "text-gray-800",
    bg: "bg-gray-100",
    label: "X",
    barColor: "#1f2937",
  },
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const getTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

interface RecentPostCardProps {
  post: PostedContent;
}

function RecentPostCard({ post }: RecentPostCardProps) {
  const config = platformConfig[post.platform] || platformConfig.facebook;
  const engagement = post.engagement || {};
  const totalInteractions =
    (engagement.likes || 0) +
    (engagement.comments || 0) +
    (engagement.shares || 0) +
    (engagement.views || 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group relative p-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {post.media_urls?.[0] ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
              <div className="w-full h-full flex items-center justify-center bg-slate-900/80">
                <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
              </div>
            
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full ${config.bg} ${config.color} flex items-center justify-center border-2 border-white`}
            >
              {config.icon}
            </div>
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 ${config.color}`}
          >
            {config.icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {config.label}
            </span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-[10px] text-slate-400">
              {getTimeAgo(post.posted_at)}
            </span>
          </div>
          <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
            {post.content?.slice(0, 80) || "No caption"}
            {(post.content?.length || 0) > 80 && "..."}
          </p>
        </div>
      </div>

      {totalInteractions > 0 && (
        <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-50">
          {engagement.views ? (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(engagement.views)}</span>
            </div>
          ) : null}
          {engagement.likes ? (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Heart className="w-3 h-3" />
              <span>{formatNumber(engagement.likes)}</span>
            </div>
          ) : null}
          {engagement.comments ? (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MessageCircle className="w-3 h-3" />
              <span>{formatNumber(engagement.comments)}</span>
            </div>
          ) : null}
          {engagement.shares ? (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Share2 className="w-3 h-3" />
              <span>{formatNumber(engagement.shares)}</span>
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>{formatNumber(totalInteractions)}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface RecentActivityCardProps {
  posts: PostedContent[];
  loading: boolean;
}

export function RecentActivityCard({ posts, loading }: RecentActivityCardProps) {
  return (
    <div className="">
        <div className="flex items-center gap-2">
          
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Recent Post Activity
            </h3>
            <p className="text-[11px] text-slate-400">Latest interactions</p>
          </div>
        </div>
      <div className="flex items-center justify-between mb-4">
        
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-slate-100/50 animate-pulse"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <ExternalLink className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-sm text-slate-500 font-medium">No posts yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Create and publish posts to see activity
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {posts.slice(0, 6).map((post) => (
            <RecentPostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
