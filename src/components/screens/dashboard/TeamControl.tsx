"use client";
import React from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  Search as SearchIcon,
  Phone,
  MessageSquare,
  Video,
} from "lucide-react";
import useGetUsers from "@/hooks/getUsers/useGetUsers";
import { IUser } from "@/types/interface/user.interface";

export const TeamControl = () => {
  const { users } = useGetUsers();
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Team Control</h3>
        <button className="rounded-lg p-2 hover:bg-gray-50">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="relative mb-3">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          className="w-full bg-gray-100 rounded-full border border-gray-200  pl-9 pr-3 py-3 mb-3 text-sm 
          placeholder:text-gray-400 focus:outline-none"
          placeholder="Search Team"
        />
      </div>
      <div className="space-y-3">
        {users?.map((user: IUser, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={user.profile_picture}
                alt={user.full_name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user?.full_name}
                </div>
                <div className="text-xs text-gray-500">
                  {/* {m.tasks} Task handled */}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <button className="rounded-lg p-2 hover:bg-gray-50">
                <MessageSquare className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 hover:bg-gray-50">
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
