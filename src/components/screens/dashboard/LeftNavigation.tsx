"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useTodos from "@/hooks/useTodos";
import { Box, BoxMinimalistic } from "@solar-icons/react";

function generateDates() {
  const today = new Date();
  const dates = [];

  // Keep today on top, then future dates, then past dates for easy backtracking.
  for (let i = 0; i <= 30; i++) {
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

  for (let i = -1; i >= -30; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      date: d.getDate(),
      full: d.toISOString().split("T")[0],
      isToday: false,
    });
  }

  return dates;
}

export default function TodoUI() {
  const dates = useMemo(generateDates, []);
  const todayKey = dates.find(d => d.isToday)?.full ?? dates[0].full;
  const [activeDate, setActiveDate] = useState(todayKey);
  const [newTask, setNewTask] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { todos, loading, fetchTodos, handleCreateTodo, handleToggleTodo, handleDeleteTodo } = useTodos();

  // Fetch todos whenever the active date changes
  useEffect(() => {
    fetchTodos(activeDate);
  }, [activeDate, fetchTodos]);

  const pending = todos.filter(t => !t.completed).length;

  const onAddTask = async () => {
    const text = newTask.trim();
    if (!text) return;
    await handleCreateTodo(text, activeDate);
    setNewTask("");
    setIsAddModalOpen(false);
  };

  const onModalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onAddTask();
  };

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
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">To Do List</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {pending} tasks pending
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-[13px] hover:bg-gray-50 text-black  border border-gray-200 px-4 py-1.5 rounded-full  transition-colors"
          >
            Add
          </button>
        </div>

        {/* TASK LIST */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-xs text-gray-400 text-center py-4">Loading…</p>
          ) : todos.length === 0 ? (
            <div className="pt-10">
              <BoxMinimalistic size={74} className="text-gray-400 mx-auto" />
              <p className="text-sm text-gray-400 text-center py-4">No tasks for this day</p>
            </div>
          ) : (
            !isAddModalOpen && todos.map(task => (
              <div key={task._id} className="flex items-center gap-2.5 group">

                {/* CHECKBOX */}
                <button
                  onClick={() => handleToggleTodo(task._id, !task.completed)}
                  className={`w-5 h-5 flex-shrink-0 flex items-center rounded-full justify-center border transition-all duration-150
                    ${task.completed
                      ? "bg-black/60 border-gray-500"
                      : "border-gray-300 bg-transparent"
                    }`}
                >
                  {task.completed && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* TEXT */}
                <span
                  className={`text-[13px] flex-1 ${task.completed
                    ? "line-through text-black/40"
                    : "text-gray-700"
                    }`}
                >
                  {task.text}
                </span>

                {/* DELETE */}
                <button
                  onClick={() => handleDeleteTodo(task._id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {isAddModalOpen && (
          <div className=" z-999 flex items-center justify-center ">
            <div className="w-full ">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-500">Add Todo</h3>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewTask("");
                  }}
                  className="text-gray-400 hover:text-gray-700 bg-gray-100 p-1 rounded-md transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <input
                autoFocus
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={onModalKeyDown}
                placeholder="Add a new task..."
                className="w-full text-[14px]  rounded-lg px-3 py-2 outline-none bg-gray-100 focus:border-none transition-colors"
              />

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewTask("");
                  }}
                  className="text-[13px] px-3 py-2 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onAddTask}
                  className="text-[13px] bg-black/70 -500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}