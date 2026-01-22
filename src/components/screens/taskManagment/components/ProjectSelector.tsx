"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Document,
    AddCircle,
    AltArrowDown,
    CheckCircle
} from "@solar-icons/react";
import useProjects from "@/hooks/useProjects";
import { IProject } from "@/types/interface/project.interface";

interface ProjectSelectorProps {
    onOpenCreateDrawer: () => void;
    onSelectProject: (project: IProject | null) => void;
    selectedProjectId?: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
    onOpenCreateDrawer,
    onSelectProject,
    selectedProjectId,
}) => {
    const { projects, loading } = useProjects();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    const selectedProject = projects.find(p => p._id === selectedProjectId);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const updatePosition = () => {
                const rect = triggerRef.current?.getBoundingClientRect();
                if (rect) {
                    setPosition({
                        top: rect.bottom + 8,
                        left: rect.left,
                        width: Math.max(rect.width, 240)
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

    if (projects.length === 0 && !loading) {
        return (
            <button
                onClick={onOpenCreateDrawer}
                className="group flex items-center gap-1 py-2 px-4 bg-white/70 border shadow-sm border-gray-100 rounded-full hover:shadow-md transition-all active:scale-95"
            >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
                    <Document className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold">Create Project</p>
                </div>
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "group flex items-center gap-3 py-2 px-4 bg-white/70 border shadow-sm border-gray-100 rounded-full hover:shadow-md transition-all active:scale-95",
                    isOpen && "border-blue-200 bg-blue-50/30"
                )}
            >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
                    <Document className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex flex-col text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Project</p>
                    <p className="text-sm font-bold text-gray-800 leading-none">
                        {selectedProject ? selectedProject.name : "Select Project"}
                    </p>
                </div>
                <AltArrowDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[99999]" onClick={() => setIsOpen(false)}>
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="fixed p-2 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-1 overflow-hidden"
                                style={{
                                    top: position.top,
                                    left: position.left,
                                    minWidth: position.width,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >


                                <div className="max-h-64 overflow-y-auto scrollbar-hide py-1">
                                    <button
                                        onClick={() => {
                                            onSelectProject(null);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left",
                                            !selectedProjectId ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"
                                        )}
                                    >
                                        <span className="text-sm font-bold">All Tasks</span>
                                        {!selectedProjectId && <CheckCircle className="w-4 h-4" />}
                                    </button>

                                    {projects.map((project) => (
                                        <button
                                            key={project._id}
                                            onClick={() => {
                                                onSelectProject(project);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group/item",
                                                selectedProjectId === project._id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"
                                            )}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">{project.name}</span>
                                                {/* <span className="text-[10px] opacity-60 truncate max-w-[180px]">{project.detail}</span> */}
                                            </div>
                                            {selectedProjectId === project._id && <CheckCircle className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-1 pt-1 border-t border-gray-50">
                                    <button
                                        onClick={() => {
                                            onOpenCreateDrawer();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-all group/add"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover/add:scale-110 transition-transform">
                                            <AddCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-semibold">Create New Project</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ProjectSelector;
