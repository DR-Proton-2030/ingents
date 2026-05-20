import React from "react";
import type { Folder } from "./types";

export const FolderCard: React.FC<{ folder: Folder }> = ({ folder }) => {
  return (
    <div className="bg-white rounded-xl p-4 transition-shadow cursor-pointer group">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-12 h-12 ${folder.color ?? "bg-yellow-400"
            } rounded-lg flex items-center justify-center`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
      <h3 className="font-medium text-sm text-gray-800 mb-1">{folder.name}</h3>
      <p className="text-sm text-gray-500">
        {folder.items} items • {folder.size}
      </p>
    </div>
  );
};

export default FolderCard;
