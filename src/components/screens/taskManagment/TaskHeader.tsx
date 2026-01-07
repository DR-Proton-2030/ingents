"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Filter,
  LayoutGrid,
  Calendar,
  Clock,
  Table,
  Plus,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { ViewMode } from "@/types/interface/task.interface";

interface ViewTab {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}

const viewTabs: ViewTab[] = [
  { id: "spreadsheet", label: "Spreadsheet", icon: <Table className="w-4 h-4" /> },
  { id: "timeline", label: "Timeline", icon: <Clock className="w-4 h-4" /> },
  { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
  { id: "board", label: "Board", icon: <LayoutGrid className="w-4 h-4" /> },
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
    <div className="space-y-4">
      {/* Top Row - View Tabs and Search */}
      <div className="flex items-center justify-between">
        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                activeView === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-200">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search task..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          {/* More Options */}
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="flex items-center gap-4">
        <QuickActionCard
          icon={
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          label="Create Project"
          onClick={onCreateProject}
        />
        <QuickActionCard
          icon={
            <svg
              className="w-5 h-5 bg-orange-500 rounded-lg text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          }
          label="Create Task"
          onClick={onCreateTask}
        />
      </div>
    </div>
  );
};

// Quick Action Card Sub-component
interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all min-w-48"
    >
      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default TaskHeader;
