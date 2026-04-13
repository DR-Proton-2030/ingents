import React from "react";
import Layout from "../layout/Layout";
import { DashboardHeader } from "../../components/screens/dashboard/DashboardHeader";

import { ProjectProgress } from "../../components/screens/dashboard/ProjectProgress";
import { UpcomingEvent } from "../../components/screens/dashboard/UpcomingEvent";
import { TimeSchedule } from "../../components/screens/dashboard/TimeSchedule";
import { TeamControl } from "../../components/screens/dashboard/TeamControl";
import AllUsers from "../../components/screens/dashboard/AllUsers";
import LeftNavigation from "@/components/screens/dashboard/LeftNavigation";
import { ProductivityScores } from "@/components/screens/dashboard/ProductivityScores";
import { Activity } from "@/components/screens/dashboard/Activity";

export const Dashboard = () => {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-8xl  space-y-6 hidescroll">
        {/* Header */}
        {/* <DashboardHeader /> */}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Navigation */}
          {/* <div className="lg:col-span-3">
            <LeftNavigation />
          </div> */}

          {/* Center content */}
          <section className="col-span-9 space-y-5">
<div className="flex items-center justify-center gap-6">
              <div className="w-1/2 gap-4 flex-col  justify-center lg:flex">
            <ProductivityScores />
                <LeftNavigation />
            </div>
            <div className="w-1/2 pr-4">
              <Activity />
            </div>
</div>
            <UpcomingEvent />

          </section>

          {/* Right column */}
          <aside className="lg:col-span-3 space-y-5">
            <TimeSchedule />
            <TeamControl />
          </aside>
        </div>
      </div>
    </Layout>
  );
};
