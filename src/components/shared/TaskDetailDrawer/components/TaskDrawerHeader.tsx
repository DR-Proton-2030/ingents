"use client";
import React from "react";
import { CheckCircle, TrashBinMinimalistic } from "@solar-icons/react";
import { Share2, Paperclip, Maximize2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDrawerHeaderProps {
    phaseName: string;
    onSave: () => void;
    onDeleteClick: () => void;
    onClose: () => void;
    onAddAttachmentClick?: () => void;
}

export const TaskDrawerHeader: React.FC<TaskDrawerHeaderProps> = ({
    phaseName,
    onSave,
    onDeleteClick,
    onClose,
    onAddAttachmentClick,
}) => {
    const isCompleted = phaseName.toLowerCase().includes("complete") || phaseName.toLowerCase().includes("done");

    return (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-end bg-white shrink-0">


            <div className="flex items-center gap-2">
                <button type="button" className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                    <Share2 className="w-4.5 h-4.5" />
                </button>
                <button
                    type="button"
                    onClick={onAddAttachmentClick}
                    className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                    <Paperclip className="w-4.5 h-4.5" />
                </button>

                <button type="button" onClick={onDeleteClick} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete Task">
                    <TrashBinMinimalistic className="w-4.5 h-4.5" />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <button type="button" onClick={onClose} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
