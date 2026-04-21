import React from "react";
import { Zap } from "lucide-react";
import { AUTOMATION_PRESETS } from "./SmartProjectWorkspace.constants";
import type { AutomationKey } from "./SmartProjectWorkspace.types";

interface QuickAutomationsPanelProps {
    automations: Record<AutomationKey, boolean>;
    isAssistantLoading: boolean;
    onRunAutomation: (automation: { key: AutomationKey; title: string; trigger: string }) => void;
}

export const QuickAutomationsPanel: React.FC<QuickAutomationsPanelProps> = ({
    automations,
    isAssistantLoading,
    onRunAutomation,
}) => {
    return (
        <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3]">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-[#335C98]" />
                <h3 className="text-base font-semibold text-[#1E324E]">Quick Automations</h3>
            </div>
            <div className="space-y-3">
                {AUTOMATION_PRESETS.map((automation) => {
                    const enabled = automations[automation.key];
                    return (
                        <div key={automation.key} className="rounded-xl border border-[#E4EAF4] p-3">
                            <p className="text-sm font-semibold text-[#223752]">{automation.title}</p>
                            <p className="text-sm text-[#60748F]">{automation.description}</p>
                            <p className="mt-1 text-xs text-[#8092A7]">{automation.trigger}</p>
                            <button
                                onClick={() => {
                                    if (!enabled) {
                                        onRunAutomation(automation);
                                    }
                                }}
                                disabled={enabled || isAssistantLoading}
                                className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-70 ${
                                    enabled
                                        ? "bg-[#E7F6ED] text-[#1D6D3D]"
                                        : "bg-[#1F5FDB] text-white hover:bg-[#1A4FB7]"
                                }`}
                            >
                                {enabled ? "Enabled" : "One-click activate"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
