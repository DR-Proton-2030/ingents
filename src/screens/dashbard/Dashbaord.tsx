import React from "react";
import Layout from "../layout/Layout";
import { DashboardHeader } from "../../components/screens/dashboard/DashboardHeader";
import { LeftNavigation } from "../../components/screens/dashboard/LeftNavigation";

import { ProjectProgress } from "../../components/screens/dashboard/ProjectProgress";
import { UpcomingEvent } from "../../components/screens/dashboard/UpcomingEvent";
import { TimeSchedule } from "../../components/screens/dashboard/TimeSchedule";
import { TeamControl } from "../../components/screens/dashboard/TeamControl";
import AllUsers from "../../components/screens/dashboard/AllUsers";

export const Dashboard = () => {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 hidescroll">
        {/* Header */}
        <DashboardHeader />

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Navigation */}
          <div className="lg:col-span-3">
            <LeftNavigation />
          </div>

          {/* Center content */}
          <section className="lg:col-span-6 space-y-5">
            {/* <AllUsers /> */}
            <UpcomingEvent />
            <ProjectProgress />
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
