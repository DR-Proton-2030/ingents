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

interface ViewTab {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
}

const viewTabs: ViewTab[] = [
  { id: "spreadsheet", label: "Spreadsheet", icon: Table },
  { id: "timeline", label: "Timeline", icon: ClockCircle },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "board", label: "Board", icon: Widget },
];

interface TaskHeaderProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilter?: () => void;
  onCreateProject?: () => void;
  onCreateTask?: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  activeView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onFilter,
  onCreateProject,
  onCreateTask,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Row - View Tabs and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* View Tabs */}
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
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-200 hover:text-orange-500 transition-all active:scale-90">
            <AddCircle className="w-5 h-5" />
          </button>
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
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 shadow-sm transition-all active:scale-95"
          >
            <Filter className="w-4 h-4 text-gray-400" />
            <span>Filter</span>
          </button>

          {/* More Options */}
          <button className="p-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all active:scale-95">
            <MenuDots className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>
    </div>
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
        "group flex  items-center gap-4 p-2 bg-white border shadow-sm border-gray-100 rounded-[32px] transition-all duration-300 text-left hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 relative overflow-hidden",
        hoverBorder
      )}
    >
      {/* Decorative Gradient Overlay */}

      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6", bgColor)}>
        {/* @ts-ignore */}
        <Icon className={cn("w-7 h-7", iconColor)} />
      </div>
      <div className="flex flex-col ">
        <p className="font-sm">{label}</p>
        <p className="text-[10px] text-gray-500">{description}</p>
      </div>

    </button>
  );
};

export default TaskHeader;
