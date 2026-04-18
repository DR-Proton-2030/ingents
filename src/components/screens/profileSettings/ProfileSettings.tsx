"use client";
import React, { useState } from "react";
import Layout from "@/screens/layout/Layout";
import {
  User,
  ShieldCheck,
  Bell,
  Briefcase,
  Link as LinkIcon,
  RefreshCcw
} from "lucide-react";
import {
  PersonalInfo,
  Security,
  Notifications,
  Businesses,
  Integrations
} from "./components";

const sidebarItems = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "security", label: "Emails & Password", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "businesses", label: "Businesses", icon: Briefcase },
  { id: "integrations", label: "Integration", icon: LinkIcon },
];

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo />;
      case "security":
        return <Security />;
      case "notifications":
        return <Notifications />;
      case "businesses":
        return <Businesses />;
      case "integrations":
        return <Integrations />;
      default:
        return null;
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="flex h-full min-h-[calc(100-72px)]  overflow-hidden">
        {/* Profile Sidebar */}
        <div className="w-72 bg-black/80 h-[79vh] rounded-2xl border-r border-gray-50 p-5 flex flex-col space-y-10 flex-shrink-0">


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
                  <span className={`font-medium text-[14px]`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-12 overflow-y-auto max-h-screen">
          <div className="max-w-4xl mx-auto">


            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSettings;

