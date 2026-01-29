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
                <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md p-6 bg-white rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                <Notes className="w-4 h-4" />
                                Description
                            </h4>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            >
                                <CloseCircle size={18} />
                            </button>
                        </div>

                        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 min-h-[120px]">
                            <EditableText
                                value={description || ""}
                                onSave={onSave}
                                placeholder="Add specific details or context..."
                                multiline
                                className="text-sm font-medium text-gray-700 italic leading-relaxed"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                             <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic leading-none">Confidential</p>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest italic leading-none">Click content to edit</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default TaskDescriptionModal;
