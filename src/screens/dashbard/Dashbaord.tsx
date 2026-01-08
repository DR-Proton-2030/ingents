import React from "react";
import Layout from "../layout/Layout";
import { DashboardHeader } from "../../components/screens/dashboard/DashboardHeader";
import { LeftNavigation } from "../../components/screens/dashboard/LeftNavigation";
import { ProjectProgress } from "../../components/screens/dashboard/ProjectProgress";
import { UpcomingEvent } from "../../components/screens/dashboard/UpcomingEvent";
import { TimeSchedule } from "../../components/screens/dashboard/TimeSchedule";
import { TeamControl } from "../../components/screens/dashboard/TeamControl";

export const Dashboard = () => {
  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 hidescroll">
        {/* Header */}
        <DashboardHeader />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Navigation */}
          <div className="lg:col-span-3">
            <LeftNavigation />
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Row 1 */}
              <div className="h-full">
                <UpcomingEvent />
              </div>

              <div className="h-full">
                <ProjectProgress />
              </div>

              {/* Row 2 */}
              <div className="h-full">
                <TimeSchedule />
              </div>

              <div className="h-full">
                <TeamControl />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
