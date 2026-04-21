import React from "react";
import { extractFirstName, timeGreeting } from "./SmartProjectWorkspace.helpers";
import type { WorkspaceSnapshot } from "./SmartProjectWorkspace.types";

interface WorkspaceOverviewProps {
    projectName: string;
    userName?: string;
    snapshot: WorkspaceSnapshot;
    automationCount: number;
}

export const WorkspaceOverview: React.FC<WorkspaceOverviewProps> = ({
    projectName,
    userName,
    snapshot,
    automationCount,
}) => {
    return (
        <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3]">
            <p className="text-lg font-semibold text-[#1E324E]">
                {timeGreeting()}, {extractFirstName(userName)}
                <span className="ml-1">Here is what is happening in "{projectName}":</span>
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="rounded-xl bg-[#F1F8FF] p-3 text-[#214368]">
                    <span className="font-semibold">{snapshot.pendingTasks}</span> pending tasks
                </div>
                <div className="rounded-xl bg-[#F5F6FF] p-3 text-[#2D3A7D]">
                    <span className="font-semibold">{snapshot.newFilesToday}</span> new files today
                </div>
                <div className="rounded-xl bg-[#FFF8F2] p-3 text-[#714821]">
                    <span className="font-semibold">{snapshot.prNeedsReview}</span> GitHub PR needs review
                </div>
                <div className="rounded-xl bg-[#FFF5F5] p-3 text-[#7E2935]">
                    {automationCount === 0
                        ? "No automations set yet"
                        : `${automationCount} automation${automationCount > 1 ? "s" : ""} active`}
                </div>
            </div>
        </div>
    );
};
