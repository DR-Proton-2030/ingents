"use client";
import React, { useMemo, useRef, useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function generateDates() {
  const today = new Date();
  const dates = [];
  for (let i = -15; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      date: d.getDate(),
      full: d.toISOString().split("T")[0],
      isToday: i === 0,
    });
  }
  return dates;
}

const initialTasks: Task[] = [
  { id: 1, text: "Work on AppKarma Project", completed: true },
  { id: 2, text: "Update Upwork Portfolio", completed: false },
  { id: 3, text: "Create Style Guide for John", completed: false },
  { id: 4, text: "Button Component - Dribbble", completed: false },
  { id: 5, text: "Dribbble Post (2)", completed: false },
  { id: 6, text: "Personal Website Design", completed: false },
];

export default function TodoUI() {
  const dates = useMemo(generateDates, []);
  const todayKey = dates.find(d => d.isToday)?.full ?? dates[0].full;
  const [activeDate, setActiveDate] = useState(todayKey);
  const [tasks, setTasks] = useState(initialTasks);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  const activeLabel = dates.find(d => d.full === activeDate);

  return (
    <div className="flex gap-4 rounded-2xl select-none" style={{ borderRadius: 8 }}>

      {/* LEFT DATE COLUMN — scrollable vertically */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 bg-white rounded-2xl shadow-xl shadow-gray-100 p-4 overflow-y-auto max-h-[340px]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dates.map(d => {
          const isActive = activeDate === d.full;
          return (
            <button
              key={d.full}
              onClick={() => setActiveDate(d.full)}
              className={`flex-shrink-0 w-[60px] h-[60px] rounded-xl flex flex-col shadow-xl shadow-gray-200 items-center justify-center transition-all duration-200
                ${isActive
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
                }`}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide">{d.month}</span>
              <span className="text-lg font-semibold leading-tight">{d.date}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT TODO PANEL */}
      <div className="flex-1 bg-white p-5 rounded-2xl shadow-xl shadow-gray-100" >

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">To Do List</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {pending} tasks pending
          </p>
        </div>

        {/* TASK LIST */}
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-2.5">

              {/* CHECKBOX */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 flex-shrink-0 flex items-center justify-center border transition-all duration-150
                  ${task.completed
                    ? "bg-black/80 border-black/80"
                    : "border-gray-300 bg-transparent"
                  }`}
                style={{ borderRadius: 4 }}
              >
                {task.completed && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* TEXT */}
              <span
                className={`text-[13px] ${
                  task.completed
                    ? "line-through text-black -400"
                    : "text-gray-700"
                }`}
              >
                {task.text}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}