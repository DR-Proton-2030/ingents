import React from "react";
import Layout from "../layout/Layout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { LeftNavigation } from "../../components/dashboard/LeftNavigation";
import { ProjectProgress } from "../../components/dashboard/ProjectProgress";
import { UpcomingEvent } from "../../components/dashboard/UpcomingEvent";
import { TimeSchedule } from "../../components/dashboard/TimeSchedule";
import { TeamControl } from "../../components/dashboard/TeamControl";

export const Dashboard = () => {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 hidescroll">
        <DashboardHeader />

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <LeftNavigation />

          {/* Center content */}
          <section className="lg:col-span-6 space-y-5">
            <ProjectProgress />
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
