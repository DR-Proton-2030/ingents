/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

export default function StatCard({ title, time, value, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-gray-600">{title}</p>
      <p className="text-sm text-gray-400">{time}</p>
      <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}
