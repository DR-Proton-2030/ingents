import React, { useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";

interface ProjectGraphProps {
    projectId: string;
}

export const ProjectGraph: React.FC<ProjectGraphProps> = ({ projectId }) => {
    const filters = useMemo(() => ({
        project_object_id: projectId,
    }), [projectId]);

    const { sections, loading } = useTasks(filters);

    const stats = useMemo(() => {
        let done = 0;
        let inProgress = 0;
        let waiting = 0;

        sections.forEach((section) => {
            const title = section.title.toLowerCase();
            if (title === "completed") {
                done = section.count;
            } else if (title === "in progress") {
                inProgress = section.count;
            } else if (title === "not started") {
                waiting = section.count;
            }
        });

        const total = done + inProgress + waiting;
        const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

        return { done, inProgress, waiting, total, percentage };
    }, [sections]);

    // Dimensions
    const size = 300;
    const strokeWidth = 40;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const halfCircumference = circumference / 2;

    // Calculate segment lengths
    const total = stats.total || 1;
    const doneLen = (stats.done / total) * halfCircumference;
    const inProgressLen = (stats.inProgress / total) * halfCircumference;

    // Rotation angles (starting from 180deg for the left side)
    const doneRotation = 180;
    const inProgressRotation = 180 + (stats.done / total) * 180;

    return (
        <div className="p-6 bg-white rounded-3xl shadow-xl shadow-gray-100 h-96 flex flex-col items-center justify-between">
            <div className="w-full text-left self-start">
                <h2 className="text-xl font-bold text-gray-900">Project progress</h2>
            </div>

            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="relative flex items-center justify-center mt-4">
                        <svg
                            width={size}
                            height={size / 2 + strokeWidth}
                            viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
                            className="overflow-visible"
                        >
                            {/* Background - Still Waiting */}
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke="#F3F4F6"
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${halfCircumference} ${circumference}`}
                                strokeLinecap="round"
                                transform={`rotate(180 ${center} ${center})`}
                            />

                            {/* On Progress Segment */}
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke="#10B981"
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${inProgressLen} ${circumference}`}
                                strokeLinecap="round"
                                style={{ transition: 'all 0.5s ease' }}
                                transform={`rotate(${inProgressRotation} ${center} ${center})`}
                            />

                            {/* Task Done Segment */}
                            <circle
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${doneLen} ${circumference}`}
                                strokeLinecap="round"
                                style={{ transition: 'all 0.5s ease' }}
                                transform={`rotate(${doneRotation} ${center} ${center})`}
                            />
                        </svg>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                            <span className="text-4xl font-bold text-gray-900 leading-none">
                                {stats.percentage}%
                            </span>
                            <span className="text-sm font-medium text-gray-400 mt-1">
                                Project Completed
                            </span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 w-full gap-2 mt-4 pt-4 border-t border-gray-50">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">{stats.done}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                <span className="text-xs text-gray-400 font-medium">Task done</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center border-x border-gray-100 px-2">
                            <span className="text-2xl font-bold text-gray-900">{stats.inProgress}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">On progress</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">{stats.waiting}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="h-2.5 w-2.5 rounded-full bg-gray-100" />
                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Still waiting</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectGraph;