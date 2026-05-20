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
  Document,
  Tuning
} from "@solar-icons/react";
import { ViewMode } from "@/types/interface/task.interface";
import { motion } from "framer-motion";
import { Download, Plus, Share, Sparkle, Table } from "lucide-react";
import { ITaskFilters } from "@/types/interface/taskFilter.interface";
import { ProjectSelector, CreateProjectDrawer } from "./components";
import { IProject } from "@/types/interface/project.interface";
import useProjects from "@/hooks/useProjects";
import { TaskHeaderProps, ViewTab } from "@/types/interface/props/taskHeader.props";


const viewTabs: ViewTab[] = [
  { id: "spreadsheet", label: "Spreadsheet", icon: Table },
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
  onIntegrationsOpen,
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
      <div className="space-y-2">
        {/* Row 1: View Tabs */}
        {/* <div className="flex items-center gap-1 p-1 bg-white backdrop-blur-xl  rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] w-fit">
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
                <Icon className={cn("relative z-10 w-5 h-5 transition-colors", isActive ? "text-gray-600" : "text-gray-400")} />
                <span className={cn("relative z-10 hidden sm:inline-block transition-opacity duration-300", isActive ? "opacity-100" : "opacity-60")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div> */}

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
            <div className="flex items-center gap-2">
              {/* Filter */}
              <button
                onClick={onFilter}
                className={cn(
                  "cursor-pointer flex items-center gap-2 px-4 py-2.5  rounded-full text-sm font-semibold transition-all ",
                  activeFilterCount > 0
                    ? "border-orange-200 text-orange-600 bg-orange-50"
                    : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                )}
              >
                <div className="relative">
                  <Tuning className={cn("w-4 h-4", activeFilterCount > 0 ? "text-orange-500" : "text-gray-400")} />
                  {activeFilterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px]
                       flex items-center justify-center rounded-full border-2 border-white "
                    >
                      {activeFilterCount}
                    </motion.span>
                  )}
                </div>
                <span className="hidden sm:inline">Filter</span>
              </button>


              <div className="h-7 w-px bg-gray-200 mx-1" />

              {/* Create Task */}
              <button
                onClick={onCreateTask}
                className="group flex items-center gap-2 px-4 py-2.5 bg-black/70 text-white 
                 rounded-full text-sm font-semibold transition-all hover:bg-black/80 hover:text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Task
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
