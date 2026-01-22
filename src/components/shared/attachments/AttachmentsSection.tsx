"use client";

import React, { useRef, useState } from "react";
import { AddCircle, CloseCircle, File, Gallery, GalleryMinimalistic } from "@solar-icons/react";
import { AttachmentInput } from "@/types/interface/task-modal.interface";
import { TaskAttachment } from "@/types/interface/task.interface";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileIcon, ImageIcon, X, Check, Trash2 } from "lucide-react";
import { FileText } from "@solar-icons/react/ssr";

interface AttachmentsSectionProps {
    attachments: AttachmentInput[];
    existingAttachments?: TaskAttachment[];
    onAddFiles: (files: File[]) => void;
    onRemoveAttachment: (index: number) => void;
    onRemoveExisting?: (index: number) => void;
    onUpdateDescription: (index: number, description: string) => void;
    onUpdateExistingDescription?: (index: number, description: string) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
    attachments,
    existingAttachments = [],
    onAddFiles,
    onRemoveAttachment,
    onRemoveExisting,
    onUpdateDescription,
    onUpdateExistingDescription,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onAddFiles(Array.from(files));
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onAddFiles(Array.from(files));
        }
    };

    const getFileTheme = (file: File | string) => {
        const isImage = typeof file === "string"
            ? ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(file.split(".").pop()?.toLowerCase() || "")
            : file.type.startsWith("image/");

        if (isImage) {
            return {
                bg: "bg-green-700/10",
                bgStrong: "bg-green-600",
                text: "text-green-700",
                border: "border-green-200",
                badge: "bg-green-100 text-green-700",
                icon: <GalleryMinimalistic className="w-6 h-6" />
            };
        }
        return {
            bg: "bg-red-700/10",
            bgStrong: "bg-red-600",
            text: "text-red-700",
            border: "border-red-200",
            badge: "bg-red-100 text-red-700",
            icon: <FileText className="w-6 h-6" />
        };
    };

    const getFileName = (file: File | string) => {
        if (typeof file === "string") {
            return file.split("/").pop() || "Attachment";
        }
        return file.name;
    };

    const getFileSize = (file: File) => {
        const size = file.size;
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    const totalFiles = attachments.length + existingAttachments.length;
    const canAddMore = totalFiles < 10;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span>Attachments</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                        {totalFiles}/10
                    </span>
                </h3>
                {canAddMore && totalFiles > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all"
                    >
                        Add More
                    </motion.button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Main Upload Dropzone */}
            {canAddMore && totalFiles === 0 && (
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
            relative overflow-hidden cursor-pointer rounded-3xl p-4 
            flex flex-col items-center justify-center text-center
            transition-all duration-300 border-2 border-dashed
            ${isDragging
                            ? "border-indigo-400 bg-indigo-50/50 shadow-inner"
                            : "border-gray-200 bg-gray-50/30 hover:bg-gray-50 hover:border-indigo-300"
                        }
          `}
                >
                    {/* Animated Background Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-indigo-100/30 blur-3xl rounded-full pointer-events-none" />

                    <motion.div
                        animate={{ y: isDragging ? -5 : 0 }}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragging ? "bg-indigo-500 text-white" : "bg-white text-indigo-500 shadow-sm"
                            }`}
                    >
                        <UploadCloud className="w-8 h-8" />
                    </motion.div>

                    <h4 className="text-sm font-bold text-gray-800 mb-1">
                        {isDragging ? "Drop your files here" : "Upload your assets"}
                    </h4>
                    <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
                        Drag and drop or <span className="text-indigo-600 font-bold">browse</span> your computer.
                    </p>
                    <p className="text-[9px] text-gray-400 mt-4 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100">
                        SVG, JPG, PNG, PDF
                    </p>
                </motion.div>
            )}

            {/* Files List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {/* Existing Files */}
                    {existingAttachments.map((att, index) => {
                        const theme = getFileTheme(att.url);
                        return (
                            <motion.div
                                key={`existing-${index}`}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.text}`}>
                                        {theme.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h5 className="text-xs font-bold text-gray-800 truncate">
                                                {getFileName(att.url)}
                                            </h5>
                                            <button
                                                onClick={() => onRemoveExisting?.(index)}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                className={`h-full ${theme.bgStrong}`}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
                                                Successfully Uploaded
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold">100%</span>
                                        </div>

                                        {/* Description Input for Existing Files */}
                                        <div className="mt-3 relative">
                                            <input
                                                type="text"
                                                placeholder="Add a description..."
                                                value={att.description || ""}
                                                onChange={(e) => onUpdateExistingDescription?.(index, e.target.value)}
                                                className="w-full bg-gray-50/50 border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:bg-white px-3 py-1.5 rounded-xl text-[10px] text-gray-600 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* New Files */}
                    {attachments.map((att, index) => {
                        if (!att.file) return null;
                        const theme = getFileTheme(att.file);
                        return (
                            <motion.div
                                key={`new-${index}`}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.text}`}>
                                        {theme.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h5 className="text-xs font-bold text-gray-800 truncate">
                                                {att.file?.name}
                                            </h5>
                                            <button
                                                onClick={() => onRemoveAttachment(index)}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className={`h-full bg-green-600/80`}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.bg} ${theme.text}`}>
                                                    {getFileSize(att.file)}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold tracking-wider">
                                                Ready
                                            </span>
                                        </div>

                                        {/* Description Input for New Files */}
                                        <div className="mt-3 relative">
                                            <input
                                                type="text"
                                                placeholder="Add a description..."
                                                value={att.description || ""}
                                                onChange={(e) => onUpdateDescription(index, e.target.value)}
                                                className="w-full bg-gray-50/50 border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:bg-white px-3 py-1.5 rounded-xl text-[10px] text-gray-600 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Small "Add More" box if files exist */}
                {canAddMore && totalFiles > 0 && (
                    <motion.div
                        whileHover={{ scale: 1.01, borderColor: "rgb(129, 140, 248)" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-gray-100 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 transition-all"
                    >
                        <AddCircle className="w-5 h-5" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">Add another asset</span>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default AttachmentsSection;
