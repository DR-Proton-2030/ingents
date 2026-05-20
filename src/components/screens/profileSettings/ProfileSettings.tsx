"use client";
import React, { useState, useContext } from "react";
import Layout from "@/screens/layout/Layout";
import {
  User,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Lock,
  LogOut,
  Brain,
} from "lucide-react";
import {
  PersonalInfo,
  Security,
  SubscriptionBilling,
  HelpSupport,
  DataPrivacy,
  ProfileMemory,
} from "./components";
import AuthContext from "@/contexts/authContext/authContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const sidebarItems = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "security", label: "Emails & Password", icon: ShieldCheck },
  { id: "subscription", label: "Subscription & Billing", icon: CreditCard },
  { id: "memories", label: "Memories", icon: Brain },
  { id: "help", label: "Help & Support", icon: HelpCircle },
  { id: "privacy", label: "Data & Privacy", icon: Lock },
];

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API to clear server-side session & cookie
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue logout even if API call fails
    } finally {
      // Clear all client-side auth data
      Cookies.remove("token");
      Cookies.remove("authToken");
      Cookies.remove("session");

      // Clear storage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        // ignore storage errors in SSR
      }

      // Clear auth context
      setUser(null);

      // Redirect to login
      router.push("/login");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo />;
      case "security":
        return <Security />;
      case "subscription":
        return <SubscriptionBilling />;
      case "memories":
        return <ProfileMemory />;
      case "help":
        return <HelpSupport />;
      case "privacy":
        return <DataPrivacy />;
      default:
        return null;
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="flex h-[79vh] overflow-hidden gap-6">
        {/* Profile Sidebar */}
        <div className="w-72 bg-black/80 rounded-2xl p-5 flex flex-col justify-between flex-shrink-0 overflow-hidden">

          <nav className="flex flex-col space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    }`}
                >
                  <span className="font-medium text-[14px]">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button — pinned to bottom */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium text-[14px]">
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSettings;
