"use client";
import React from "react";

export default function FollowersOverviewCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800">Followers</h3>
      <p className="text-sm text-gray-500">Overview</p>
      <div className="flex-grow flex items-center justify-center mt-2">
        <svg width="150" height="150" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#EDE9FE"
            strokeWidth="12"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="12"
            strokeDasharray="339.29"
            strokeDashoffset="85"
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
      </div>
    </div>
  );
}
