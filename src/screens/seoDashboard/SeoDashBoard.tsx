import React from "react";
import Layout from "../layout/Layout";
import FollowersChart from "../socialMedia/components/FollowersChart";

import TotalMessagesCard from "../socialMedia/components/TotalMessagesCard";
import FollowersOverviewCard from "../socialMedia/components/FollowersOverviewCard";
import AiSidebar from "@/components/shared/aiSidebar/AiSidebar";
import { Header } from "./components/Header";

export const SeoDashBoard = () => {
  return (
    <Layout>
      <div className="mx-auto px-5 max-w-7xl font-sans gap-5 flex flex-col lg:flex-row  grid grid-cols-1  lg:grid-cols-12">
        <div className="flex-grow  lg:col-span-8 h-[87vh] overflow-y-auto pb-10 hidescroll">
          <Header />
          <main className="mt-8 space-y-6 pr-2">
            <FollowersChart />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TotalMessagesCard />
              <FollowersOverviewCard />
            </div>
          </main>
        </div>
        <div className="w-full   flex-shrink-0 mt-8 lg:mt-0 lg:col-span-4">
          <AiSidebar />
        </div>
      </div>
    </Layout>
  );
};
