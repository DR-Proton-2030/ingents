"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import FollowersChart from "./components/FollowersChart";
import StatCard from "./components/StatCard";
import TotalMessagesCard from "./components/TotalMessagesCard";
import FollowersOverviewCard from "./components/FollowersOverviewCard";
import AccountSelection from "./components/AccountSelection";
import PostComposer from "./components/PostComposer";
import ScheduledPosts from "./components/ScheduledPosts";
import PostedContentHistory from "./components/PostedContentHistory";
import AiSidebar from "@/components/shared/aiSidebar/AiSidebar";
import { getCompanyDetails, storeDefaultCompanyDetails } from "@/lib/storage";
import Layout from "../layout/Layout";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SocialMediaDashboard() {
  const pathname = usePathname();
  const [selectedCompany, setSelectedCompany] = useState(0);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"compose" | "scheduled" | "history">("compose");
  const scheduledPostsRef = useRef<{ refresh: () => void } | null>(null);

  useEffect(() => {
    // If you'd like to seed the localStorage with the example company, uncomment:
    // storeDefaultCompanyDetails();

    const details = getCompanyDetails();
    setCompanyDetails(details);
  }, []);

  const handlePostScheduled = () => {
    // Refresh scheduled posts list
    setActiveTab("scheduled");
  };

  console.log("<=====>", companyDetails);
  return (
    <Layout>
      <div className="mx-auto px-5 max-w-7xl font-sans gap-5 flex flex-col lg:flex-row  grid grid-cols-1  lg:grid-cols-12">
        <div className="flex-grow  lg:col-span-8 h-[87vh] overflow-y-auto pb-10 hidescroll">
        
          <AccountSelection />
          
          {/* Tab Navigation */}
          <div className="mt-6 mb-4">
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveTab("compose")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "compose"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Create Post
              </button>
              <button
                onClick={() => setActiveTab("scheduled")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "scheduled"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "history"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                History
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "compose" && (
              <PostComposer onPostScheduled={handlePostScheduled} />
            )}
            {activeTab === "scheduled" && (
              <ScheduledPosts />
            )}
            {activeTab === "history" && (
              <PostedContentHistory />
            )}
          </div>
        </div>
        <div className="w-full   flex-shrink-0 mt-8 lg:mt-0 lg:col-span-4">
          <AiSidebar aiUrl="social" context={companyDetails} />
        </div>
      </div>
    </Layout>
  );
}
