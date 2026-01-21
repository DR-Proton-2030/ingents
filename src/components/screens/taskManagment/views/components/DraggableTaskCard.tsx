"use client";
import React from "react";
import { useDrag } from "react-dnd";
import { formatDate } from "@/utils/commonFunction/formatDate";

export const ItemTypes = {
    TASK: "task",
};

interface DraggableTaskCardProps {
    task: any;
    sectionId: string;
    onTaskClick: (task: any) => void;
    onHoverUser: (data: { id: string; name: string; rect: DOMRect } | null) => void;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
    task,
    sectionId,
    onTaskClick,
    onHoverUser,
}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { taskId: task._id, fromSectionId: sectionId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [task._id, sectionId]);

    return (
        <div
            ref={drag as any}
            onClick={() => onTaskClick(task)}
            className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${isDragging ? "opacity-50 scale-95 shadow-2xl ring-2 ring-orange-500" : ""
                }`}
            style={{ touchAction: "none" }}
        >
            <h4 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2">
                {task.title}
            </h4>
            {task.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                    {task.description}
                </p>
            )}
            <div className="flex items-center justify-between">
                {task.due_date && (
                    <span className="text-[10px] font-bold text-gray-400">
                        {formatDate(task.due_date)}
                    </span>
                )}
                {task.assignees?.length > 0 && (
                    <div className="flex -space-x-1" onClick={(e) => e.stopPropagation()}>
                        {task.assignees.slice(0, 3).map((assignee: any) => (
                            <div
                                key={assignee._id}
                                className="relative"
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    onHoverUser({ id: assignee._id, name: assignee.full_name || "Unknown", rect });
                                }}
                                onMouseLeave={() => onHoverUser(null)}
                            >
                                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-white overflow-hidden cursor-pointer hover:scale-110 hover:z-10 transition-transform">
                                    {assignee.profile_picture || assignee.avatar ? (
                                        <img
                                            src={assignee.profile_picture || assignee.avatar}
                                            alt={assignee.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        assignee.full_name?.charAt(0)?.toUpperCase() || "?"
                                    )}
                                </div>
                            </div>
                        ))}
                        {task.assignees.length > 3 && (
                            <div
                                className="relative"
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    onHoverUser({ id: "more", name: `+${task.assignees.length - 3} more`, rect });
                                }}
                                onMouseLeave={() => onHoverUser(null)}
                            >
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600 border-2 border-white">
                                    +{task.assignees.length - 3}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DraggableTaskCard;
