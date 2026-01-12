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
    X: "from-[#000000] to-[#333333]",
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ x: 4 }}
        >
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 px-4 py-3 flex items-center gap-4 relative group overflow-hidden">
                {/* Brand Color Indicator - Left side */}
                <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b  opacity-70 group-hover:opacity-100 transition-opacity rounded-l-2xl`} />

                {/* Left: Logo */}
                <div className="relative flex-shrink-0 ml-2">
                    <div className={`absolute inset-0 bg-gradient-to-br ${brandColor} opacity-10 blur-lg rounded-full`} />
                    <div className="relative w-10 h-10 rounded-xl  shadow-sm border border-slate-100  flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        {typeof logo === "string" ? (
                            <img src={logo} alt={title} className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-slate-700">{logo}</div>
                        )}
                    </div>
                </div>

                {/* Center: Title, Description & Status */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {title}
                        </h3>

                    </div>

                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {isConnected && onView && (
                        <button
                            onClick={() => onView(integration)}
                            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
                        >
                            <FiExternalLink size={14} />
                        </button>
                    )}

                    {comingSoon ? (
                        <div className="bg-slate-50 text-slate-400 font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 border border-slate-100/50 cursor-not-allowed text-[10px] uppercase tracking-wider">
                            <FiLock size={11} />
                            <span>Soon</span>
                        </div>
                    ) : !isConnected ? (
                        <button
                            onClick={() => onConnect?.(integration)}
                            className={`bg-gradient-to-r ${brandColor} text-white font-bold py-2 px-5 rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300 flex items-center gap-1.5 text-xs`}
                        >

                            <span>Connect</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => onDisconnect?.(integration)}
                                className="bg-rose-50 text-rose-600 font-semibold py-2 px-3 rounded-xl hover:bg-rose-100 transition-all duration-200 text-[10px] flex items-center gap-1 border border-rose-100/30"
                            >
                                <FiX size={11} />
                                <span>Drop</span>
                            </button>
                            <button
                                onClick={() => onReconnect?.(integration)}
                                className="bg-indigo-50 text-indigo-600 font-semibold py-2 px-3 rounded-xl hover:bg-indigo-100 transition-all duration-200 text-[10px] flex items-center gap-1 border border-indigo-100/30"
                            >
                                <FiRefreshCw size={11} />
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
