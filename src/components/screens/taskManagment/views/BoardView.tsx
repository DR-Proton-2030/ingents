"use client";
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Widget, AddCircle } from "@solar-icons/react";
import { formatDate } from "@/utils/commonFunction/formatDate";
import { TaskDetailDrawer } from "@/components/shared/TaskDetailDrawer";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
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
            className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${isDragging ? "opacity-50 scale-95 shadow-2xl " : ""
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

interface DroppableColumnProps {
    section: any;
    index: number;
    children: React.ReactNode;
    onDrop: (taskId: string, fromSectionId: string, toSectionId: string) => void;
    onAddTask: (sectionId: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
    section,
    index,
    children,
    onDrop,
    onAddTask,
}) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.TASK,
        drop: (item: { taskId: string; fromSectionId: string }) => {
            if (item.fromSectionId !== section.id) {
                onDrop(item.taskId, item.fromSectionId, section.id);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [section.id, onDrop]);

    const isActive = isOver && canDrop;

    return (
        <motion.div
            ref={drop as any}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex-shrink-0 w-80 bg-gray-50/80 mt-5 rounded-2xl  overflow-hidden transition-all duration-200 ${isActive
                ? "border-orange-500 bg-orange-50/50 shadow-xl border-dashed"
                : canDrop
                    ? "border-dashed border-gray-300"
                    : "border-gray-100"
                }`}
        >
            {/* Column Header */}
            <div
                className="p-4 border-b border-gray-100"
                style={{ backgroundColor: section.color }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: section.color }}
                        />
                        <h3 className="font-bold text-white">{section?.title}</h3>
                        <span className="text-xs font-bold text-white bg-gray-200/50 px-2 py-0.5 rounded-full">
                            {section.tasks?.length || 0}
                        </span>
                    </div>
                    <button
                        onClick={() => onAddTask(section.id)}
                        className="p-1.5 hover:bg-white/20 rounded-lg text-white hover:text-white transition-all"
                    >
                        <AddCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tasks Container */}
            <div className={`p-3 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto hidescroll min-h-[100px] transition-colors ${isActive ? "bg-orange-50/30" : ""
                }`}>
                {children}
                {isActive && (
                    <div className="border-2 border-dashed border-orange-300 rounded-xl p-4 text-center bg-orange-50/50">
                        <p className="text-xs font-bold text-orange-500">Drop here</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

interface BoardViewProps {
    sections: any[];
    onAddTask: (sectionId: string) => void;
    onAddSubtask: (taskId: string) => void;
    onEditTask: (taskId: string, updates: any) => void;
    onDeleteTask: (taskId: string) => void;
    onAssignTask: (taskId: string, userId: string) => void;
    onUnassignTask: (taskId: string, userId: string) => void;
    onStatusChange?: (taskId: string, newStatusId: string) => void;
}

const BoardViewContent: React.FC<BoardViewProps> = ({
    sections,
    onAddTask,
    onAddSubtask,
    onEditTask,
    onDeleteTask,
    onAssignTask,
    onUnassignTask,
    onStatusChange,
}) => {
    const [hoveredUser, setHoveredUser] = useState<{ id: string; name: string; rect: DOMRect } | null>(null);
    const [mounted, setMounted] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDrop = useCallback((taskId: string, fromSectionId: string, toSectionId: string) => {
        if (onStatusChange) {
            onStatusChange(taskId, toSectionId);
        } else {
            // Fallback: use onEditTask to update the phase
            onEditTask(taskId, { phase_object_id: toSectionId });
        }
    }, [onStatusChange, onEditTask]);

    return (
        <>
            <div className="flex gap-4 overflow-x-auto pb-4 hidescroll">
                {sections.map((section, index) => (
                    <DroppableColumn
                        key={section.id}
                        section={section}
                        index={index}
                        onDrop={handleDrop}
                        onAddTask={onAddTask}
                    >
                        {section.tasks?.length > 0 ? (
                            section.tasks.map((task: any) => (
                                <DraggableTaskCard
                                    key={task._id}
                                    task={task}
                                    sectionId={section.id}
                                    onTaskClick={setSelectedTask}
                                    onHoverUser={setHoveredUser}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Widget className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-400 font-medium">No tasks yet</p>
                            </div>
                        )}
                    </DroppableColumn>
                ))}

                {/* Portalled Tooltip */}
                {mounted && createPortal(
                    <AnimatePresence>
                        {hoveredUser && (
                            <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                className="fixed z-[999999] px-3 py-2 bg-gray-900 text-white text-[10px] font-bold rounded-xl shadow-2xl pointer-events-none whitespace-nowrap"
                                style={{
                                    top: hoveredUser.rect.top - 40,
                                    left: hoveredUser.rect.left,
                                    transform: "translateX(-50%)",
                                }}
                            >
                                {hoveredUser.name}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-[6px] border-transparent border-t-gray-900" />
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>

            {/* Task Detail Drawer */}
            <TaskDetailDrawer
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onAddSubtask={onAddSubtask}
                onAssignTask={onAssignTask}
                onUnassignTask={onUnassignTask}
            />
        </>
    );
};

// Wrapper with DndProvider
const BoardView: React.FC<BoardViewProps> = (props) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <BoardViewContent {...props} />
        </DndProvider>
    );
};

export default BoardView;
