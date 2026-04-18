import React from "react";
import { Folder } from "@solar-icons/react";

interface EmptyStateProps {
    searchQuery: string;
    onAddProject: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onAddProject }) => {
    return (
        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
            <div className="p-6 bg-white rounded-full shadow-sm">
                <Folder className="w-12 h-12 text-gray-300" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    {searchQuery ? "Try searching for something else or clear the search." : "Start by creating your first team workspace."}
                </p>
            </div>
            {!searchQuery && (
                <button
                    onClick={onAddProject}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                >
                    Create First Project
                </button>
            )}
        </div>
    );
};
