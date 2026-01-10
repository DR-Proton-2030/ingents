import React from "react";
import { motion } from "framer-motion";
import { IntegrationWithStatus } from "@/types/interface/integration.interface";
import { FiCheck, FiRefreshCw, FiX, FiZap, FiExternalLink, FiLock } from "react-icons/fi";

interface IntegrationCardProps {
    integration: IntegrationWithStatus;
    index: number;
    onConnect?: (integration: IntegrationWithStatus) => void;
    onView?: (integration: IntegrationWithStatus) => void;
    onDisconnect?: (integration: IntegrationWithStatus) => void;
    onReconnect?: (integration: IntegrationWithStatus) => void;
}

const platformColors: Record<string, string> = {
    Instagram: "from-[#f09433] via-[#e6683c] to-[#bc1888]",
    Facebook: "from-[#1877F2] to-[#0C63D1]",
    "Twitter / X": "from-[#000000] to-[#333333]",
    LinkedIn: "from-[#0077b5] to-[#00a0dc]",
    Reddit: "from-[#ff4500] to-[#ff5700]",
    YouTube: "from-[#FF0000] to-[#CC0000]",
};

const IntegrationCard: React.FC<IntegrationCardProps> = ({
    integration,
    index,
    onConnect,
    onView,
    onDisconnect,
    onReconnect,
}) => {
    const { isConnected, title, description, logo, comingSoon } = integration;
    const brandColor = platformColors[title] || "from-blue-600 to-indigo-600";

    return (
        <motion.div
            key={title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="h-full"
        >
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-500 p-5 h-full flex flex-col relative group overflow-hidden">
                {/* Brand Color Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${brandColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
                
                {/* Header: Status & View */}
                <div className="flex justify-between items-start mb-4">
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                        isConnected ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                        {isConnected ? "Live" : "Inactive"}
                    </div>

                    {isConnected && onView && (
                        <button 
                            onClick={() => onView(integration)}
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100"
                        >
                            <FiExternalLink size={14} />
                        </button>
                    )}
                </div>

                {/* Body: Logo & Text */}
                <div className="flex flex-col items-center mb-5 flex-grow text-center">
                    <div className="relative mb-3">
                        <div className={`absolute inset-0 bg-gradient-to-br ${brandColor} opacity-10 blur-xl rounded-full`} />
                        <div className="relative w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-50 p-3 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110">
                            {typeof logo === "string" ? (
                                <img src={logo} alt={title} className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-slate-700">{logo}</div>
                            )}
                        </div>
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 px-2">
                        {description}
                    </p>
                </div>

                {/* Footer: Actions */}
                <div className="mt-auto pt-2">
                    {comingSoon ? (
                        <div className="w-full bg-slate-50 text-slate-400 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-100/50 cursor-not-allowed text-[11px] uppercase tracking-wider">
                            <FiLock size={12} />
                            <span>Soon</span>
                        </div>
                    ) : !isConnected ? (
                        <button
                            onClick={() => onConnect?.(integration)}
                            className={`w-full bg-gradient-to-r ${brandColor} text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-xl hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 text-xs`}
                        >
                            <FiZap size={14} className="animate-pulse" />
                            <span>Connect</span>
                        </button>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => onDisconnect?.(integration)}
                                className="bg-rose-50 text-rose-600 font-bold py-2 px-1 rounded-xl hover:bg-rose-100 transition-all duration-200 text-[11px] flex items-center justify-center gap-1.5 border border-rose-100/30"
                            >
                                <FiX size={12} />
                                <span>Drop</span>
                            </button>
                            <button
                                onClick={() => onReconnect?.(integration)}
                                className="bg-indigo-50 text-indigo-600 font-bold py-2 px-1 rounded-xl hover:bg-indigo-100 transition-all duration-200 text-[11px] flex items-center justify-center gap-1.5 border border-indigo-100/30"
                            >
                                <FiRefreshCw size={12} />
                                <span>Sync</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default IntegrationCard;
