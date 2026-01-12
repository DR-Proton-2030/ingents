"use client";
import React, { useState } from "react";
import Image from "next/image";

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: "Weekly Team Sync",
    description: "Discuss progress on projects",
    timeSlot: 0,
    dayIndex: 2,
    avatars: [11, 12, 13],
    dark: true,
  },
  {
    id: 2,
    title: "Onboarding Session",
    description: "Introduction for new hires",
    timeSlot: 2,
    dayIndex: 3,
    avatars: [14, 15],
    dark: false,
  },
];

export const UpcomingEvent = () => {
  const [currentMonth] = useState("September");
  const [currentYear] = useState(2024);

  const months = ["August", "September", "October"];
  const currentMonthIndex = 1;

  const days = [
    { name: "Mon", date: 22 },
    { name: "Tue", date: 23 },
    { name: "Wed", date: 24 },
    { name: "Thu", date: 25 },
    { name: "Fri", date: 26 },
    { name: "Sat", date: 27 },
  ];

  const timeSlots = ["8:00 am", "9:00 am", "10:00 am", "11:00 am"];

  const getEventForSlot = (timeSlotIndex: number, dayIndex: number) => {
    return sampleEvents.find(
      (e) => e.timeSlot === timeSlotIndex && e.dayIndex === dayIndex
    );
  };

  return (
    <div className="rounded-[18px] bg-white/30 backdrop-blur-[10px] shadow-[1px_1px_10px_4px_rgba(0,0,0,0.04)] p-4 overflow-x-auto">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 min-w-[400px]">
        <button className="rounded-full shadow bg--400  bg-white px-3 py-1.5 text-xs  font-medium text-black/80 shadow-sm">
          August
        </button>
        <h2 className="text-base font-semibold text-gray-800">
          {currentMonth} {currentYear}
        </h2>
        <button className="rounded-full shadow bg--400  bg-white px-3 py-1.5 text-xs  font-medium text-black/80 shadow-sm">
          October
        </button>
      </div>

      {/* Calendar Table */}
      <div className="min-w-[400px]">
        <table className="w-full border-collapse">
          {/* Days Header */}
          <thead>
            <tr>
              <th className="w-14 p-1"></th>
              {days.map((day, idx) => (
                <th key={idx} className="p-1 text-center">
                  <div className="text-[10px] font-medium text-gray-400">{day.name}</div>
                  <div className="text-sm font-semibold text-gray-700">{day.date}</div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Time Rows */}
          <tbody>
            {timeSlots.map((time, timeIdx) => (
              <tr key={timeIdx} className="border-t border-dashed border-orange-200/80">
                <td className="w-14 p-1 align-top">
                  <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{time}</span>
                </td>
                {days.map((_, dayIdx) => {
                  const event = getEventForSlot(timeIdx, dayIdx);
                  return (
                    <td
                      key={dayIdx}
                      className="p-0.5 align-top border-l border-dashed border-orange-200/80 h-14"
                    >
                      {event && (
                        <div
                          className={`rounded-xl p-2 h-full flex ${event.dark
                            ? "bg-gray-800 text-white"
                            : "bg-white border border-gray-100 shadow-sm"
                            }`}
                        >
                          <div className="pt-1">
                            <h4
                              className={`text-[10px] font-semibold leading-tight ${event.dark ? "text-white" : "text-gray-800"
                                }`}
                            >
                              {event.title}
                            </h4>
                            <p
                              className={`text-[7px] mt-0.5 leading-tight ${event.dark ? "text-gray-300" : "text-gray-500"
                                }`}
                            >
                              {event.description}
                            </p>
                          </div>

                          <div className="flex -space-x-1">
                            {event.avatars.map((av, i) => (
                              <Image
                                key={i}
                                src={`https://i.pravatar.cc/64?img=${av}`}
                                alt="avatar"
                                width={16}
                                height={16}
                                className={`h-6 w-6 rounded-full object-cover border ${event.dark ? "border-gray-800" : "border-white"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingEvent;
