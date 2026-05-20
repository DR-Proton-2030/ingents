import React from "react";
import type { RecentFile } from "./types";
import FileTypeIcon from "./FileTypeIcon";

export const FileCard: React.FC<{ file: RecentFile }> = ({ file }) => {
  return (
    <div className="bg-white rounded-xl p-4 transition-shadow cursor-pointer group">
      <div className="flex items-center justify-between mb-3">
        <FileTypeIcon file={file} />
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
      <h3 className="font-medium text-gray-800 mb-1 truncate">{file.name}</h3>
      <p className="text-xs text-gray-500">
        {file.date} • {file.size}
      </p>
    </div>
  );
};

export default FileCard;
