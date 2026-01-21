"use client";
import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TrashBinMinimalistic } from "@solar-icons/react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    taskTitle,
}) => {
    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-[340px] bg-white shadow-2xl rounded-[32px] border border-white/20 overflow-hidden"
                    >
                        <div className="p-7 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-500 ring-4 ring-red-50">
                                <TrashBinMinimalistic className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">Delete Task?</h3>
                            <p className="text-sm text-gray-400 font-bold leading-relaxed px-2">
                                This will permanently remove <span className="text-gray-700 italic">"{taskTitle}"</span> and all its subtasks. This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-4 p-4 bg-gray-50/50">
                            <button
                                onClick={onClose}
                                className="flex-1 h-12 bg-white text-gray-500 rounded-full text-[10px] font-black uppercase border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="flex-[1.5] h-12 bg-red-500 text-white rounded-full text-[10px] font-black uppercase hover:bg-red-600 transition-all shadow-lg shadow-red-200 active:scale-95"
                            >
                                Delete Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default DeleteConfirmationModal;
