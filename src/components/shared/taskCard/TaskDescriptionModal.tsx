"use client";
import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Notes, CloseCircle } from "@solar-icons/react";
import EditableText from "./EditableText";
import { cn } from "@/lib/utils";

interface TaskDescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    description: string;
    taskTitle: string;
    onSave: (value: string) => void;
    position: { top: number; left: number };
}

const TaskDescriptionModal: React.FC<TaskDescriptionModalProps> = ({
    isOpen,
    onClose,
    description,
    onSave,
    position,
}) => {
    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999]" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            top: position.top,
                            left: Math.min(position.left, typeof window !== 'undefined' ? window.innerWidth - 340 : position.left)
                        }}
                        className="fixed w-80 p-5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                <Notes className="w-3 h-3" />
                                Description
                            </h4>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <CloseCircle size={14} />
                            </button>
                        </div>

                        <div className="bg-gray-50/50 rounded-xl p-1 border border-gray-100/50">
                            <EditableText
                                value={description || ""}
                                onSave={onSave}
                                placeholder="Add specific details or context..."
                                multiline
                                className="text-xs font-medium text-gray-700 italic leading-relaxed"
                            />
                        </div>

                        <div className="flex justify-end">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter italic">Click content to edit</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default TaskDescriptionModal;
