"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  ClockCircle,
  Calendar,
  Widget,
  AddCircle,
  Magnifer,
  Filter,
  MenuDots,
  Notes,
  Document
} from "@solar-icons/react";
import { ViewMode } from "@/types/interface/task.interface";
import { motion } from "framer-motion";
import { Table } from "lucide-react";
import { ITaskFilters } from "@/types/interface/taskFilter.interface";
import { ProjectSelector, CreateProjectDrawer } from "./components";
import { IProject } from "@/types/interface/project.interface";
import useProjects from "@/hooks/useProjects";
import { TaskHeaderProps, ViewTab } from "@/types/interface/props/taskHeader.props";


const viewTabs: ViewTab[] = [
  { id: "spreadsheet", label: "Spreadsheet", icon: Table },
  { id: "timeline", label: "Timeline", icon: ClockCircle },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "board", label: "Board", icon: Widget },
];

const TaskHeader: React.FC<TaskHeaderProps> = ({
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onFilter,
  onCreateProject,
  onCreateTask,
  filters,
  onFilterChange,
  phases,
  selectedProjectId,
  onProjectSelect,
  onDownloadReport,
}) => {
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = React.useState(false);
  const { handleCreateProject } = useProjects();
  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((acc, [key, value]) => {
    if (key === "onlyMyTasks") return value ? acc + 1 : acc;
    return value ? acc + 1 : acc;
  }, 0);

  return (
    <>
      <div className="space-y-6">
        {/* Top Row - View Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* View Tabs */}
          <div className="flex items-center gap-1.5 ">


            <div className="flex items-center gap-1.5 bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl w-fit">
              {viewTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onViewChange(tab.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                      isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-bg"
                        className="absolute inset-0 bg-white shadow-sm rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* @ts-ignore */}
                    <Icon className={cn("relative z-10 w-5 h-5 transition-colors", isActive ? "text-orange-500" : "text-gray-400")} />
                    {/* <span className="relative z-10">{tab.label}</span> */}
                  </button>
                );
              })}

            </div>

            <ProjectSelector
              onOpenCreateDrawer={() => setIsProjectDrawerOpen(true)}
              onSelectProject={onProjectSelect}
              selectedProjectId={selectedProjectId}
            />
          </div>
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <Magnifer className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm w-full md:w-72 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 shadow-sm transition-all placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={onFilter}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 bg-white border rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-sm",
                activeFilterCount > 0
                  ? "border-orange-200 text-orange-600 bg-orange-50/50"
                  : "border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200"
              )}
            >
              <div className="relative">
                <Filter className={cn("w-4 h-4", activeFilterCount > 0 ? "text-orange-500" : "text-gray-400")} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <span>Filter</span>
            </button>

            <button
              onClick={onDownloadReport}
              className="group flex items-center gap-1 py-2 px-4 bg-white/70 border shadow-sm border-gray-100 rounded-full relative overflow-hidden active:scale-95 transition-all hover:border-blue-200"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center transition-transform duration-500 group-hover:rotate-6">
                <Document className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <p className="font-sm text-sm">Download Report</p>
              </div>
            </button>

            <QuickActionCard
              icon={Notes}
              iconColor="text-orange-500"
              bgColor="bg-orange-50"
              hoverBorder="hover:border-orange-200"
              label="Create Task"
              description="Add a new item to your list"
              onClick={onCreateTask}
            />
          </div>
        </div>

        {/* Quick Action Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          icon={Document}
          iconColor="text-blue-500"
          bgColor="bg-blue-50"
          hoverBorder="hover:border-blue-200"
          label="Create Project"
          description="Build a new team workspace"
          onClick={onCreateProject}
        />
        <QuickActionCard
          icon={Notes}
          iconColor="text-orange-500"
          bgColor="bg-orange-50"
          hoverBorder="hover:border-orange-200"
          label="Create Task"
          description="Add a new item to your list"
          onClick={onCreateTask}
        />
    </div> */}
      </div >
      <CreateProjectDrawer
        isOpen={isProjectDrawerOpen}
        onClose={() => setIsProjectDrawerOpen(false)}
        onSubmit={async (data) => {
          await handleCreateProject(data);
          // projects will auto-refresh via hook
        }}
      />
    </>
  );
};

// Quick Action Card Sub-component
interface QuickActionCardProps {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  hoverBorder: string;
  label: string;
  description: string;
  onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  iconColor,
  bgColor,
  hoverBorder,
  label,
  description,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex  items-center gap-1 py-2 px-4 bg-white/70 border shadow-sm border-gray-100 rounded-full relative overflow-hidden",

      )}
    >
      {/* Decorative Gradient Overlay */}

      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-6", bgColor)}>
        {/* @ts-ignore */}
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div className="flex flex-col ">
        <p className="font-sm text-sm">{label}</p>
      </div>

    </button>
  );
};

export default TaskHeader;
