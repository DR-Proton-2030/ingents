"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseCircle } from "@solar-icons/react";

interface PreviewLightboxProps {
    url: string | null;
    onClose: () => void;
}

const PreviewLightbox: React.FC<PreviewLightboxProps> = ({ url, onClose }) => {
    return (
        <AnimatePresence>
            {url && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-w-5xl max-h-[90vh] flex items-center justify-center bg-white/5 p-2 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 hover:opacity-80 text-white transition-all transition-colors"
                        >
                            <CloseCircle className="w-8 h-8" />
                        </button>

                        <img
                            src={url}
                            alt="Preview"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                        />

                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Press anywhere outside to close</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PreviewLightbox;
