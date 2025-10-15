"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { Lock, Plus } from "lucide-react";
import AuthContext from "@/contexts/authContext/authContext";

export const DashboardHeader = () => {
  const { user } = useContext(AuthContext);
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-gray-500">
          Manage and track your beloved project
        </p>
        <div className="mt-1 flex items-center gap-3">
          <div className="text-5xl  font-semibold  text-gray-900 flex items-center gap-3">
            <img src={user?.company_details?.logo || "/default-logo.png"} alt=""  className="h-16 w-16"/>
            {user?.company_details?.company_name || "Ingents"}
          </div>
          {/* <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-xs font-medium text-white">
            <Lock className="h-3.5 w-3.5" /> Private Access
          </span> */}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs text-gray-500">
          Last Update{" "}
          <span className="font-semibold text-gray-700">
            7:15 pm 2 Jan 2024
          </span>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Image
              key={i}
              src={`https://i.pravatar.cc/64?img=${i}`}
              alt="avatar"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full border-2 border-white object-cover"
            />
          ))}
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-600">
            8+
          </span>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Plus className="h-4 w-4" /> Invite Member
        </button>
      </div>
    </header>
  );
};
