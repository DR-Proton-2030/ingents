import React from "react";
import { Search, ChevronDown, Calendar, X } from "lucide-react";

const users = [
  {
    name: "Konstantin Konstantinopolsky",
    username: "@konstantinkonstantinopolsky",
    avatar: "https://i.pravatar.cc/100?img=3",
    projects: 1000,
    accessExpires: "In 12 months",
    role: "Multiple roles",
    expiration: "2021.06.20",
  },
  {
    name: "Marketing group",
    username: "@marketing",
    avatar: "https://i.pravatar.cc/100?img=5",
    projects: 999,
    accessExpires: "In 3 days",
    role: "Administrator",
    expiration: "",
  },
  {
    name: "Konstantin Konstantinopolsky",
    username: "@konstantinkonstantinopolsky",
    avatar: "https://i.pravatar.cc/100?img=8",
    projects: 78,
    accessExpires: "In 2 years",
    role: "Administrator",
    expiration: "2021.06.20",
  },
];

const UserAccess = () => {
  return (
    <div className="rounded-xl  bg-white shadow-sm mt-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search"
              className="rounded-lg  bg-gray-50 py-2 pl-9 pr-4 text-sm focus:outline-none"
            />
          </div>

          {/* Roles */}
          <button className="flex items-center gap-2 rounded-lg  bg-gray-50 px-3 py-2 text-sm text-gray-700">
            Roles <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Sort */}
        <button className="flex items-center gap-2 rounded-lg  bg-gray-50 px-3 py-2 text-sm text-gray-700">
          Sort by account <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className=" bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" />
              </th>
              <th className="px-6 py-3 text-left font-medium">Account</th>
              <th className="px-6 py-3 text-left font-medium">Projects</th>
              <th className="px-6 py-3 text-left font-medium">
                Access expires
              </th>
              <th className="px-6 py-3 text-left font-medium">Role</th>
              <th className="px-6 py-3 text-left font-medium">Expiration</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>

          <tbody className="">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {/* Checkbox */}
                <td className="px-6 py-4">
                  <input type="checkbox" />
                </td>

                {/* Account */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.username}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Projects */}
                <td className="px-6 py-4 text-gray-700">
                  {user.projects}
                </td>

                {/* Access expires */}
                <td className="px-6 py-4 text-gray-700">
                  {user.accessExpires}
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                    {user.role}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </td>

                {/* Expiration */}
                <td className="px-6 py-4">
                  {user.expiration ? (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 w-fit">
                      {user.expiration}
                      <X className="h-3 w-3 text-gray-400" />
                      <Calendar className="h-3 w-3 text-gray-400" />
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-500">
                      Expiration date <Calendar className="h-3 w-3" />
                    </button>
                  )}
                </td>

                {/* Delete */}
                <td className="px-6 py-4 text-right">
                  <button className="text-sm text-indigo-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAccess;
