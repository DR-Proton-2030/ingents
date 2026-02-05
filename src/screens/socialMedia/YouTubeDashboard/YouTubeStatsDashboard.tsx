"use client";
import React, { useContext, useMemo, useState } from "react";
import Layout from "@/screens/layout/Layout";
import { motion } from "framer-motion";
import ProfileCard from "@/screens/socialMedia/components/Dashboard/ProfileCard";
import PostActivity from "@/screens/socialMedia/components/Dashboard/PostActivity";
import PostSchedule from "@/screens/socialMedia/components/Dashboard/PostSchedule";
import ProfileViews from "@/screens/socialMedia/components/Dashboard/ProfileViews";
import AnomalyCard from "@/screens/socialMedia/components/Dashboard/AnomalyCard";
import PostInsights from "@/screens/socialMedia/components/Dashboard/PostInsights";
import YourAccounts from "@/screens/socialMedia/components/Dashboard/YourAccounts";
import Header from "@/screens/socialMedia/components/Header";
import Link from "next/link";
import { useYouTubeDetails } from "@/hooks/useYouTubeDetails";
import AuthContext from "@/contexts/authContext/authContext";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const YouTubeStatsDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { data, loading, error } = useYouTubeDetails(user?.id);

  const youtubeConnected = useMemo(() => {
    return Boolean((user as any)?.youtube?.access_token);
  }, [user]);

  const handleDisconnect = async () => {
    if (isDisconnecting) return;

    if (!youtubeConnected) {
      toast.info("YouTube is already disconnected");
      return;
    }

    const confirmed =
      typeof window !== "undefined"
        ? window.confirm(
            "Disconnect YouTube? You can reconnect anytime from Social Media.",
          )
        : true;
    if (!confirmed) return;

    const userId = (user as any)?.id || (user as any)?._id;
    if (!userId) {
      toast.error("Missing user id");
      return;
    }

    try {
      setIsDisconnecting(true);
      const res = await fetch("/api/youtube/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || payload?.message || "Disconnect failed");
      }

      if (payload?.user) {
        setUser(payload.user);
      } else {
        setUser({
          ...(user as any),
          youtube: { project_id: null, name: null, access_token: null },
        });
      }

      toast.success("YouTube disconnected");
      router.push("/site/social-media");
    } catch (err: any) {
      toast.error(err?.message || "Failed to disconnect YouTube");
    } finally {
      setIsDisconnecting(false);
    }
  };

if (loading) {
    return (
      <Layout showSidebar={true}>
        <Loading />
      </Layout>
    );
}

  return (
    <Layout>
      <div className="min-h-screen bg-[#EAEEF6] p-4 lg:p-8 font-sans">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="flex justify-between items-center">
             <Header />
             <div className="flex items-center gap-3">
               <button
                 type="button"
                 onClick={handleDisconnect}
                 disabled={!youtubeConnected || isDisconnecting}
                 className="px-4 py-2 rounded-xl text-sm font-bold border transition-colors bg-white text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isDisconnecting ? "Disconnecting..." : "Disconnect"}
               </button>
               <Link
                 href="/site/social-media"
                 className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200"
               >
                 Back to Social Media
               </Link>
             </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              <ProfileCard data={data?.channel} demographics={data?.demographics} />
              <ProfileViews statistics={data?.channel?.statistics} data={data?.postActivity?.growthTrend} />
              <YourAccounts />
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-4 space-y-6">
              <PostActivity activity={data?.postActivity} />
              <AnomalyCard statistics={data?.channel?.statistics} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              <PostSchedule schedule={data?.postSchedule} />
              <PostInsights posts={data?.recentVideos} />
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default YouTubeStatsDashboard;
