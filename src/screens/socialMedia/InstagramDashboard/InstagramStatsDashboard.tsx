"use client";

import React, { useContext, useMemo, useState } from "react";
import Layout from "@/screens/layout/Layout";
import AuthContext from "@/contexts/authContext/authContext";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Heart,
  MessageCircle,
  Users,
  UserPlus,
  Image as ImageIcon,
  LayoutDashboard,
} from "lucide-react";

import Header from "@/screens/socialMedia/components/Header";
import FBStatCard from "@/screens/socialMedia/FacebookDashboard/components/FBStatCard";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";
import { useInstagramDetails } from "@/hooks/useInstagramDetails";
import InstagramHeader from "@/screens/socialMedia/InstagramDashboard/components/InstagramHeader";
import InstagramPostsTable from "@/screens/socialMedia/InstagramDashboard/components/InstagramPostsTable";

type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;

interface InstagramPublishedContentItem {
  id: string;
  media_type: InstagramMediaType;
  media_url?: string;
  permalink?: string;
  timestamp?: string;
  caption?: string;
  like_count?: number;
  comments_count?: number;
}

function toNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function clamp(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num));
}

function formatPercent(value: unknown) {
  if (value == null) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(1)}%`;
}

function hasKeys(value: unknown) {
  return !!value && typeof value === "object" && Object.keys(value as any).length > 0;
}

export default function InstagramStatsDashboard() {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<
    "overview" | "posts" | "audience" | "insights" | "top-content"
  >("overview");

  const userId = (user as any)?._id || (user as any)?.id;
  const { data, loading, error } = useInstagramDetails(userId);

  const baseSocialPath = useMemo(() => {
    const parts = (pathname || "").split("/").filter(Boolean);
    const site = parts[0];
    return site ? `/${site}/social-media` : "/site/social-media";
  }, [pathname]);

  const overview = data?.overview ?? data?.data?.overview;
  const contentBlock = data?.content ?? data?.data?.content;
  const content: InstagramPublishedContentItem[] =
    contentBlock?.publishedContent || [];
  const audience = data?.audience ?? data?.data?.audience;
  const insights = data?.insights ?? data?.data?.insights;
  const topByViews: InstagramPublishedContentItem[] =
    insights?.topContentByViews || [];
  const topByInteractions: InstagramPublishedContentItem[] =
    insights?.topContentByInteractions || [];

  const totals = useMemo(() => {
    const totalLikes = content.reduce(
      (acc, item) => acc + (Number(item.like_count) || 0),
      0,
    );
    const totalComments = content.reduce(
      (acc, item) => acc + (Number(item.comments_count) || 0),
      0,
    );
    return { totalLikes, totalComments };
  }, [content]);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8">
          <div className="bg-white/60 backdrop-blur-2xl p-12 rounded-[50px] shadow-2xl text-center max-w-md border border-white">
            <div className="w-20 h-20 bg-red-50/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100/30">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
              API Sync Failed
            </h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              {error ||
                "We couldn't reach your Instagram data. Ensure your account is connected."}
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-5 rounded-3xl font-black hover:opacity-90 transition-all shadow-xl uppercase tracking-widest text-xs"
              >
                Retry Synchronization
              </button>
              <Link
                href={baseSocialPath}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-5 rounded-3xl font-black hover:opacity-90 transition-all shadow-xl block text-center uppercase tracking-widest text-xs"
              >
                Back to Center
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-transparent pb-24 font-sans">
        <div className="max-w-[1700px] mx-auto px-4 lg:px-12 py-8">
          <div className="flex items-center justify-between gap-4">
            <Header />
            <Link
              href={baseSocialPath}
              className="bg-white/70 backdrop-blur-xl text-slate-900 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-white transition-colors border border-white/40 shadow-sm"
            >
              Back to Social Media
            </Link>
          </div>
        </div>

        <div className="max-w-[1700px] mx-auto space-y-12 px-4 lg:px-12">
          <InstagramHeader overview={overview} />

          <div className="-mt-2 flex flex-col xl:flex-row items-center justify-between gap-6 p-2 bg-white/60 backdrop-blur-md rounded-[32px] border border-white/50 shadow-sm">
            <div className="flex items-center gap-1 w-full xl:w-auto overflow-x-auto no-scrollbar">
              {([
                { id: "overview", label: "Overview" },
                { id: "posts", label: "Posts" },
                { id: "audience", label: "Audience" },
                { id: "insights", label: "Insights" },
                { id: "top-content", label: "Top Content" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3.5 rounded-3xl cursor-pointer text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap relative group ${activeTab === tab.id
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="igActiveTab"
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl shadow-[0_10px_28px_-12px_rgba(236,72,153,0.65)]"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            <Link
              href={baseSocialPath}
              className="px-6 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Back Center
            </Link>
          </div>

          {activeTab === "overview" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FBStatCard
                title="Followers"
                value={Number(overview?.followersCount || 0)}
                subtitle="Current followers"
                icon={<Users className="w-6 h-6" />}
                variant="default"
              />
              <FBStatCard
                title="Following"
                value={Number(overview?.followsCount || 0)}
                subtitle="Accounts you follow"
                icon={<UserPlus className="w-6 h-6" />}
                variant="default"
              />
              <FBStatCard
                title="Posts"
                value={Number(overview?.mediaCount || 0)}
                subtitle="Total media count"
                icon={<ImageIcon className="w-6 h-6" />}
                variant="default"
              />
              <FBStatCard
                title="Likes (Recent)"
                value={totals.totalLikes}
                subtitle="Sum of likes from fetched posts"
                icon={<Heart className="w-6 h-6" />}
                variant="default"
              />
              <FBStatCard
                title="Comments (Recent)"
                value={totals.totalComments}
                subtitle="Sum of comments from fetched posts"
                icon={<MessageCircle className="w-6 h-6" />}
                variant="default"
              />
              <FBStatCard
                title="Reach"
                value={Number(insights?.accountsReached || 0)}
                subtitle={
                  insights?.accountsReached == null
                    ? "Not available from API"
                    : "Accounts reached"
                }
                icon={<Users className="w-6 h-6" />}
                variant="default"
                disabled={insights?.accountsReached == null}
                formatter={(v) =>
                  insights?.accountsReached == null ? "---" : formatCompactNumber(v)
                }
              />
            </div>
          ) : activeTab === "posts" ? (
            <InstagramPostsTable posts={content} />
          ) : activeTab === "audience" ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FBStatCard
                  title="Followers"
                  value={toNumber(audience?.followers ?? overview?.followersCount ?? 0)}
                  subtitle="Audience followers"
                  icon={<Users className="w-6 h-6" />}
                  variant="default"
                />
                <FBStatCard
                  title="Account Type"
                  value={0}
                  subtitle={overview?.account_type || "—"}
                  icon={<Users className="w-6 h-6" />}
                  variant="default"
                  formatter={() => overview?.account_type || "—"}
                />
                <FBStatCard
                  title="User ID"
                  value={0}
                  subtitle={overview?.id || "—"}
                  icon={<Users className="w-6 h-6" />}
                  variant="default"
                  formatter={() => overview?.id || "—"}
                />
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-sm p-6">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">
                  Demographics
                </div>

                {hasKeys(audience?.demographics) ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Object.entries(audience.demographics as Record<string, any>).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="rounded-2xl border border-white/50 bg-white/70 p-4"
                        >
                          <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                            {key.replaceAll("_", " ")}
                          </div>
                          <div className="mt-2 text-sm text-slate-900 font-semibold break-words">
                            {typeof value === "string" || typeof value === "number"
                              ? String(value)
                              : Array.isArray(value)
                                ? `${value.length} items`
                                : value && typeof value === "object"
                                  ? `${Object.keys(value).length} fields`
                                  : "—"}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/60 bg-white/60 p-10 text-center">
                    <div className="text-slate-900 font-black tracking-tight">
                      No demographics available
                    </div>
                    <div className="text-slate-500 text-sm mt-1">
                      Instagram didn’t return demographic breakdown for this account.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "insights" ? (
            <div className="space-y-10">
              <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/60 backdrop-blur-xl shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50/70 via-white/40 to-purple-50/70 pointer-events-none" />
                <div className="relative p-8 lg:p-10">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <div className="space-y-2">
                      <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Interactions
                      </div>
                      <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                        {insights?.interactions?.total == null
                          ? "—"
                          : formatCompactNumber(toNumber(insights?.interactions?.total))}
                      </div>
                      <div className="text-sm font-semibold text-slate-600">
                        Total interactions (recent)
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                      <div className="rounded-2xl border border-white/60 bg-white/70 p-5">
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                          Followers
                        </div>
                        <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
                          {formatPercent(insights?.interactions?.followersPercentage)}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/60 bg-white/70 p-5">
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                          Non-followers
                        </div>
                        <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
                          {formatPercent(insights?.interactions?.nonFollowersPercentage)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-black text-slate-900 tracking-tight">
                        Interaction share by content
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        Posts · Reels · Stories
                      </div>
                    </div>

                    <div className="mt-6 space-y-5">
                      {(
                        [
                          { label: "Posts", value: insights?.interactionsByContentType?.posts },
                          { label: "Reels", value: insights?.interactionsByContentType?.reels },
                          { label: "Stories", value: insights?.interactionsByContentType?.stories },
                        ] as const
                      ).map((row) => {
                        const percentRaw = Number(row.value);
                        const percent = Number.isFinite(percentRaw)
                          ? clamp(percentRaw, 0, 100)
                          : 0;

                        return (
                          <div
                            key={row.label}
                            className="grid grid-cols-[86px_1fr_72px] items-center gap-4"
                          >
                            <div className="text-sm font-semibold text-slate-700">
                              {row.label}
                            </div>
                            <div className="h-2.5 rounded-full bg-white/80 ring-1 ring-black/5 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-pink-300 to-purple-300"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="text-sm font-black text-slate-900 text-right">
                              {formatPercent(row.value)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FBStatCard
                  title="Views (Total)"
                  value={toNumber(insights?.views?.total ?? 0)}
                  subtitle="Total views"
                  icon={<Users className="w-6 h-6" />}
                  variant="default"
                  disabled={insights?.views?.total == null}
                  formatter={(v) =>
                    insights?.views?.total == null ? "---" : formatCompactNumber(v)
                  }
                />
                <FBStatCard
                  title="Accounts Reached"
                  value={toNumber(insights?.accountsReached ?? 0)}
                  subtitle="Reach"
                  icon={<Users className="w-6 h-6" />}
                  variant="default"
                  disabled={insights?.accountsReached == null}
                  formatter={(v) =>
                    insights?.accountsReached == null ? "---" : formatCompactNumber(v)
                  }
                />
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-sm p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FBStatCard
                    title="Reach: Posts"
                    value={toNumber(insights?.reachByContentType?.posts ?? 0)}
                    subtitle="Accounts reached"
                    icon={<Users className="w-6 h-6" />}
                    variant="default"
                    disabled={insights?.reachByContentType?.posts == null}
                    formatter={(v) =>
                      insights?.reachByContentType?.posts == null
                        ? "---"
                        : formatCompactNumber(v)
                    }
                  />
                  <FBStatCard
                    title="Reach: Reels"
                    value={toNumber(insights?.reachByContentType?.reels ?? 0)}
                    subtitle="Accounts reached"
                    icon={<Users className="w-6 h-6" />}
                    variant="default"
                    disabled={insights?.reachByContentType?.reels == null}
                    formatter={(v) =>
                      insights?.reachByContentType?.reels == null
                        ? "---"
                        : formatCompactNumber(v)
                    }
                  />
                  <FBStatCard
                    title="Reach: Stories"
                    value={toNumber(insights?.reachByContentType?.stories ?? 0)}
                    subtitle="Accounts reached"
                    icon={<Users className="w-6 h-6" />}
                    variant="default"
                    disabled={insights?.reachByContentType?.stories == null}
                    formatter={(v) =>
                      insights?.reachByContentType?.stories == null
                        ? "---"
                        : formatCompactNumber(v)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FBStatCard
                    title="Profile Visits"
                    value={toNumber(insights?.profileActivity?.profileVisits ?? 0)}
                    subtitle="From profile activity"
                    icon={<Users className="w-6 h-6" />}
                    variant="default"
                    disabled={insights?.profileActivity?.profileVisits == null}
                    formatter={(v) =>
                      insights?.profileActivity?.profileVisits == null
                        ? "---"
                        : formatCompactNumber(v)
                    }
                  />
                  <FBStatCard
                    title="External Link Taps"
                    value={toNumber(insights?.profileActivity?.externalLinkTaps ?? 0)}
                    subtitle="From profile activity"
                    icon={<Users className="w-6 h-6" />}
                    variant="default"
                    disabled={insights?.profileActivity?.externalLinkTaps == null}
                    formatter={(v) =>
                      insights?.profileActivity?.externalLinkTaps == null
                        ? "---"
                        : formatCompactNumber(v)
                    }
                  />
                  <FBStatCard
                    title="Response Rate"
                    value={0}
                    subtitle={insights?.responsiveness?.dailyResponseRate || "—"}
                    icon={<Users className="w-6 h-6" />}
                    variant="default"
                    formatter={() => insights?.responsiveness?.dailyResponseRate || "—"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Messaging Started",
                      value:
                        insights?.conversations?.messagingConversationsStarted,
                    },
                    {
                      label: "Total Contacts",
                      value: insights?.conversations?.totalMessagingContacts,
                    },
                    {
                      label: "New Contacts",
                      value: insights?.conversations?.newMessagingContacts,
                    },
                    {
                      label: "Returning Contacts",
                      value: insights?.conversations?.returningMessagingContacts,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/50 bg-white/70 p-4"
                    >
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                        {item.label}
                      </div>
                      <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
                        {item.value == null ? "—" : formatCompactNumber(toNumber(item.value))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "top-content" ? (
            <div className="space-y-10">
              <InstagramPostsTable posts={topByViews} title="Top Content By Views" />
              <InstagramPostsTable
                posts={topByInteractions}
                title="Top Content By Interactions"
              />
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
