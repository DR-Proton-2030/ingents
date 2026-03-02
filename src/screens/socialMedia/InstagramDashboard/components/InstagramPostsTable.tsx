"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Image as ImageIcon,
  PlayCircle,
  Eye,
} from "lucide-react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import InstagramPostModal from "./InstagramPostModal";

interface InstagramPostsTableProps {
  posts: any[];
  title?: string;
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

export default function InstagramPostsTable({
  posts,
  title = "Published Content",
}: InstagramPostsTableProps) {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white/60 p-16 rounded-[40px] border border-dashed border-white/60 backdrop-blur-xl text-center">
        <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
          <ImageIcon className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest text-shadow-sm">
          No content found
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-sans relative z-0">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              View your posts and engagement at a glance
            </p>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">
                  Post
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Likes
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Comments
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Shares
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Saved
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Open
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post: any) => {
                const mediaType = post.media_type || post.mediaType;
                const mediaUrl = post.media_url || post.mediaUrl;
                const permalink = post.permalink;
                const caption = post.caption || "";
                const hasMultiple =
                  post.media_urls && post.media_urls.length > 1;

                const shares = getInsightValue(post.insights, "shares");
                const saved = getInsightValue(post.insights, "saved");

                return (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-start">
                        <div
                          className="relative flex-shrink-0 rounded-lg overflow-hidden shadow-sm ring-1 ring-black/5 w-32 h-[72px] bg-gray-100 cursor-pointer group/thumb"
                          onClick={() => setSelectedPost(post)}
                        >
                          {isVideoType(mediaType) ? (
                            <>
                              <video
                                src={mediaUrl}
                                className="w-32 h-[72px] object-cover"
                                muted
                                playsInline
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/thumb:bg-black/40 transition-colors">
                                <PlayCircle className="w-6 h-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <>
                              <img
                                src={
                                  mediaUrl ||
                                  "https://picsum.photos/seed/instagram-post/400/225"
                                }
                                className="w-32 h-[72px] object-cover"
                                alt=""
                                onError={(e) => {
                                  (e.target as any).src =
                                    "https://picsum.photos/seed/instagram-fail/400/225";
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/thumb:bg-black/30 transition-colors">
                                <Eye className="w-6 h-6 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity transform scale-75 group-hover/thumb:scale-100" />
                              </div>
                              {hasMultiple && (
                                <div className="absolute top-1.5 right-1.5 bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1">
                                  <ImageIcon className="w-2.5 h-2.5 text-white" />
                                  <span className="text-[9px] font-bold text-white leading-none">
                                    +{post.media_urls.length - 1}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                            {caption || "(No caption)"}
                          </p>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>
                              ID:{" "}
                              <span className="font-mono">
                                {post.id || "N/A"}
                              </span>
                            </span>
                            <button
                              onClick={() => setSelectedPost(post)}
                              className="text-pink-600 hover:text-pink-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> View
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {isVideoType(mediaType) ? (
                          <PlayCircle className="w-3.5 h-3.5" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5" />
                        )}
                        {(mediaType || "POST").toString().replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatDate(post.timestamp)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 block">
                        {formatCompactNumber(post.like_count || 0)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 block">
                        {formatCompactNumber(post.comments_count || 0)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 block">
                        {formatCompactNumber(shares)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 block">
                        {formatCompactNumber(saved)}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (permalink) window.open(permalink, "_blank");
                        }}
                        className="p-2 text-gray-400 cursor-pointer hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-all inline-flex"
                        title="Open on Instagram"
                        disabled={!permalink}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 block text-xs text-gray-500 text-center relative z-0">
          Showing {posts.length} posts
        </div>
      </div>

      {/* Premium Preview Modal */}
      <InstagramPostModal
        selectedPost={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
}
