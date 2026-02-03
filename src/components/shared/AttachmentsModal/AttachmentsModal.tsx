"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gallery, CloseCircle } from "@solar-icons/react";
import { ExternalLink, FileText, Download as DownloadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttachmentsModalProps } from "@/types/interface/props/attachmentsModal.props";
import AttachmentPreviewer from "./AttachmentPreviewer";

const AttachmentsModal: React.FC<AttachmentsModalProps> = ({
    isOpen,
    onClose,
    attachments,
    position,
}) => {
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    if (typeof document === "undefined") return null;

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url, { mode: 'cors' });
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'attachment';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed, using fallback:", error);
            const separator = url.includes('?') ? '&' : '?';
            const forcedUrl = `${url}${separator}response-content-disposition=attachment&download=1`;
            
            const link = document.createElement('a');
            link.href = forcedUrl;
            link.download = filename || 'attachment';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const nextPreview = () => {
        if (previewIndex !== null) {
            setPreviewIndex((previewIndex + 1) % attachments.length);
        }
    };

    const prevPreview = () => {
        if (previewIndex !== null) {
            setPreviewIndex((previewIndex - 1 + attachments.length) % attachments.length);
        }
    };

    return createPortal(
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[99999]" onClick={onClose}>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                top: position.top,
                                left: Math.min(position.left, typeof window !== 'undefined' ? window.innerWidth - 340 : position.left)
                            }}
                            className="fixed w-80 p-5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col gap-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                    <Gallery className="w-3 h-3" />
                                    Attachments ({attachments.length})
                                </h4>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                >
                                    <CloseCircle size={14} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {attachments.map((attachment, index) => {
                                    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachment.url);
                                    const filename = attachment.description || attachment.url.split('/').pop() || 'file';
                                    return (
                                        <div 
                                            key={index}
                                            className="group relative bg-gray-50/50 hover:bg-white border border-gray-100 p-2 rounded-xl transition-all duration-300 hover:shadow-sm"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div 
                                                    className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => setPreviewIndex(index)}
                                                >
                                                    {isImage ? (
                                                        <img 
                                                            src={attachment.url} 
                                                            alt={filename} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <FileText className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-bold text-gray-700 truncate mb-0.5">
                                                        {filename}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            onClick={() => setPreviewIndex(index)}
                                                            className="inline-flex items-center gap-1 text-[10px] font-black text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider cursor-pointer"
                                                        >
                                                            View File <ExternalLink className="w-2.5 h-2.5" />
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDownload(attachment.url, filename);
                                                            }}
                                                            className="inline-flex items-center gap-1 text-[10px] font-black text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-wider cursor-pointer"
                                                        >
                                                            Download <DownloadIcon className="w-2.5 h-2.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {attachments.length === 0 && (
                                <div className="py-8 text-center">
                                    <p className="text-xs text-gray-400 italic">No attachments found</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AttachmentPreviewer 
                isOpen={previewIndex !== null}
                attachments={attachments}
                currentIndex={previewIndex ?? 0}
                onClose={() => setPreviewIndex(null)}
                onNext={nextPreview}
                onPrev={prevPreview}
                onDownload={handleDownload}
            />
        </>,
        document.body
    );
};

export default AttachmentsModal;
