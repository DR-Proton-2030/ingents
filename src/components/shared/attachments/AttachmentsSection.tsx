"use client";

import React, { useRef } from "react";
import { AddCircle, CloseCircle, File, Gallery } from "@solar-icons/react";
import { AttachmentInput } from "@/types/interface/task-modal.interface";
import { TaskAttachment } from "@/types/interface/task.interface";

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onAddFiles(Array.from(files));
        }
        // Reset input so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const getFileIcon = (file: File | string) => {
        if (typeof file === "string") {
            // It's a URL, check extension
            const ext = file.split(".").pop()?.toLowerCase();
            if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) {
                return <Gallery className="w-5 h-5 text-orange-500" />;
            }
            return <File className="w-5 h-5 text-blue-500" />;
        }
        // It's a File object
        if (file.type.startsWith("image/")) {
            return <Gallery className="w-5 h-5 text-orange-500" />;
        }
        return <File className="w-5 h-5 text-blue-500" />;
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
        <section>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Attachments ({totalFiles}/10)
                </h3>
                {canAddMore && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
                    >
                        <AddCircle className="w-4 h-4" />
                        Add Files
                    </button>
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

            {totalFiles === 0 ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                >
                    <Gallery className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                        Drop files here or <span className="text-blue-500 font-medium">browse</span>
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                        Max 10 files (images, documents, etc.)
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Existing attachments (URLs) */}
                    {existingAttachments.map((att, index) => (
                        <div
                            key={`existing-${index}`}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group"
                        >
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                                {getFileIcon(att.url)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gray-700 truncate block hover:text-orange-500 transition-colors"
                                >
                                    {getFileName(att.url)}
                                </a>
                                <input
                                    type="text"
                                    placeholder="Add description..."
                                    value={att.description || ""}
                                    onChange={(e) => onUpdateExistingDescription?.(index, e.target.value)}
                                    className="text-xs text-gray-400 bg-transparent border-none outline-none w-full mt-1 placeholder:text-gray-300"
                                />
                            </div>
                            {onRemoveExisting && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveExisting(index)}
                                    className="p-1 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <CloseCircle className="w-4 h-4 text-red-400" />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* New attachments (Files) */}
                    {attachments.map((att, index) => (
                        <div
                            key={`new-${index}`}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-blue-100 group"
                        >
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-white border border-blue-100 flex items-center justify-center">
                                {att.file && getFileIcon(att.file)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">
                                    {att.file?.name}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-orange-500">
                                        {att.file && getFileSize(att.file)}
                                    </span>
                                    <span className="text-xs text-gray-300">• New</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Add description..."
                                    value={att.description || ""}
                                    onChange={(e) => onUpdateDescription(index, e.target.value)}
                                    className="text-xs text-gray-500 bg-transparent border-none outline-none w-full mt-1 placeholder:text-gray-300"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemoveAttachment(index)}
                                className="p-1 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <CloseCircle className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    ))}

                    {/* Add more button */}
                    {canAddMore && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-all"
                        >
                            + Add more files
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default AttachmentsSection;
