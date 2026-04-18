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
                className="group flex items-center gap-3 py-2 px-4 bg-white/70 backdrop-blur-md  rounded-2xl hover:bg-white hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] transition-all active:scale-95 shadow-sm"
            >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors">
                    <Document className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                    <p className="text-sm font-bold text-gray-800">Create Project</p>
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
                    "group flex items-center gap-3 py-2 px-4 bg-white shadow-lg shadow-gray-100 backdrop-blur-md  rounded-2xl  ",
                    isOpen && "border-blue-200 bg-white ring-4 ring-blue-500/5 shadow-md"
                )}
            >

                <div className="flex flex-col text-left min-w-[80px]">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">Project</p>
                    <p className="text-sm font-black text-gray-900 leading-none truncate max-w-[120px]">
                        {selectedProject ? selectedProject.name : "Select Project"}
                    </p>
                </div>
                <AltArrowDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-500 ease-in-out", isOpen && "rotate-180 text-blue-500")} />
            </button>

            {typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[99999]" onClick={() => setIsOpen(false)}>
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                className="fixed p-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white flex flex-col gap-1 overflow-hidden"
                                style={{
                                    top: position.top,
                                    left: position.left,
                                    minWidth: position.width,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-3 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Projects</p>
                                </div>

                                <div className="max-h-64 overflow-y-auto scrollbar-hide py-1">
                                    <button
                                        onClick={() => {
                                            onSelectProject(null);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group/item mb-1",
                                            !selectedProjectId ? "bg-orange-50 text-orange-600 shadow-sm" : "hover:bg-gray-50 text-gray-600"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", !selectedProjectId ? "bg-orange-500" : "bg-gray-300")} />
                                            <span className="text-sm font-bold">All Tasks</span>
                                        </div>
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
                                                "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group/item mb-1",
                                                selectedProjectId === project._id ? "bg-blue-50 text-blue-600 shadow-sm" : "hover:bg-gray-50 text-gray-600"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-2 h-2 rounded-full", selectedProjectId === project._id ? "bg-blue-500" : "bg-gray-300")} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">{project.name}</span>
                                                </div>
                                            </div>
                                            {selectedProjectId === project._id && <CheckCircle className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-1 pt-1 border-t border-gray-100/50">
                                    <button
                                        onClick={() => {
                                            onOpenCreateDrawer();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-900 hover:text-white text-gray-700 transition-all group/add group/btn overflow-hidden relative"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                                            <AddCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold relative z-10">Create New Project</span>
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
