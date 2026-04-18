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
import { Download, Table } from "lucide-react";
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
        {/* Row 1: View Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white backdrop-blur-xl  rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] w-fit">
          {viewTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                  isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-bg"
                    className="absolute inset-0 bg-gray-100  rounded-xl "
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                {/* @ts-ignore */}
                <Icon className={cn("relative z-10 w-5 h-5 transition-colors", isActive ? "text-gray-600" : "text-gray-400")} />
                <span className={cn("relative z-10 hidden sm:inline-block transition-opacity duration-300", isActive ? "opacity-100" : "opacity-60")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Project Selector and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ProjectSelector
              onOpenCreateDrawer={() => setIsProjectDrawerOpen(true)}
              onSelectProject={onProjectSelect}
              selectedProjectId={selectedProjectId}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative group flex-1 lg:flex-none min-w-[240px]">
              <Magnifer className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-white rounded-2xl text-sm w-full lg:w-64 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/40 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] transition-all placeholder:text-gray-400 font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Filter */}
              <button
                onClick={onFilter}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 bg-white  rounded-2xl text-sm font-bold transition-all ",
                  activeFilterCount > 0
                    ? "border-orange-200 text-orange-600 bg-orange-50"
                    : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200"
                )}
              >
                <div className="relative">
                  <Filter className={cn("w-4 h-4", activeFilterCount > 0 ? "text-orange-500" : "text-gray-400")} />
                  {activeFilterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-black"
                    >
                      {activeFilterCount}
                    </motion.span>
                  )}
                </div>
                <span className="hidden sm:inline">Filter</span>
              </button>

              {/* Download */}
              <button
                onClick={onDownloadReport}
                className="group p-2.5 bg-gray-200  text-gray-600 rounded-2xl hover:bg-gray-100 hover:border-gray-200 transition-all "
                title="Download Report"
              >
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1" />

              {/* Create Task */}
              <button
                onClick={onCreateTask}
                className="group flex items-center gap-2 px-5 py-2.5 bg-black/80 text-white  rounded-full text-sm font-bold shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_25px_-10px_rgba(0,0,0,0.4)] hover:bg-black transition-all active:scale-95 whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                  <AddCircle className="w-4 h-4 text-white" />
                </div>
                <span>Create Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateProjectDrawer
        isOpen={isProjectDrawerOpen}
        onClose={() => setIsProjectDrawerOpen(false)}
        onSubmit={async (data) => {
          await handleCreateProject(data);
        }}
      />
    </>
  );
};

export default TaskHeader;
