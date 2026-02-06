"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "./components/Header";
import FollowersChart from "./components/FollowersChart";
import StatCard from "./components/StatCard";
import TotalMessagesCard from "./components/TotalMessagesCard";
import FollowersOverviewCard from "./components/FollowersOverviewCard";
import AccountSelection from "./components/AccountSelection";
import CreatePostCTA from "./components/CreatePostCTA";
import ScheduledPosts from "./components/ScheduledPosts";
import PostedContentHistory from "./components/PostedContentHistory";
import SocialAnalyticsDashboard from "./components/SocialAnalyticsDashboard";
import AiSidebar from "@/components/shared/aiSidebar/AiSidebar";
import { getCompanyDetails, storeDefaultCompanyDetails } from "@/lib/storage";
import Layout from "../layout/Layout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthContext from "@/contexts/authContext/authContext";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  PenSquare, 
  CalendarClock, 
  History,
  ChevronRight
} from "lucide-react";
import AccountSelectionModal from "@/components/shared/AccountSelectionModal/AccountSelectionModal";
import { updateUser } from "@/utils/api/user/user.api";

import { useSocialMetrics } from "@/hooks/useSocialMetrics";

export default function SocialMediaDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useContext(AuthContext);
  const [selectedCompany, setSelectedCompany] = useState(0);
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"analytics" | "compose" | "scheduled" | "history">("analytics");
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const scheduledPostsRef = useRef<{ refresh: () => void } | null>(null);

  const { metrics, loading: metricsLoading } = useSocialMetrics((user as any)?._id || (user as any)?.id);

  // Account Selection Modal State
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#_=_") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const platformParam = searchParams.get("platform");
    const tokenParam = searchParams.get("token");

    if (platformParam && tokenParam) {
      if (platformParam.toLowerCase() === "facebook") {
        setPlatform(platformParam);
        setToken(tokenParam);
        setIsModalOpen(true);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const userId = (user as any)?._id || (user as any)?.id || searchParams.get("user_id");
    if (!token || !userId || !platform) return;
    const normalizedPlatform = platform.toLowerCase();
    if (normalizedPlatform === "facebook") {
      fetchProfile(token, userId);
    }
  }, [token, user, platform, searchParams]);

  useEffect(() => {
    const details = getCompanyDetails();
    setCompanyDetails(details);
  }, []);

  useEffect(() => {
    if (user) {
      const platforms: string[] = [];
      if ((user as any)?.youtube?.access_token) platforms.push("youtube");
      if ((user as any)?.facebook?.access_token || (user as any)?.facebook?.page_id) platforms.push("facebook");
      if ((user as any)?.instagram?.access_token) platforms.push("instagram");
      if ((user as any)?.x?.access_token) platforms.push("x");
      setConnectedPlatforms(platforms);
    }
  }, [user]);

  const handlePostScheduled = () => {
    setActiveTab("scheduled");
  };

  const tabs = [
    { id: "analytics", label: "Analytics", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "compose", label: "Create Post", icon: <PenSquare className="w-4 h-4" /> },
    { id: "scheduled", label: "Scheduled", icon: <CalendarClock className="w-4 h-4" /> },
    { id: "history", label: "History", icon: <History className="w-4 h-4" /> },
  ] as const;

  console.log("<=====>", companyDetails);

  // Account Selection Handlers
  function toPlatformKey(id: string | null): string | undefined {
    if (!id) return undefined;
    const normalized = id.toLowerCase();
    if (normalized === "twitter") return "x";
    const allowed = ["instagram", "facebook", "linkedin", "x", "youtube", "telegram"];
    return allowed.includes(normalized) ? normalized : undefined;
  }

  async function fetchProfile(access_token: string, user_id?: string) {
    try {
      const uid = user_id ?? "";
      const res = await fetch(`/api/facebook/profile?access_token=${access_token}&userId=${uid}`);
      const data = await res.json();
      console.log("Facebook profile data : ", data)
      if (res.ok && data.result) {
        setProfile(Array.isArray(data.result) ? data.result : [data.result]);
      }
    } catch (err) {
      console.error("fetchProfile error:", err);
    }
  }


  async function handleAccountSelect(accountId: string) {
    clearAuthQuery();
    setIsModalOpen(false);
  }

  function handleCloseModal() {
    clearAuthQuery();
    setIsModalOpen(false);
  }

  function clearAuthQuery() {
    try {
      router.replace(pathname);
      if (typeof window !== "undefined" && window.location.hash) {
        window.history.replaceState(null, "", pathname);
      }
      setPlatform(null);
      setToken(null);
    } catch (_) {}
  }

  return (
    <Layout>
      <div className="mx-auto px-5 max-w-7xl font-sans gap-5 flex flex-col lg:flex-row grid grid-cols-1 lg:grid-cols-12">
        <div className="flex-grow lg:col-span-8 h-[87vh] overflow-y-auto pb-10 hidescroll">
        
          {/* Platform Stats Cards at Top */}
          <SocialAnalyticsDashboard connectedPlatforms={connectedPlatforms} showOnlyStats metrics={metrics} />
          
          {/* Enhanced Tab Navigation */}
          <div className="mt-6 mb-6">
            <div className="flex bg-slate-50 rounded-2xl p-1.5 gap-1 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-black/70 -400 to-black/80 -500 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            {activeTab === "analytics" && (
              <SocialAnalyticsDashboard connectedPlatforms={connectedPlatforms} showChartAndMetrics metrics={metrics} />
            )}
            {activeTab === "compose" && (
              <CreatePostCTA />
            )}
            {activeTab === "scheduled" && (
              <ScheduledPosts />
            )}
            {activeTab === "history" && (
              <PostedContentHistory />
            )}
          </motion.div>
        </div>
        <div className="w-full flex-shrink-0 mt-8 lg:mt-0 lg:col-span-4">
          <AiSidebar aiUrl="social" context={companyDetails} />
        </div>
      </div>

      {/* Account Selection Modal */}
      {platform && (
        <AccountSelectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          platform={toPlatformKey(platform) as any}
          accounts={profile || []}
          onSelect={handleAccountSelect}
          token={token || ""}
        />
      )}
    </Layout>
  );
}
