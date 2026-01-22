"use client";

import React, { useRef, useState, useCallback } from "react";
import { AddCircle, GalleryMinimalistic, FileText } from "@solar-icons/react";
import { AttachmentInput } from "@/types/interface/task-modal.interface";
import { TaskAttachment } from "@/types/interface/task.interface";
import { motion, AnimatePresence } from "framer-motion";

// Modular Components
import AttachmentCard from "./components/AttachmentCard";
import UploadDropzone from "./components/UploadDropzone";
import PreviewLightbox from "./components/PreviewLightbox";

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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onAddFiles(Array.from(files));
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const getFileTheme = useCallback((file: File | string) => {
        const isImage = typeof file === "string"
            ? ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(file.split("?")[0].split(".").pop()?.toLowerCase() || "")
            : file.type.startsWith("image/");

        if (isImage) {
            return {
                bg: "bg-green-700/10",
                bgStrong: "bg-green-600",
                text: "text-green-700",
                icon: <GalleryMinimalistic className="w-6 h-6" />
            };
        }
        return {
            bg: "bg-red-700/10",
            bgStrong: "bg-red-600",
            text: "text-red-700",
            icon: <FileText className="w-6 h-6" />
        };
    }, []);

    const handlePreview = useCallback((file: File | string) => {
        if (typeof file === "string") {
            const ext = file.split("?")[0].split(".").pop()?.toLowerCase();
            if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) {
                setPreviewUrl(file);
            } else {
                window.open(file, "_blank");
            }
        } else {
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            } else if (file.type === "application/pdf") {
                const url = URL.createObjectURL(file);
                window.open(url, "_blank");
            }
        }
    }, []);

    const getFileName = (file: File | string) => {
        if (typeof file === "string") {
            return file.split("?")[0].split("/").pop() || "Attachment";
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
                <h3 className="text-xs font-bold text-black/80  flex items-center gap-2">
                    <span>Attachments</span>
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">
                        {totalFiles}/10
                    </span>
                </h3>
                {canAddMore && totalFiles > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700  bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all"
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
                <UploadDropzone
                    isDragging={isDragging}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const files = e.dataTransfer.files;
                        if (files && files.length > 0) onAddFiles(Array.from(files));
                    }}
                    onClick={() => fileInputRef.current?.click()}
                />
            )}

            {/* Files List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {/* Existing Files */}
                    {existingAttachments.map((att, index) => (
                        <AttachmentCard
                            key={`existing-${index}`}
                            name={getFileName(att.url)}
                            isExisting={true}
                            theme={getFileTheme(att.url)}
                            description={att.description || ""}
                            onRemove={() => onRemoveExisting?.(index)}
                            onPreview={() => handlePreview(att.url)}
                            onUpdateDescription={(desc) => onUpdateExistingDescription?.(index, desc)}
                        />
                    ))}

                    {/* New Files */}
                    {attachments.map((att, index) => (
                        att.file && (
                            <AttachmentCard
                                key={`new-${index}`}
                                name={att.file.name}
                                size={getFileSize(att.file)}
                                isExisting={false}
                                theme={getFileTheme(att.file)}
                                description={att.description || ""}
                                onRemove={() => onRemoveAttachment(index)}
                                onPreview={() => att.file && handlePreview(att.file)}
                                onUpdateDescription={(desc) => onUpdateDescription(index, desc)}
                            />
                        )
                    ))}
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
                        <span className="text-[11px] font-bold uppercase ">Add another asset</span>
                    </motion.div>
                )}
            </div>

            <PreviewLightbox
                url={previewUrl}
                onClose={() => setPreviewUrl(null)}
            />
        </section>
    );
};

export default AttachmentsSection;
