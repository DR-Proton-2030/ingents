"use client";

import React from "react";
import { motion } from "framer-motion";
import { CloudUpload } from "@solar-icons/react";

interface UploadDropzoneProps {
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onClick: () => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onClick,
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={onClick}
            className={`
        relative overflow-hidden cursor-pointer rounded-3xl p-4 
        flex flex-col items-center justify-center text-center
        transition-all duration-300 border-2 border-dashed bg-white
        ${isDragging
                    ? "border-indigo-400 bg-indigo-50/50 shadow-inner"
                    : "border-gray-200 bg-white hover:bg-gray-50 hover:border-indigo-300"
                }
      `}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-indigo-100/30 blur-3xl rounded-full pointer-events-none" />

            <motion.div
                animate={{ y: isDragging ? -5 : 0 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragging ? "bg-indigo-500 text-white" : "bg-white text-indigo-500 shadow-sm"
                    }`}
            >
                <CloudUpload className="w-8 h-8" />
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
    );
};

export default UploadDropzone;
