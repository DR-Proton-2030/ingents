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
            className="absolute inset-0 bg-black/60 flex items-center justify-center p-6 z-10"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TrashBinMinimalistic className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Task?</h3>
                    <p className="text-sm text-gray-500">
                        This will permanently remove "{taskTitle}" and all its subtasks.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-11 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-11 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
