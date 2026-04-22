import React, { useState } from "react";
import { ArchiveMinimalistic, CheckRead } from "@solar-icons/react";
import type { WorkspaceTask } from "./SmartProjectWorkspace.types";

interface DashboardTaskItemProps {
    task: WorkspaceTask;
    index: number;
    onMarkComplete?: (taskId: string) => Promise<void>;
}

export const DashboardTaskItem: React.FC<DashboardTaskItemProps> = ({ task, index, onMarkComplete }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    // We highlight the second item (index === 1) to match the premium design mockup
    const isActive = index === 1;

    const handleToggleComplete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isUpdating || !onMarkComplete) return;

        try {
            setIsUpdating(true);
            await onMarkComplete(task.id);
        } catch (error) {
            console.error("Failed to update task status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div
            className={`flex items-center justify-between px-1 py-2 rounded-2xl transition-all duration-200  `}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors bg-blue-500 text-white/80`}>
                    <ArchiveMinimalistic className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div>
                    <h4 className={`text-[15px] font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        {task.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {task.description}
                    </p>
                </div>
            </div>
            <div
                className="flex items-center cursor-pointer"
                onClick={handleToggleComplete}
                title="Mark as completed"
            >
                {task.completed ? (
                    <div className={`h-7 w-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 transition-opacity ${isUpdating ? 'opacity-50' : ''}`}>
                        <CheckRead className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                ) : (
                    <div className={`h-7 w-7 bg-gray-50 rounded-full border-2 border-gray-100 transition-all hover:border-blue-200 flex items-center justify-center ${isUpdating ? 'opacity-50' : ''}`}>
                        {isUpdating && <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                    </div>
                )}
            </div>
        </div>
    );
};
