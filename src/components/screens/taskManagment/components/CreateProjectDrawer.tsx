"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseCircle, CheckCircle, Document } from "@solar-icons/react";
import { cn } from "@/lib/utils";

interface CreateProjectDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; detail: string }) => Promise<void>;
}

const CreateProjectDrawer: React.FC<CreateProjectDrawerProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        detail: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({ name: "", detail: "" });
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[9999] transition-opacity duration-300",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div
                className={cn(
                    "absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="m-3 bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white shrink-0 rounded-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">Create New Project</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <CloseCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
                    <form id="create-project-form" onSubmit={handleSubmit} className="space-y-8 pb-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                                    <Document className="w-5 h-5 text-blue-500" />
                                </div>
                                Project Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">
                                        Project Name *
                                    </label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                        placeholder="e.g. Website Overhaul"
                                        className="w-full h-11 px-4 rounded-xl outline-none text-sm font-medium text-gray-800 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500 transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5">
                                        Detail
                                    </label>
                                    <textarea
                                        name="detail"
                                        rows={4}
                                        value={formData.detail}
                                        onChange={(e) => setFormData((p) => ({ ...p, detail: e.target.value }))}
                                        placeholder="Provide a brief description of the project..."
                                        className="w-full p-4 rounded-xl outline-none text-sm font-medium text-gray-800 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="create-project-form"
                            disabled={isSubmitting}
                            className="flex-[2] h-12 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-200"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Create Project
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CreateProjectDrawer;
