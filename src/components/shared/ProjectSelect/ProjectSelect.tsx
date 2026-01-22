"use client";

import React, { useState, useRef, useEffect } from "react";
import { Folder, AltArrowDown } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { IProject } from "@/types/interface/project.interface";

interface ProjectSelectProps {
    projects: IProject[];
    selectedProjectId?: string | null;
    onProjectChange: (id: string | null) => void;
    label?: string;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({
    projects,
    selectedProjectId,
    onProjectChange,
    label = "Project",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const currentProject = projects.find((p) => p._id === selectedProjectId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-4" ref={dropdownRef}>
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                    <Folder className="w-5 h-5 text-blue-500" />
                </div>
                {label}
            </h3>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full h-14 px-5 rounded-2xl border-2 transition-all flex items-center gap-3 active:scale-[0.98] shadow-sm bg-white group",
                        isOpen
                            ? "border-blue-400 ring-4 ring-blue-500/5"
                            : "border-gray-100 hover:border-gray-200"
                    )}
                >
                    <div className="flex flex-col items-start leading-tight text-left overflow-hidden">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">
                            Selected Project
                        </span>
                        <span className="text-sm font-bold text-gray-800 truncate w-full">
                            {currentProject?.name || "All Projects / No Project"}
                        </span>
                    </div>
                    <div className="ml-auto">
                        <AltArrowDown
                            className={cn(
                                "w-5 h-5 text-gray-400 transition-transform duration-300",
                                isOpen && "rotate-180"
                            )}
                        />
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 origin-top">
                        <div className="max-h-[240px] overflow-y-auto scrollbar-hide space-y-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onProjectChange(null);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all relative group",
                                    !selectedProjectId ? "bg-blue-50" : "hover:bg-gray-50"
                                )}
                            >
                                <span
                                    className={cn(
                                        "text-xs font-bold uppercase tracking-wider",
                                        !selectedProjectId ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
                                    )}
                                >
                                    No Project
                                </span>
                                {!selectedProjectId && (
                                    <div className="ml-auto">
                                        <Check className="w-4 h-4 text-blue-500" />
                                    </div>
                                )}
                            </button>

                            {projects.map((project) => {
                                const isActive = selectedProjectId === project._id;
                                return (
                                    <button
                                        key={project._id}
                                        type="button"
                                        onClick={() => {
                                            onProjectChange(project._id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all relative group",
                                            isActive ? "bg-blue-50" : "hover:bg-gray-50"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "text-xs font-bold uppercase tracking-wider",
                                                isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
                                            )}
                                        >
                                            {project.name}
                                        </span>
                                        {isActive && (
                                            <div className="ml-auto">
                                                <Check className="w-4 h-4 text-blue-500" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectSelect;
