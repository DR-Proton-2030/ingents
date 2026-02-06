"use client";
import React, { useContext } from "react";
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
import { useFacebookDetails } from "@/hooks/useFacebookDetails";
import AuthContext from "@/contexts/authContext/authContext";
import { Loading } from "@/components/shared/loadingScreen/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";

const FacebookStatsDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  const facebookConnected = React.useMemo(() => {
    return Boolean((user as any)?.facebook?.access_token || (user as any)?.facebook?.page_id);
  }, [user]);

  const { data, loading, error } = useFacebookDetails(user?.id, user?.facebook?.project_id);

  const handleDisconnect = async () => {
    if (isDisconnecting) return;

    if (!facebookConnected) {
      toast.info("Facebook is already disconnected");
      return;
    }

    const confirmed =
      typeof window !== "undefined"
        ? window.confirm(
            "Disconnect Facebook? You can reconnect anytime from Social Media.",
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
      const res = await fetch("/api/facebook/disconnect", {
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
          facebook: { project_id: null, name: null, access_token: null, page_id: null },
        });
      }

      toast.success("Facebook disconnected");
      router.push("/site/social-media");
    } catch (err: any) {
      toast.error(err?.message || "Failed to disconnect Facebook");
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

  if (error || !data) {
    return (
      <Layout showSidebar={true}>
        <div className="min-h-screen bg-[#EAEEF6] flex flex-col items-center justify-center p-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Loading Error</h2>
            <p className="text-gray-600 mb-8">{error || "Failed to load Facebook page data. Please ensure your account is connected and you've selected a page."}</p>
            <Link 
              href="/site/social-media" 
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-block"
            >
              Go Back
            </Link>
          </div>
        </div>
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
                 disabled={!facebookConnected || isDisconnecting}
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
              <ProfileCard 
                data={data?.page} 
                demographics={data?.demographics} 
                platform="facebook" 
              />
              <ProfileViews 
                statistics={{ page_views: data?.page?.fan_count / 10 }} // Mocking page views
                data={data?.postActivity?.growthTrend} 
                platform="facebook"
              />
              <YourAccounts />
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-4 space-y-6">
              <PostActivity activity={data?.postActivity} platform="facebook" />
              <AnomalyCard statistics={data?.page} platform="facebook" />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              <PostSchedule schedule={data?.postSchedule} />
              <PostInsights posts={data?.recentPosts} platform="facebook" />
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FacebookStatsDashboard;
