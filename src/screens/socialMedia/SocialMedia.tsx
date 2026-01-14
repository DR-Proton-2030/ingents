"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FollowersChart from "./components/FollowersChart";
import StatCard from "./components/StatCard";
import TotalMessagesCard from "./components/TotalMessagesCard";
import FollowersOverviewCard from "./components/FollowersOverviewCard";
import AccountSelection from "./components/AccountSelection";
import PostComposer from "./components/PostComposer";
import AiSidebar from "@/components/shared/aiSidebar/AiSidebar";
import { getCompanyDetails, storeDefaultCompanyDetails } from "@/lib/storage";
import Layout from "../layout/Layout";


// Data for the page (kept local for now)

const stats = [
  {
    title: "New Followers",
    time: "Last 24h",
    value: "+234",
    color: "text-purple-600",
  },
  {
    title: "New Comments",
    time: "Last 24h",
    value: "+56",
    color: "text-gray-800",
  },
  {
    title: "New Likes",
    time: "Last 24h",
    value: "+985",
    color: "text-gray-800",
  },
];

const juneDataPoints = [
  [0, 110],
  [50, 150],
  [100, 140],
  [150, 160],
  [200, 100],
  [250, 180],
  [300, 50],
  [350, 110],
  [400, 55],
  [450, 120],
];
const julyDataPoints = [
  [0, 180],
  [50, 120],
  [100, 120],
  [150, 80],
  [200, 50],
  [250, 40],
  [300, 60],
  [350, 20],
  [450, 10],
];

export default function SocialMediaDashboard() {
  const [selectedCompany, setSelectedCompany] = useState(0);
  const [companyDetails, setCompanyDetails] = useState<any>(null);

  useEffect(() => {
    // If you'd like to seed the localStorage with the example company, uncomment:
    // storeDefaultCompanyDetails();

    const details = getCompanyDetails();
    setCompanyDetails(details);
  }, []);
  console.log("<=====>", companyDetails);
  return (
    <Layout>
      <div className="mx-auto px-5 max-w-7xl font-sans gap-5 flex flex-col lg:flex-row  grid grid-cols-1  lg:grid-cols-12">
        <div className="flex-grow  lg:col-span-8 h-[87vh] overflow-y-auto pb-10 hidescroll">
          {/* <Header
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
          /> */}
          <AccountSelection />
          <div className="mt-6">
            <PostComposer />
          </div>
        </div>
        <div className="w-full   flex-shrink-0 mt-8 lg:mt-0 lg:col-span-4">
          <AiSidebar aiUrl="social" context={companyDetails} />
        </div>
      </div>
    </Layout>
  );
}
