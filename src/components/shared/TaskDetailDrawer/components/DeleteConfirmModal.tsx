"use client";
import React from "react";
import { TrashBinMinimalistic } from "@solar-icons/react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    taskTitle: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    taskTitle,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-[10001]"
            onClick={onClose}
        >
            <div
                className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border border-gray-100/80 p-6 max-w-[340px] w-full flex flex-col items-center text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-600 transition-transform duration-300 hover:scale-105">
                    <TrashBinMinimalistic className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-2">Delete task?</h3>
                
                <p className="text-sm text-gray-500 font-normal leading-relaxed mb-6 px-1">
                    Are you sure you want to permanently delete <span className="font-semibold text-gray-800">"{taskTitle}"</span>? This will also remove all its subtasks. This action cannot be undone.
                </p>

                <div className="flex gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-11 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 font-medium text-sm rounded-full transition-all duration-200 flex items-center justify-center border border-gray-200/60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-sm rounded-full transition-all duration-200 flex items-center justify-center shadow-lg shadow-rose-600/10 active:scale-[0.98]"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
