import React from "react";
import { AddCircle, Magnifer } from "@solar-icons/react";

interface ProjectHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAddProject: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    onAddProject,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Magnifer className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500  transition-all placeholder:text-gray-400 placeholder:font-medium"
                    />
                </div>

                <button
                    onClick={onAddProject}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 "
                >
                    <AddCircle className="w-5 h-5 text-white" />
                    <span>Create Project</span>
                </button>
            </div>
        </div>
    );
};
