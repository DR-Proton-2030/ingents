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
import { useYouTubeDetails } from "@/hooks/useYouTubeDetails";
import AuthContext from "@/contexts/authContext/authContext";
import { Loading } from "@/components/shared/loadingScreen/Loading";

const YouTubeStatsDashboard = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useYouTubeDetails(user?.id);

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
             <Link 
               href="/site/social-media" 
               className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200"
             >
               Back to Social Media
             </Link>
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
