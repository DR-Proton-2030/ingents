"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import AuthContext from "@/contexts/authContext/authContext";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { getPostedContent, PostedContent } from "@/service/scheduler/scheduler.service";

// Sub-components
import { StatisticCard } from "./SocialSidebarStats/StatisticCard";
import { PostsAreaChart } from "./SocialSidebarStats/PostsAreaChart";
import { OrganizationMembers } from "./SocialSidebarStats/OrganizationMembers";
import { PostsPerPlatformChart } from "./SocialSidebarStats/PostsPerPlatformChart";
import { QuickStats } from "./SocialSidebarStats/QuickStats";
import { RecentActivityCard } from "./SocialSidebarStats/RecentActivityCard";

/* ── helpers ─────────────────────────────────────────── */

const getGreeting = (): { text: string; emoji: string } => {
  const h = new Date().getHours();
  if (h < 6) return { text: "Good Night", emoji: "🌙" };
  if (h < 12) return { text: "Good Morning", emoji: "☀️" };
  if (h < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  if (h < 21) return { text: "Good Evening", emoji: "🌆" };
  return { text: "Good Night", emoji: "🌙" };
};

export default function SocialSidebarStats() {
  const { user } = useContext(AuthContext);
  const { users } = useGetUsers();
  const [posts, setPosts] = useState<PostedContent[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = (user as any)?._id || (user as any)?.id;
  const profilePic = (user as any)?.profile_picture;
  const fullName = (user as any)?.full_name;
  const greeting = getGreeting();

  const safeUsers = Array.isArray(users) ? users : [];

  // Compute a "completion %" — connected platforms out of 4
  const connectedCount = [
    (user as any)?.youtube?.access_token,
    (user as any)?.facebook?.access_token || (user as any)?.facebook?.page_id,
    (user as any)?.instagram?.access_token,
    (user as any)?.x?.access_token,
  ].filter(Boolean).length;
  const completionPercent = Math.round((connectedCount / 4) * 100);

  const fetchPosts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getPostedContent(userId, { limit: 20 });
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error("Failed to load recent posts:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const onManualSync = () => {
      fetchPosts();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("insights:manual-sync", onManualSync);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("insights:manual-sync", onManualSync);
      }
    };
  }, [fetchPosts]);

  return (
    <div className="space-y-5 pt- h-[87vh] overflow-y-auto pb-10 hidescroll bg-white/50 backdrop-blur-sm rounded-lg p-5">

      <StatisticCard
        profilePic={profilePic}
        fullName={fullName}
        greeting={greeting}
        completionPercent={completionPercent}
      />



      <PostsPerPlatformChart posts={posts} />

      {/* <QuickStats posts={posts} /> */}

      <RecentActivityCard posts={posts} loading={loading} />
    </div>
  );
}
