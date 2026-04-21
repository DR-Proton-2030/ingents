import React from "react";
import { Loader2, PlugZap } from "lucide-react";
import {
    APP_LABELS,
    CONNECT_APP_ICON_STYLE,
    CONNECT_APP_LOGOS,
} from "./SmartProjectWorkspace.constants";
import type { AppConnectionKey } from "./SmartProjectWorkspace.types";

interface ConnectAppsPanelProps {
    connections: Record<AppConnectionKey, boolean>;
    isIntegrationsLoading: boolean;
    onConnectApp: (appKey: AppConnectionKey) => void;
}

export const ConnectAppsPanel: React.FC<ConnectAppsPanelProps> = ({
    connections,
    isIntegrationsLoading,
    onConnectApp,
}) => {
    return (
        <div className="rounded-2xl h-[60vh] overflow-y-auto hidescroll">
            <div className="flex items-center gap-2 mb-4">
                <PlugZap className="h-4 w-4 text-[#335C98]" />
                <h3 className="text-base font-semibold text-[#1E324E]">Connect Apps</h3>
            </div>
            <div className="space-y-3 grid grid-cols-2 gap-4">
                {(Object.keys(APP_LABELS) as AppConnectionKey[]).map((appKey) => {
                    const logoUrl = CONNECT_APP_LOGOS[appKey];
                    const appTitle = APP_LABELS[appKey].title;

                    return (
                        <div
                            key={appKey}
                            className="flex items-center justify-between rounded-xl border border-[#E4EAF4] p-3"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${CONNECT_APP_ICON_STYLE[appKey]}`}
                                >
                                    <img
                                        src={logoUrl}
                                        alt={`${appTitle} logo`}
                                        className="h-8 w-8 object-contain"
                                        loading="lazy"
                                    />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-[#223752]">{appTitle}</p>
                                    <p className="text-sm text-[#60748F]">{APP_LABELS[appKey].subtitle}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (!connections[appKey]) {
                                        onConnectApp(appKey);
                                    }
                                }}
                                disabled={connections[appKey]}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-default ${connections[appKey]
                                    ? "bg-[#E7F6ED] text-[#1D6D3D]"
                                    : "bg-[#1F5FDB] text-white hover:bg-[#1A4FB7]"
                                    }`}
                            >
                                {connections[appKey] ? "Connected" : "Connect"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {isIntegrationsLoading && (
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#5C728C]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Syncing integration status...
                </div>
            )}
        </div>
    );
};
