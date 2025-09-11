import React from "react";
import Image from "next/image";
import { CalendarMinus } from "lucide-react";
import { BsCalendar2DateFill } from "react-icons/bs";

export const UpcomingEvent = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
            Upcoming Event
          </h3>
          <div className="text-gray-600 text-sm mt-1 font-semibold">
            Lorem ipsum dolor sit, amet consectetur
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            View Event
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Meeting Time</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  3.00 - 4.30 PM
                </div>
              </div>
            </div>
            <button className="text-gray-400 px-2 py-1 rounded-full">
              ...
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                <BsCalendar2DateFill className="h-5 w-5 text-gray-100" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Meeting Date</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  Monday, 23 Jan
                </div>
              </div>
            </div>
            <button className="text-gray-400 px-2 py-1 rounded-full">
              ...
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-700">Attendent</div>
          <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-600 px-3 py-1 text-sm font-medium">
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
                d="M12 5v14M5 12h14"
              />
            </svg>
            Send Invitation
          </button>
        </div>

        <div className="flex -space-x-3 items-center">
          {[11, 12, 13, 14, 15].map((i) => (
            <Image
              key={i}
              src={`https://i.pravatar.cc/64?img=${i}`}
              alt={`av-${i}`}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
            />
          ))}
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
            +2
          </div>
        </div>
      </div>
    </div>
  );
};
