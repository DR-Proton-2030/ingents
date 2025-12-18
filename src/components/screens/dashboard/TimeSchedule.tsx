import React from "react";

export const TimeSchedule = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1 text-xl font-semibold text-gray-900">
          {/* <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfZRzn2OpNq-OaU1QGcrCL9HDxi6k-4HXAyg&s"
            alt=""
            className="h-8"
          /> */}
          Time Schedule
        </h3>
        <button className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600">
          Jan 2024
        </button>
      </div>
      <div className="text-sm text-gray-700">January</div>
      <div className="mt-2 text-2xl font-bold text-gray-900">72%</div>
      <div className="text-xs text-gray-500">to full schedule</div>
      <div className="flex items-center gap-4 mt-4 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTng-UEB49X5lZhQJy93gBuc8DUnY6wFmYqnQ&s"
          alt=""
          className="h-5"
        />{" "}
        Meeting with boss
      </div>
    </div>
  );
};
