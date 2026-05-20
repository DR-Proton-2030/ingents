"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Document,
    AddCircle,
    AltArrowDown,
    CheckCircle,
    CheckRead
} from "@solar-icons/react";
import { Plus } from "lucide-react";
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
        <div className="relative flex items-center gap-2">
            {/* Title / Selected Project */}
            <div className="text-xl sm:text-2xl font-semibold text-slate-700 tracking-tight">
                {selectedProject ? selectedProject.name : "All Taks"}
            </div>

            {/* Dropdown Toggle Button (Blue Circle) */}
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all  shadow-blue-500/20 shrink-0",
                    isOpen && "ring-4 ring-blue-500/25"
                )}
                title="Select Project"
            >
                <AltArrowDown className={cn("w-4 h-4 text-white transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {/* Create Project Button (Gray Circle) */}
            <button
                onClick={onOpenCreateDrawer}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center shrink-0"
                title="Create New Project"
            >
                <Plus className="w-4 h-4 text-gray-600" />
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
                                className="fixed p-2 bg-white rounded-2xl border-2 border-gray-100 flex flex-col gap-1 overflow-hidden"
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
                                            "w-full flex items-center justify-between p-3 rounded-full transition-all text-left group/item mb-1",
                                            !selectedProjectId ? "bg-gray-100 text-blck/80" : "hover:bg-gray-50 text-gray-600"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold">All Tasks</span>
                                        </div>
                                        {!selectedProjectId && <CheckRead className="w-6 h-6 text-green-500" />}
                                    </button>

                                    {projects.map((project) => (
                                        <button
                                            key={project._id}
                                            onClick={() => {
                                                onSelectProject(project);
                                                setIsOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-full transition-all text-left group/item mb-1",
                                                selectedProjectId === project._id ? "bg-gray-100 text-blck/80" : "hover:bg-gray-50 text-gray-600"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">{project.name}</span>
                                                </div>
                                            </div>
                                            {selectedProjectId === project._id && <CheckRead className="w-6 h-6 text-green-500" />}
                                        </button>
                                    ))}
                                </div>

                                {/* <div className="mt-1 pt-1 border-t border-gray-100/50">
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
                                </div> */}
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
