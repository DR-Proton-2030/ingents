"use client";
import React from "react";
import { X, Sparkles } from "lucide-react";
import { LayoutType } from "./types";

interface MeetingLayoutModalProps {
    layout: LayoutType;
    setLayout: (layout: LayoutType) => void;
    onClose: () => void;
}

const MeetingLayoutModal: React.FC<MeetingLayoutModalProps> = ({
    layout,
    setLayout,
    onClose,
}) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-2">
                    <h2 className="text-xl font-normal text-gray-900">Adjust view</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="px-5 pb-5">
                    <p className="text-sm text-gray-500 mb-5">
                        Selection is saved for future meetings
                    </p>

                    {/* Layout Options */}
                    <div className="space-y-4">
                        {/* Auto */}
                        <label className="flex items-center gap-4 cursor-pointer py-1 group">
                            <input
                                type="radio"
                                name="layout"
                                checked={layout === "auto"}
                                onChange={() => setLayout("auto")}
                                className="w-5 h-5 text-blue-600 accent-blue-600"
                            />
                            <div className="flex items-center gap-2 flex-1">
                                <span className="text-base text-gray-900 group-hover:text-blue-600 transition-colors">Auto (dynamic)</span>
                                <Sparkles className="w-4 h-4 text-gray-500" />
                            </div>
                        </label>

                        {/* Tiled */}
                        <label className="flex items-center gap-4 cursor-pointer py-1 group">
                            <input
                                type="radio"
                                name="layout"
                                checked={layout === "tiled"}
                                onChange={() => setLayout("tiled")}
                                className="w-5 h-5 text-blue-600 accent-blue-600"
                            />
                            <span className="text-base text-gray-900 flex-1 group-hover:text-blue-600 transition-colors">Tiled</span>
                            <div className="grid grid-cols-2 gap-0.5 w-10">
                                <div className="w-4.5 h-3.5 bg-gray-200 rounded-sm" />
                                <div className="w-4.5 h-3.5 bg-gray-200 rounded-sm" />
                                <div className="w-4.5 h-3.5 bg-gray-200 rounded-sm" />
                                <div className="w-4.5 h-3.5 bg-gray-200 rounded-sm" />
                            </div>
                        </label>

                        {/* Spotlight */}
                        <label className="flex items-center gap-4 cursor-pointer py-1 group">
                            <input
                                type="radio"
                                name="layout"
                                checked={layout === "spotlight"}
                                onChange={() => setLayout("spotlight")}
                                className="w-5 h-5 text-blue-600 accent-blue-600"
                            />
                            <span className="text-base text-gray-900 flex-1 group-hover:text-blue-600 transition-colors">Spotlight</span>
                            <div className="w-20 h-12 bg-gray-200 rounded" />
                        </label>

                        {/* Sidebar */}
                        <label className="flex items-center gap-4 cursor-pointer py-1 group">
                            <input
                                type="radio"
                                name="layout"
                                checked={layout === "sidebar"}
                                onChange={() => setLayout("sidebar")}
                                className="w-5 h-5 text-blue-600 accent-blue-600"
                            />
                            <span className="text-base text-gray-900 flex-1 group-hover:text-blue-600 transition-colors">Sidebar</span>
                            <div className="flex gap-1">
                                <div className="w-14 h-12 bg-gray-200 rounded" />
                                <div className="flex flex-col gap-0.5">
                                    <div className="w-5 h-3.5 bg-gray-200 rounded-sm" />
                                    <div className="w-5 h-3.5 bg-gray-200 rounded-sm" />
                                    <div className="w-5 h-3.5 bg-gray-200 rounded-sm" />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Hide tiles toggle */}
                    <div className="mt-5 flex items-center justify-between pt-5 border-t border-gray-100">
                        <span className="text-base text-gray-900">Hide tiles without video</span>
                        <button className="w-12 h-7 bg-gray-200 rounded-full relative transition-colors">
                            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingLayoutModal;
