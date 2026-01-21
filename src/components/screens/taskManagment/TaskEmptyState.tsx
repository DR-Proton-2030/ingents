"use client";

import React from "react";

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const TaskEmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">No tasks found</h3>
      <p className="text-gray-500 mt-1 max-w-xs mx-auto">
        No tasks match your current filters or search query. Try adjusting your
        filters.
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="mt-6 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default TaskEmptyState;
