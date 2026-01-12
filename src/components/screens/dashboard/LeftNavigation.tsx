"use client";
import React, { useState } from "react";
import {
  Plus,
  MoreVertical,
  Check,
  Clock,
  Layout,
  LineChart,
  Calendar,
  Circle
} from "lucide-react";

interface Task {
  id: number;
  text: string;
  subtext: string;
  completed: boolean;
  time: string;
}

const initialTasks: Task[] = [
  { id: 1, text: "Business plans", subtext: "Marketing strategy", completed: false, time: "09:00 AM" },
  { id: 2, text: "Accounting", subtext: "Financial report", completed: true, time: "11:30 AM" },
  { id: 3, text: "HR management", subtext: "Interview session", completed: false, time: "02:00 PM" },
];

export const LeftNavigation = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          subtext: "General task",
          completed: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setNewTask("");
      setIsAdding(false);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <aside className="space-y-4">
      {/* Container Card */}
      <div className="rounded-[22px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <h3 className="text-[20px] font-bold text-[#1e293b]">Daily Tasks</h3>
            <p className="text-xs text-gray-400 font-medium">You have {tasks.length - completedCount} pending tasks</p>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-50 transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Card (Compact) */}
        <div className="mb-8 rounded-[24px] bg-gradient-to-br from-orange-300 to-orange-600 p-5 text-white shadow-[0_10px_20px_rgba(249,115,22,0.2)] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-orange-100 uppercase tracking-wider">Overall Progress</span>
              <h4 className="text-[24px] font-bold leading-tight mt-0.5">
                {Math.round((completedCount / tasks.length) * 100)}%
              </h4>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <LineChart className="h-6 w-6 text-white" />
            </div>
          </div>
          {/* Mini Progress Bar */}
          <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${(completedCount / tasks.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Tasks Tracker List */}
        <div className="relative pl-2">
          {/* Vertical Timeline Stem */}
          <div className="absolute left-[24px] top-4 bottom-4 w-[1px] border-l border-dashed border-gray-200" />

          <div className="space-y-6 mb-3">
            {tasks.map((task) => (
              <div key={task.id} className="relative flex items-center gap-3 group">
                {/* Circle Icon / Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`relative z-10 h-[40px] w-[40px] rounded-full flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 ${task.completed
                    ? "bg-gradient-to-br from-black/70 to-black/70 text-white shadow-lg shadow-black/30"
                    : "bg-[#fff3e0] text-orange-500 border border-orange-100"
                    }`}
                >
                  {task.completed ? <Check className="h-5 w-5" strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-orange-500" />}
                </button>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[16px] font-bold truncate transition-all ${task.completed ? "text-gray-400 line-through" : "text-[#1e293b]"
                      }`}>
                      {task.text}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">{task.time}</span>
                  </div>
                  <p className="text-[8px] text-gray-400 mt-0.5 truncate">{task.subtext}</p>
                </div>
              </div>
            ))}


          </div>
        </div>
      </div>

      {/* Mini Calendar Promo or Status */}
      <div className="rounded-[28px] bg-[#fffaf5] border border-orange-100/50 p-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Calendar className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#1e293b]">January 2024</p>
          <p className="text-xs text-gray-500">Check upcoming events</p>
        </div>
      </div>
    </aside>
  );
};

export default LeftNavigation;
