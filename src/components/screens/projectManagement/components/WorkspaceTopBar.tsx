import React from "react";
import { Home, AltArrowRight, Folder, FolderPathConnect } from "@solar-icons/react";
import { motion } from "framer-motion";
import { APP_LABELS, CONNECT_APP_LOGOS } from "./SmartProjectWorkspace.constants";
import type { AppConnectionKey } from "./SmartProjectWorkspace.types";

interface WorkspaceTopBarProps {
    projectName: string;
    connections: Record<AppConnectionKey, boolean>;
    automationCount: number;
    onConnectClick: () => void;
}

export const WorkspaceTopBar: React.FC<WorkspaceTopBarProps> = ({
    projectName,
    connections,
    onConnectClick,
}) => {
    const connectedAppKeys = (Object.keys(connections) as AppConnectionKey[]).filter(
        (key) => connections[key]
    );

    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#5E738F]/70 mb-2">
                    <Home className="w-5 h-5" />
                    <AltArrowRight className="w-4 h-4 opacity-80" />
                    <span>Project Workspace</span>
                    <AltArrowRight className="w-4 h-4 opacity-80" />
                    <span className="text-[#254A7A] flex gap-2">
                        <Folder className="w-5 h-5 text-[#254A7A]" /> {projectName}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3 overflow-hidden">
                        {connectedAppKeys.map((key) => (
                            <div
                                key={key}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm mb-1"
                                title={APP_LABELS[key].title}
                            >
                                <img
                                    src={CONNECT_APP_LOGOS[key]}
                                    alt={key}
                                    className="h-7 w-7 object-contain"
                                />
                            </div>
                        ))}
                    </div>
                    <motion.button
                        layout
                        whileHover="hover"
                        onClick={onConnectClick}
                        className="group flex items-center h-11 bg-white shadow-sm rounded-full px-1 -ml-1 hover:border-blue-400 hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                        <div className="h-9 w-9 flex items-center justify-center rounded-full text-[#254A7A] group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <FolderPathConnect className="w-5 h-5" />
                        </div>
                        <motion.span
                            variants={{
                                hover: { width: "auto", opacity: 1, paddingLeft: 12, paddingRight: 12 },
                            }}
                            initial={{ width: 0, opacity: 0, paddingLeft: 0, paddingRight: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="text-sm font-semibold text-[#254A7A] whitespace-nowrap overflow-hidden"
                        >
                            Connect Apps
                        </motion.span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
