import React from "react";
import Image from "next/image";
import { Plus, ChevronDown } from "lucide-react";

export const LeftNavigation = () => {
  return (
    <aside className="lg:col-span-3 space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-3">
        <div className="text-xs font-semibold text-gray-500 px-2 py-2">
          HOME
        </div>
        <nav className="space-y-1">
          {[
            { label: "Overview", active: true },
            { label: "Report Overview" },
            { label: "Manage Task" },
            { label: "Settings" },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`flex w-full items-center justify-between rounded-full px-3 py-3 text-sm ${
                item.active
                  ? "bg-purple-400 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{item.label}</span>
              <ChevronDown
                className={`h-4 w-4 ${
                  item.active ? "text-white" : "text-gray-400"
                }`}
              />
            </button>
          ))}
        </nav>
        <div className="mt-4 text-xs font-semibold text-gray-500 px-2">
          TEAM
        </div>
        <nav className="mt-1 space-y-1">
          {["Marketing and Sales", "Branding"].map((l, i) => (
            <button
              key={i}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span>{l}</span>
              <Plus className="h-4 w-4 text-gray-400" />
            </button>
          ))}
        </nav>
      </div>

      {/* Premium card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 h-44">
        {/* decorative gradient blob behind content */}
        <div className="absolute -left-6 top-6 h-24 w-24 rounded-3xl bg-gradient-to-br from-orange-400 to-red-400 blur-md z-0" />
        <div className="flex items-start justify-between">
          <div className="relative z-20">
            <h3 className="text-lg font-semibold text-gray-900">
              Get Premium Feature
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Unlock advanced controls and insights
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 relative z-20">
          <button className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
            Subscribe
          </button>
        </div>

        {/* decorative illustration - placed after content but behind via z-0 */}
        <img
          src="https://threedio-prod-var-cdn.icons8.com/dq/preview_sets/previews/G4RxBgqYmGS23tzR.webp"
          alt="decor"
          width={136}
          height={136}
          className="absolute right-0 -bottom-0 z-0 opacity-90 pointer-events-none"
        />
      </div>
    </aside>
  );
};
