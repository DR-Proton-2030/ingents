import React from "react";
import Layout from "../layout/Layout";
import { TimeSchedule } from "../../components/screens/dashboard/TimeSchedule";
import { TeamControl } from "../../components/screens/dashboard/TeamControl";
import LeftNavigation from "@/components/screens/dashboard/LeftNavigation";
import { ProductivityScores } from "@/components/screens/dashboard/ProductivityScores";
import { Activity } from "@/components/screens/dashboard/Activity";
import { Meets } from "@/components/screens/dashboard/Meets";
import { DashboardHeader } from "@/components/screens/dashboard/DashboardHeader";
import Hero from "@/components/screens/dashboard/Hero";
import Attendence from "@/components/screens/dashboard/Attendence";
import AttendancePromptModal from "@/components/screens/dashboard/AttendancePromptModal";

export const Dashboard = () => {
  return (
    <Layout showSidebar={true}>
      <AttendancePromptModal />
      <div className="mx-auto max-w-8xl  space-y-6 overflow-hidden">
        {/* Header */}
        {/* <DashboardHeader /> */}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Navigation */}
          {/* <div className="lg:col-span-3">
            <LeftNavigation />
          </div> */}

          {/* Center content */}
          <section className="col-span-9 space-y-5 overflow-y-auto h-[82vh] hidescroll">
            <Hero />
            <div className="flex  gap-6">
              <div className="w-1/2 gap-4 flex-col  lg:flex">
                <ProductivityScores />
                <LeftNavigation />
                <Attendence />
              </div>
              <div className="w-1/2 pr-4 gap-4 flex-col lg:flex">
                <Meets />
                <Activity />
              </div>
            </div>
          </section>

          {/* Right column */}
          <aside className="lg:col-span-3 space-y-5 ">
            <TimeSchedule />
            <TeamControl />
          </aside>
        </div>
      </div>
    </Layout>
  );
};
