"use client";
import React, { useState } from "react";
import {
    X,
    Sparkles,
    Image as ImageIcon,
    Ban,
    ChevronRight,
    Search,
} from "lucide-react";

interface MeetingVisualEffectsProps {
    onClose: () => void;
    onApplyFilter: (filterId: string) => void;
    onApplyBackground: (bgId: string) => void;
    currentFilter?: string;
    currentBackground?: string;
}

const filters = [
    { id: "none", name: "None", style: "" },
    { id: "grayscale", name: "Black & White", style: "grayscale(1)" },
    { id: "sepia", name: "Sepia", style: "sepia(1)" },
    { id: "blur", name: "Soft Blur", style: "blur(4px)" },
    { id: "brightness", name: "Brighten", style: "brightness(1.2)" },
    { id: "contrast", name: "High Contrast", style: "contrast(1.5)" },
];

const backgrounds = [
    { id: "none", name: "None", preview: null },
    { id: "blur", name: "Blur Background", preview: "bg-gray-200" },
    { id: "office", name: "Modern Office", preview: "bg-blue-100" },
    { id: "living-room", name: "Cozy Living Room", preview: "bg-orange-100" },
    { id: "cafe", name: "Quiet Cafe", preview: "bg-amber-100" },
    { id: "space", name: "Deep Space", preview: "bg-slate-900" },
];

const MeetingVisualEffects: React.FC<MeetingVisualEffectsProps> = ({
    onClose,
    onApplyFilter,
    onApplyBackground,
    currentFilter = "none",
    currentBackground = "none"
}) => {
    const [activeTab, setActiveTab] = useState<"filters" | "backgrounds">("filters");

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-50 rounded-xl m-4 gap-1 border border-gray-100">
                <button
                    onClick={() => setActiveTab("filters")}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "filters" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <Sparkles className="w-4 h-4" />
                    Filters
                </button>
                <button
                    onClick={() => setActiveTab("backgrounds")}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "backgrounds" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <ImageIcon className="w-4 h-4" />
                    Backgrounds
                </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                {activeTab === "filters" ? (
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Color Filters</p>
                            <div className="grid grid-cols-2 gap-3">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => onApplyFilter(filter.id)}
                                        className={`group relative aspect-video rounded-xl border-2 transition-all overflow-hidden bg-gray-50 ${currentFilter === filter.id ? "border-blue-600 ring-2 ring-blue-50" : "border-transparent hover:border-gray-200"}`}
                                    >
                                        <div
                                            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80')] bg-cover bg-center"
                                            style={{ filter: filter.style }}
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute bottom-2 left-2 right-2">
                                            <span className="text-[10px] font-bold text-white drop-shadow-md truncate block bg-black/20 backdrop-blur-sm px-1.5 py-0.5 rounded">
                                                {filter.name}
                                            </span>
                                        </div>
                                        {currentFilter === filter.id && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 border-dashed">
                            <div className="flex items-center gap-3 mb-2">
                                <Search className="w-4 h-4 text-blue-600" />
                                <p className="text-sm font-bold text-blue-900">Custom Filters</p>
                            </div>
                            <p className="text-xs text-blue-700 leading-relaxed mb-3">
                                More advanced styles and AR masks coming soon to enhance your presence.
                            </p>
                            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                                Learn more about visual effects
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Background Styles</p>
                            <div className="grid grid-cols-2 gap-3">
                                {backgrounds.map((bg) => (
                                    <button
                                        key={bg.id}
                                        onClick={() => onApplyBackground(bg.id)}
                                        className={`group relative aspect-video rounded-xl border-2 transition-all overflow-hidden ${currentBackground === bg.id ? "border-blue-600 ring-2 ring-blue-50" : "border-transparent hover:border-gray-200"} ${bg.preview || "bg-gray-100"}`}
                                    >
                                        {bg.id === "none" ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Ban className="w-8 h-8 text-gray-400" />
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/40" />
                                        )}
                                        <div className="absolute bottom-2 left-2 right-2">
                                            <span className="text-[10px] font-bold text-white drop-shadow-md truncate block">
                                                {bg.name}
                                            </span>
                                        </div>
                                        {currentBackground === bg.id && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                                    <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-900">Upload custom image</p>
                                    <p className="text-[11px] text-gray-500">JPG or PNG up to 5MB</p>
                                </div>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={() => {
                        onApplyFilter("none");
                        onApplyBackground("none");
                    }}
                    className="w-full py-3 px-6 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                    Reset All Effects
                </button>
            </div>
        </div>
    );
};

export default MeetingVisualEffects;
