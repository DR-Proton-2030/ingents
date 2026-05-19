"use client";
import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AltArrowLeft, AltArrowRight } from "@solar-icons/react";
import { FileText, Download as DownloadIcon, X } from "lucide-react";
import { AttachmentPreviewerProps } from "@/types/interface/props/attachmentPreviewer.props";

const AttachmentPreviewer: React.FC<AttachmentPreviewerProps> = ({
    isOpen,
    attachments,
    currentIndex,
    onClose,
    onNext,
    onPrev,
    onDownload,
}) => {
    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
                    onClick={onClose}
                >
                    {/* Previewer Header */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between text-white bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold truncate max-w-md">
                                {attachments[currentIndex].description || attachments[currentIndex].url.split('/').pop()}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {currentIndex + 1} of {attachments.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const att = attachments[currentIndex];
                                    onDownload(att.url, att.description || att.url.split('/').pop() || 'file');
                                }}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all group cursor-pointer"
                                title="Download"
                            >
                                <DownloadIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button 
                                onClick={onClose}
                                className="p-3 bg-white/10 hover:bg-red-500/80 rounded-full transition-all group cursor-pointer"
                                title="Close"
                            >
                                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    {attachments.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                                className="absolute left-6 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all group z-10 cursor-pointer"
                            >
                                <AltArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onNext(); }}
                                className="absolute right-6 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all group z-10 cursor-pointer"
                            >
                                <AltArrowRight size={32} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </>
                    )}

                    {/* Main Content */}
                    <motion.div 
                        key={currentIndex}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {attachments[currentIndex].isImage || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(attachments[currentIndex].url) ? (
                            <img 
                                src={attachments[currentIndex].url} 
                                alt="Preview" 
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
                            />
                        ) : (
                            <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 flex flex-col items-center gap-6">
                                <FileText size={120} className="text-gray-400" />
                                <p className="text-white font-bold text-center">No visual preview available for this file type</p>
                                <button 
                                    onClick={() => onDownload(attachments[currentIndex].url, attachments[currentIndex].description || 'file')}
                                    className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <DownloadIcon size={18} /> Download Now
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default AttachmentPreviewer;
