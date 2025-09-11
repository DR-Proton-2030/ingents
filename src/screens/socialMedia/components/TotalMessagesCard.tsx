"use client";
import React from "react";
import { FiMoreVertical, FiGrid } from "react-icons/fi";

export default function TotalMessagesCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm relative hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Total Messages</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <FiMoreVertical />
        </button>
      </div>
      <div className="flex items-center space-x-4 mt-4">
        <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
          <FiGrid size={24} />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">234</p>
          <p className="text-sm text-gray-500">July</p>
        </div>
      </div>
      <p className="absolute bottom-4 left-6 text-xs text-gray-400">20k</p>
    </div>
  );
}
