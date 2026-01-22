"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    MenuDots,
    TrashBinMinimalistic,
    Eye,
    AddCircle
} from "@solar-icons/react";

interface TaskActionDropdownProps {
    onViewDetails: () => void;
    onDelete: () => void;
    onAddSubtask: () => void;
}

const TaskActionDropdown: React.FC<TaskActionDropdownProps> = ({
    onViewDetails,
    onDelete,
    onAddSubtask,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const updatePosition = () => {
                const rect = triggerRef.current?.getBoundingClientRect();
                if (rect) {
                    setPosition({
                        top: rect.bottom + 8,
                        left: rect.right - 180, // Offset to align right
                    });
                }
            };
            updatePosition();
            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition, true);
            return () => {
                window.removeEventListener("resize", updatePosition);
                window.removeEventListener("scroll", updatePosition, true);
            };
        }
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                ref={triggerRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={cn(
                    "p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all active:scale-90",
                    isOpen && "bg-gray-100 text-gray-600"
                )}
            >
                <MenuDots className="w-4 h-4" />
            </button>

            {typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[99999]" onClick={() => setIsOpen(false)}>
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="fixed w-44 p-2 bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-1 overflow-hidden"
                                style={{
                                    top: position.top,
                                    left: position.left,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => {
                                        onViewDetails();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-all text-left"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span className="text-xs font-bold">View details</span>
                                </button>

                                <button
                                    onClick={() => {
                                        onAddSubtask();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all text-left"
                                >
                                    <AddCircle className="w-4 h-4" />
                                    <span className="text-xs font-bold">Add subtask</span>
                                </button>

                                <div className="h-px bg-gray-50 my-1" />

                                <button
                                    onClick={() => {
                                        onDelete();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all text-left"
                                >
                                    <TrashBinMinimalistic className="w-4 h-4" />
                                    <span className="text-xs font-bold">Delete</span>
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default TaskActionDropdown;
