import React from "react";
import { Mail, Calendar, FileText, Users, Settings, Plus } from "lucide-react";

interface AppItem {
  icon: React.ReactNode;
  name: string;
  color: string;
  href?: string;
  notification?: number;
}

const apps: AppItem[] = [
  {
    icon: <Mail className="w-4 h-4" />,
    name: "Mail",
    color: "bg-blue-500",
    notification: 5,
  },
  {
    icon: <Calendar className="w-4 h-4" />,
    name: "Calendar",
    color: "bg-green-500",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    name: "Documents",
    color: "bg-purple-500",
  },
  {
    icon: <Users className="w-4 h-4" />,
    name: "Teams",
    color: "bg-orange-500",
    notification: 2,
  },
  {
    icon: <Settings className="w-4 h-4" />,
    name: "Admin",
    color: "bg-gray-500",
  },
];

export default function AppBar() {
  return (
    <aside className="w-16 bg-gray-50 border-l border-gray-200 fixed right-0 top-16 bottom-0 z-40 flex flex-col">
      {/* Apps Grid */}
      <div className="flex-1 p-2 space-y-2">
        {apps.map((app, index) => (
          <div key={index} className="relative group">
            <button
              className={`w-12 h-12 ${app.color} rounded-lg flex items-center justify-center text-white hover:scale-105 transition-transform duration-200 shadow-sm`}
              title={app.name}
            >
              {app.icon}
              {app.notification && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {app.notification}
                </span>
              )}
            </button>

            {/* Tooltip */}
            <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {app.name}
            </div>
          </div>
        ))}

        {/* Add More Apps Button */}
        <button
          className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors duration-200"
          title="Add App"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-gray-200">
        <button
          className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          title="All Apps"
        >
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
          </div>
        </button>
      </div>
    </aside>
  );
}
