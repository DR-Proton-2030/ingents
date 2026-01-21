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
  AltArrowRight,
  MinusCircle,
  AddCircle,
} from "@solar-icons/react";
import { Check, CheckCheck, SearchIcon, Trash, UserCircle } from "lucide-react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import AuthContext from "@/contexts/authContext/authContext";
import { useContext } from "react";
import { IUser } from "@/types/interface/user.interface";
import { cn } from "@/lib/utils";
import { ITaskFilters } from "@/types/interface/taskFilter.interface";
import { FilterDrawerProps } from "@/types/interface/props/filterDrawer.props";
import SortFilter from "./components/SortFilter";





const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  phases,
}) => {
  const [localFilters, setLocalFilters] = useState<ITaskFilters>(filters);
  const { users: allUsers } = useGetUsers();
  const { user } = useContext(AuthContext);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [activePicker, setActivePicker] = useState<"assignee" | "date" | "status" | null>(null);

  // Calendar States (Sync with CreateTaskModal)
  const [viewDate, setViewDate] = useState(new Date());
  const [selDate, setSelDate] = useState(new Date());

  // Search State for side picker
  const [searchQuery, setSearchQuery] = useState("");

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
      sort_by: null,
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

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  };

  const calendarData = getDaysInMonth(viewDate);

  // Sync Calendar Selection to Local Filters
  useEffect(() => {
    if (activePicker === "date") {
      const year = selDate.getFullYear();
      const month = String(selDate.getMonth() + 1).padStart(2, "0");
      const day = String(selDate.getDate()).padStart(2, "0");
      setLocalFilters(prev => ({ ...prev, dueDate: `${year}-${month}-${day}` }));
    }
  }, [selDate, activePicker]);

  // Use portal to render at body level
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="m-3 bg-gradient-to-r from-orange-500 to-orange-400 p-4 text-white shrink-0 rounded-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">

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
            <div className="flex items-center justify-between p-4 border rounded-xl border-gray-100 bg-gray-50 hover:bg-white transition-all group ">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-white ">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-orange-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                    My Tasks Only
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">Toggle for personalized view</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, onlyMyTasks: !localFilters.onlyMyTasks })}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none",
                  localFilters.onlyMyTasks ? "bg-orange-500" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                    localFilters.onlyMyTasks ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                <Widget className="w-5 h-5 text-blue-500" />
              </div>
              Filter by Status
            </h3>
            <div className="grid grid-cols-2 gap-3">
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
                    "flex items-center gap-3 p-3.5 rounded-xl h-12 text-[11px] font-bold transition-all text-left uppercase  ",


                  )}
                  style={{ backgroundColor: localFilters.statusId === phase._id ? `${phase.color}8A` : `${phase.color}2A` }}

                >

                  {phase.name}
                  {
                    localFilters.statusId === phase._id &&
                    <Check className="w-5 h-5 text-white" />
                  }
                </button>
              ))}
            </div>
          </div>

          {/* Assignee Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 border border-purple-100 rounded-lg">
                  <User className="w-5 h-5 text-purple-500" />
                </div>
                Filter by Assignee
              </div>
              <button
                type="button"
                onClick={() => setActivePicker(activePicker === "assignee" ? null : "assignee")}
                className="text-[10px] font-bold text-purple-600 hover:text-purple-700 uppercase  bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 transition-all active:scale-95"
              >
                {activePicker === "assignee" ? "Close" : "Select"}
              </button>
            </h3>

            <div className="space-y-2">
              {selectedUser ? (
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-100 transition-all group shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold border border-purple-100 shadow-sm overflow-hidden">
                    {selectedUser.profile_picture ? (
                      <img src={selectedUser.profile_picture} className="w-full h-full object-cover" />
                    ) : (
                      <span className="uppercase">{selectedUser.full_name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{selectedUser.full_name}</p>
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{selectedUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, userId: null })}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="p-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-purple-200 transition-colors cursor-pointer bg-gray-50/50"
                  onClick={() => setActivePicker("assignee")}
                >
                  <UsersGroupRounded className="w-8 h-8 text-gray-300 group-hover:text-purple-300 transition-colors mb-2" />
                  <p className="text-xs font-bold text-gray-400 group-hover:text-gray-500">Any Assignee</p>
                  <p className="text-[9px] text-gray-400 uppercase  mt-1">Click to filter by team member</p>
                </div>
              )}
            </div>
          </div>

          {/* Due Date Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 border border-green-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-500" />
                </div>
                Filter by Due Date
              </div>
              <button
                type="button"
                onClick={() => setActivePicker(activePicker === "date" ? null : "date")}
                className="text-[10px] font-bold text-green-600 hover:text-green-700 uppercase  bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 transition-all active:scale-95"
              >
                {activePicker === "date" ? "Close" : "Select"}
              </button>
            </h3>

            <button
              type="button"
              onClick={() => setActivePicker(activePicker === "date" ? null : "date")}
              className={cn(
                "w-full h-14 px-5 rounded-2xl border transition-all flex items-center justify-between group ",
                activePicker === "date" ? "border-green-500 bg-green-50/30 ring-4 ring-green-500/5" : "border-gray-100 bg-gray-50 hover:bg-white"
              )}
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[9px] text-gray-400 font-bold uppercase  mb-0.5">Selected Date</span>
                <span className="text-sm font-bold text-gray-700">
                  {localFilters.dueDate ? new Date(localFilters.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : "All Time"}
                </span>
              </div>
              <Calendar className={cn("w-5 h-5 transition-colors", activePicker === "date" ? "text-green-500" : "text-gray-400 group-hover:text-green-500")} />
            </button>
          </div>
          <SortFilter
            sortBy={localFilters.sort_by}
            onSortToggle={(value) =>
              setLocalFilters({
                ...localFilters,
                sort_by: localFilters.sort_by === value ? null : value,
              })
            }
          />
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
          <div className="flex gap-4">
            <button
              onClick={handleClear}
              className="flex-1 h-13 rounded-2xl border border-gray-200 text-gray-500 text-[11px] font-extrabold uppercase tracking-wider hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-[2] h-13 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <CheckCircle className="w-5 h-5" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Side Picker Panel */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 right-[100%] mr-4 w-96 bg-white rounded-[32px] shadow-2xl transition-all duration-300 transform border border-white/40 backdrop-blur-md overflow-hidden ${activePicker && activePicker !== "status" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
            }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-black text-gray-800 tracking-tight">
                {activePicker === "date" ? "Select Due Date" : "Filter by Assignee"}
              </h4>
              <button onClick={() => setActivePicker(null)} className="p-2 hover:bg-gray-50 rounded-xl transition-all">
                <CloseCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {activePicker === "date" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Month Header */}
                <div className="flex items-center justify-between px-1">
                  <h5 className="text-xs font-black text-gray-800 uppercase ">
                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h5>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <AltArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <AltArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-[10px] font-black text-gray-300 text-center py-2 uppercase tracking-tighter">{d}</div>
                  ))}
                  {[...Array(calendarData.firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                  {[...Array(calendarData.days)].map((_, i) => {
                    const day = i + 1;
                    const isSelected = selDate.getDate() === day && selDate.getMonth() === viewDate.getMonth() && selDate.getFullYear() === viewDate.getFullYear();
                    const isToday = new Date().getDate() === day && new Date().getMonth() === viewDate.getMonth() && new Date().getFullYear() === viewDate.getFullYear();

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                        className={`h-10 w-10 rounded-2xl text-[11px] font-black transition-all flex items-center justify-center relative ${isSelected ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                          }`}
                      >
                        {day}
                        {isToday && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-orange-500 rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLocalFilters({ ...localFilters, dueDate: null });
                      setActivePicker(null);
                    }}
                    className="flex-1 h-12 bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-black uppercase  hover:bg-gray-200 transition-all"
                  >
                    Clear Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePicker(null)}
                    className="flex-[2] h-12 bg-black text-white rounded-2xl text-[10px] font-black uppercase  hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {activePicker === "assignee" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teammates..."
                    className="w-full h-12 pl-11 pr-4 rounded-2xl transition-all outline-none text-sm font-bold bg-gray-50 focus:bg-white focus:ring-4 focus:ring-purple-500/5 border border-transparent focus:border-purple-500 text-gray-800"
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {(searchQuery.trim() ? filteredUsers : allUsers).map((u) => {
                    const isSelected = localFilters.userId === (u.id || (u as any)._id);
                    return (
                      <button
                        key={u.id || (u as any)._id}
                        type="button"
                        onClick={() => {
                          setLocalFilters({ ...localFilters, userId: isSelected ? null : (u.id || (u as any)._id) });
                          setActivePicker(null);
                        }}
                        className={cn(
                          "w-full p-3 flex items-center gap-3 rounded-2xl transition-all group border",
                          isSelected ? "bg-purple-50 border-purple-200 ring-2 ring-purple-500/10" : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-gray-600 flex items-center justify-center text-xs font-bold border border-gray-100 shadow-sm uppercase overflow-hidden">
                          {u.profile_picture ? (
                            <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            u.full_name?.charAt(0) || "?"
                          )}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{u.full_name}</p>
                          <p className="text-[10px] text-gray-500 truncate uppercase  font-black opacity-60">{u.email}</p>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-purple-500" />}
                      </button>
                    );
                  })}
                  {(searchQuery.trim() ? filteredUsers : allUsers).length === 0 && (
                    <div className="text-center py-1 opacity-40">
                      <UsersGroupRounded className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-xs font-black uppercase ">No results found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FilterDrawer;
