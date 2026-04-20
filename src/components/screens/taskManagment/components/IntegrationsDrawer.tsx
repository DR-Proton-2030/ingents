"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { IntegrationsScreen } from "../../integrations/IntegrationsScreen";

interface IntegrationsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    projectContext?: string;
}

export const IntegrationsDrawer: React.FC<IntegrationsDrawerProps> = ({ 
    isOpen, 
    onClose,
    projectContext
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />
                    
                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 w-full max-w-2xl h-full bg-white shadow-2xl z-[101] flex flex-col pt-10"
                    >
                        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
                             <h2 className="text-xl font-bold text-gray-900">Project Integrations</h2>
                             <button 
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                             >
                                <X className="h-5 w-5 text-gray-500" />
                             </button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                            <IntegrationsScreen
                                isEmbedded={true}
                                title="Apps & Automations"
                                projectContext={projectContext}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
