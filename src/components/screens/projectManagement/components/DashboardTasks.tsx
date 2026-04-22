import React, { useMemo, useCallback } from "react";
import { LayoutGrid } from "lucide-react";
import { ArchiveMinimalistic } from "@solar-icons/react";
import { DashboardTaskItem } from "./DashboardTaskItem";
import { useTasks } from "@/hooks/useTasks";
import type { WorkspaceTask } from "./SmartProjectWorkspace.types";

interface DashboardTasksProps {
    projectId: string;
    onTaskUpdate?: () => void;
}

const PENDING_PHASES = ["not started", "in progress"];

export const DashboardTasks: React.FC<DashboardTasksProps> = ({ projectId, onTaskUpdate }) => {
    const filters = useMemo(() => ({
        project_object_id: projectId,
    }), [projectId]);

    const { sections, phases, loading, refetchTasks, handleUpdateTask } = useTasks(filters);

    // Find the "Completed" phase id so we can move tasks there on check
    const completedPhaseId = useMemo(() => {
        const completedPhase = phases.find(
            (p: any) => p.name?.toLowerCase() === "completed"
        );
        return completedPhase?._id || null;
    }, [phases]);

    // Filter sections to only "Not Started" and "In Progress"
    const pendingTasks: WorkspaceTask[] = useMemo(() => {
        const filtered = sections
            .filter((section) => PENDING_PHASES.includes(section.title.toLowerCase()))
            .flatMap((section) => section.tasks);

        return filtered.map((task) => ({
            id: task._id,
            title: task.title?.trim() || "Untitled Task",
            description: task.phase_info?.name || task.status || "Pending",
            completed: false, // These are pending tasks — never show as completed
        }));
    }, [sections]);

    const pendingCount = useMemo(() => {
        return sections
            .filter((section) => PENDING_PHASES.includes(section.title.toLowerCase()))
            .reduce((sum, section) => sum + section.count, 0);
    }, [sections]);

    // Mark task as completed by moving it to the "Completed" phase
    const handleMarkComplete = useCallback(async (taskId: string) => {
        if (!completedPhaseId) return;
        await handleUpdateTask(taskId, {
            phase_object_id: completedPhaseId,
            completed: true,
            completed_at: new Date(),
        });
        onTaskUpdate?.();
    }, [completedPhaseId, handleUpdateTask, onTaskUpdate]);

    return (
        <div className="p-6 bg-white rounded-3xl shadow-xl shadow-gray-100 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Project Tasks</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        {loading ? "Loading..." : `${pendingCount} tasks pending in this project`}
                    </p>
                </div>
                <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
                    <LayoutGrid className="h-5 w-5" />
                </div>
            </div>

            <div className="space-y-2 flex-grow overflow-y-auto pr-1 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                        <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400 mt-3">Loading tasks...</p>
                    </div>
                ) : pendingTasks.length > 0 ? (
                    pendingTasks.map((task, index) => (
                        <DashboardTaskItem
                            key={task.id}
                            task={task}
                            index={index}
                            onMarkComplete={handleMarkComplete}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                            <ArchiveMinimalistic className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400">No pending tasks in this project.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
