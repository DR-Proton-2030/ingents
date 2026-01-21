"use client";
import React from "react";
import { motion } from "framer-motion";
import { useDrop } from "react-dnd";
import { AddCircle, Widget } from "@solar-icons/react";
import { ItemTypes } from "./DraggableTaskCard";
import DraggableTaskCard from "./DraggableTaskCard";

interface DroppableColumnProps {
    section: any;
    index: number;
    onDrop: (taskId: string, fromSectionId: string, toSectionId: string) => void;
    onAddTask: (sectionId: string) => void;
    onTaskClick: (task: any) => void;
    onHoverUser: (data: { id: string; name: string; rect: DOMRect } | null) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
    section,
    index,
    onDrop,
    onAddTask,
    onTaskClick,
    onHoverUser,
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
            className={`flex-shrink-0 w-80 bg-gray-50/80 mt-5 rounded-2xl overflow-hidden transition-all duration-200 ${isActive
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
                {section.tasks?.length > 0 ? (
                    section.tasks.map((task: any) => (
                        <DraggableTaskCard
                            key={task._id}
                            task={task}
                            sectionId={section.id}
                            onTaskClick={onTaskClick}
                            onHoverUser={onHoverUser}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Widget className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 font-medium">No tasks yet</p>
                    </div>
                )}
                {isActive && (
                    <div className="border-2 border-dashed border-orange-300 rounded-xl p-4 text-center bg-orange-50/50">
                        <p className="text-xs font-bold text-orange-500">Drop here</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default DroppableColumn;
