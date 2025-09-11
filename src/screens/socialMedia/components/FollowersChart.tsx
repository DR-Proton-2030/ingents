/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

export default function FollowersChart() {
  const bars = [
    { label: "Prototype", value: 56, percent: "+17%" },
    { label: "Wireframe", value: 28, percent: "+3%" },
    { label: "Branding", value: 92, percent: "+12%", active: true },
    { label: "UI/UX", value: 48, percent: "+24%" },
    { label: "UI/UX", value: 56, percent: "+24%", active: true },
    { label: "UI/UX", value: 56, percent: "+24%", active: true },
    { label: "UI/UX", value: 56, percent: "+24%", active: true },
  ];

  const active = bars.find((b) => (b as any).active) as
    | (typeof bars)[number]
    | undefined;
  const baselineTop = active ? `${100 - (active as any).value}%` : "65%";

  return (
    <>
      <div className="bg-white rounded-2xl px-4 border-gray-200 border mb-3 py-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Outreach Progress
        </h3>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
            In Progress
          </span>
          <button className="rounded-full bg-white/60 p-1 text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="relative flex items-start gap-10">
          <div className="flex-1">
            <div className="flex justify-between items-center px-2 mb-2 text-xs text-gray-400">
              {bars.map((b, i) => (
                <div key={i} className="flex flex-col items-center w-14">
                  <div className="flex items-center gap-1">
                    <span>{b.percent}</span>
                    {b.percent === "+12%" && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div
                style={{ top: baselineTop }}
                className="absolute left-0 right-0 border-t border-dashed border-gray-200 opacity-60"
              />

              <div className="flex items-end gap-8 py-4">
                {bars.map((b, i) => (
                  <div key={i} className="flex flex-col items-center w-14">
                    <div className="relative h-36 w-full flex items-end">
                      <div
                        className={`w-full rounded-2xl ${
                          (b as any).active
                            ? "bg-blue-600 shadow-md"
                            : "bg-slate-800"
                        } transition-all`}
                        style={{ height: `${b.value}%` }}
                      />
                    </div>
                    <div
                      className={`mt-3 text-xs ${
                        (b as any).active
                          ? "text-blue-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {b.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-32 hidden 2xl:inline flex-shrink-0">
            <div className="flex flex-col items-center gap-3">
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-600 px-3 py-1 text-xs font-semibold">
                  30 Days
                </span>
              </div>
              <div className="mt-4 text-4xl font-bold text-gray-900">230</div>
              <div className="text-sm text-gray-500 text-right">
                In Progress
                <br />
                Project in a month
              </div>
              <div className="mt-4 mb-1 flex items-center gap-2 text-sm text-gray-500">
                <button className="p-1 bg-gray-100 rounded-full hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <span>January 24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
