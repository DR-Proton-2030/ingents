import React from "react";
import Layout from "../layout/Layout";
import { DashboardHeader } from "../../components/screens/dashboard/DashboardHeader";
import { LeftNavigation } from "../../components/screens/dashboard/LeftNavigation";
import { ProjectProgress } from "../../components/screens/dashboard/ProjectProgress";
import { UpcomingEvent } from "../../components/screens/dashboard/UpcomingEvent";
import { TimeSchedule } from "../../components/screens/dashboard/TimeSchedule";
import { TeamControl } from "../../components/screens/dashboard/TeamControl";
import AllUsers from "@/components/screens/dashboard/AllUsers";

export const Dashboard = () => {
  interface User {
  _id: string;
  full_name: string;
  email: string;
  role: "company_admin" | "employee" | "manager";
}
  const users:User[] = [
    {
      _id: "1",
      full_name: "John Doe",
      email: "john.doe@example.com",
      role: "employee"
    },
    {
      _id: "2",
      full_name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "manager"
    }
  ];

  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 hidescroll">
        <DashboardHeader />

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <LeftNavigation />
        
          {/* Center content */}
          <section className="lg:col-span-6 space-y-5">
              <AllUsers/>
            
       
          </section>

          {/* Right column */}
          <aside className="lg:col-span-3 space-y-5">
            <TimeSchedule />
            <TeamControl />
          </aside>
        </div>
   <div className="lg:col-span-4">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
    
    {/* Upcoming Event */}
    <div className="h-full">
      <UpcomingEvent />
    </div>

    {/* Project Progress */}
    <div className="h-full">
      <ProjectProgress />
    </div>

  </div>
</div>


      </div>
    </Layout>
  );
};
