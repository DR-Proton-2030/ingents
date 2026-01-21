"use client";
import React from "react";
import { motion } from "framer-motion";
import { Widget, AddCircle } from "@solar-icons/react";

interface BoardViewProps {
    sections: any[];
    onAddTask: (sectionId: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ sections, onAddTask }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 hidescroll">
            {sections.map((section, index) => (
                <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-80 bg-gray-50/80 rounded-2xl border border-gray-100 overflow-hidden"
                >
                    {/* Column Header */}
                    <div
                        className="p-4 border-b border-gray-100"
                        style={{ backgroundColor: section.color + "10" }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: section.color }}
                                />
                                <h3 className="font-bold text-gray-800">{section.name}</h3>
                                <span className="text-xs font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full">
                                    {section.tasks?.length || 0}
                                </span>
                            </div>
                            <button
                                onClick={() => onAddTask(section.id)}
                                className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-orange-500 transition-all"
                            >
                                <AddCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="p-3 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto hidescroll">
                        {section.tasks?.length > 0 ? (
                            section.tasks.map((task: any) => (
                                <motion.div
                                    key={task._id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
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
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </span>
                                        )}
                                        {task.assignees?.length > 0 && (
                                            <div className="flex -space-x-1">
                                                {task.assignees.slice(0, 3).map((assignee: any) => (
                                                    <div
                                                        key={assignee._id}
                                                        className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-white"
                                                    >
                                                        {assignee.full_name?.charAt(0) || "?"}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Widget className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-400 font-medium">No tasks yet</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default BoardView;
