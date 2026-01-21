"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CloseCircle,
  Calendar,
  Filter,
  UsersGroupRounded,
  CheckCircle,
  Widget,
  User,
} from "@solar-icons/react";
import { SearchIcon, Trash } from "lucide-react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";
import { cn } from "@/lib/utils";
import { ITaskFilters } from "@/types/interface/taskFilter.interface";
import { FilterDrawerProps } from "@/types/interface/props/filterDrawer.props";




const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  phases,
}) => {
  const [localFilters, setLocalFilters] = useState<ITaskFilters>(filters);
  const { users: allUsers } = useGetUsers();
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [activePicker, setActivePicker] = useState<"assignee" | "date" | "status" | null>(null);

  // Sync with props when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, filters]);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared = {
      userId: null,
      statusId: null,
      dueDate: null,
      onlyMyTasks: false,
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
    onClose();
  };

  const filteredUsers = (Array.isArray(allUsers) ? allUsers : []).filter((u) => {
    const term = userSearchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      u.full_name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  const selectedUser = (Array.isArray(allUsers) ? allUsers : []).find(
    (u) => (u.id || (u as any)._id) === localFilters.userId
  );

  const selectedPhase = phases.find((p) => p._id === localFilters.statusId);

  // Use portal to render at body level
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="m-3 bg-gradient-to-r from-orange-500 to-orange-400 p-4 text-white shrink-0 rounded-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Tasks
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <CloseCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide space-y-8">
          {/* Quick Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Quick Filters
            </h3>
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white transition-all group">
              <input
                type="checkbox"
                checked={localFilters.onlyMyTasks}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, onlyMyTasks: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Show only my tasks
              </span>
            </label>
          </div>

          {/* Status Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                <Widget className="w-5 h-5 text-blue-500" />
              </div>
              Filter by Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {phases.map((phase) => (
                <button
                  key={phase._id}
                  onClick={() =>
                    setLocalFilters({
                      ...localFilters,
                      statusId: localFilters.statusId === phase._id ? null : phase._id,
                    })
                  }
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all text-left",
                    localFilters.statusId === phase._id
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                  )}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: phase.color }}
                  />
                  {phase.name}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="p-2 bg-purple-50 border border-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-500" />
              </div>
              Filter by Assignee
            </h3>
            <div className="relative">
              <button
                onClick={() => setActivePicker(activePicker === "assignee" ? null : "assignee")}
                className={cn(
                  "w-full h-12 px-4 rounded-xl border flex items-center justify-between transition-all",
                  localFilters.userId ? "border-purple-200 bg-purple-50/30" : "border-gray-100 bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2">
                  {selectedUser ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700 overflow-hidden">
                        {selectedUser.profile_picture ? (
                          <img src={selectedUser.profile_picture} className="w-full h-full object-cover" />
                        ) : (
                          selectedUser.full_name?.charAt(0)
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{selectedUser.full_name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 font-medium">Any Assignee</span>
                  )}
                </div>
                <UsersGroupRounded className="w-5 h-5 text-gray-400" />
              </button>

              {activePicker === "assignee" && (
                <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden p-2">
                  <div className="relative mb-2">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      className="w-full h-10 pl-9 pr-3 text-sm bg-gray-50 rounded-lg border-transparent focus:bg-white focus:border-purple-200 transition-all outline-none"
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-hide">
                    <button
                      onClick={() => {
                        setLocalFilters({ ...localFilters, userId: null });
                        setActivePicker(null);
                      }}
                      className="w-full p-2 text-left text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg"
                    >
                      Clear Assignee Filter
                    </button>
                    {filteredUsers.map((u) => (
                      <button
                        key={u.id || (u as any)._id}
                        onClick={() => {
                          setLocalFilters({ ...localFilters, userId: u.id || (u as any)._id });
                          setActivePicker(null);
                        }}
                        className="w-full p-2 flex items-center gap-3 hover:bg-purple-50 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase overflow-hidden">
                          {u.profile_picture ? (
                            <img src={u.profile_picture} className="w-full h-full object-cover" />
                          ) : (
                            u.full_name?.charAt(0) || "?"
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-800 group-hover:text-purple-600">
                          {u.full_name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Due Date Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="p-2 bg-green-50 border border-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              Filter by Due Date
            </h3>
            <input
              type="date"
              value={localFilters.dueDate || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, dueDate: e.target.value || null })
              }
              className="w-full h-12 px-4 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-gray-800 outline-none focus:border-green-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
          <div className="flex gap-4">
            <button
              onClick={handleClear}
              className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="flex-[2] h-12 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-gray-200"
            >
              <CheckCircle className="w-5 h-5" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FilterDrawer;
