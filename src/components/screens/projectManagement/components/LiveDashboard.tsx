import React from "react";
import { CheckCircle2, Clock3, FileText, LayoutGrid } from "lucide-react";
import type { WorkspaceSnapshot } from "./SmartProjectWorkspace.types";

interface LiveDashboardProps {
    snapshot: WorkspaceSnapshot;
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({ snapshot }) => {
    return (
        <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3]">
            <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="h-4 w-4 text-[#335C98]" />
                <h3 className="text-base font-semibold text-[#1E324E]">Live Dashboard</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#E4EAF4] p-4">
                    <p className="text-sm font-semibold text-[#2A3D57] mb-2">Tasks</p>
                    <ul className="space-y-2">
                        {snapshot.tasks.length > 0 ? (
                            snapshot.tasks.map((task) => (
                                <li key={task} className="text-sm text-[#5A6E88] flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#3C74D8]" />
                                    {task}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-[#8A99AC]">No pending tasks in this project.</li>
                        )}
                    </ul>
                </div>

                <div className="rounded-xl border border-[#E4EAF4] p-4">
                    <p className="text-sm font-semibold text-[#2A3D57] mb-2">Files (Drive)</p>
                    <ul className="space-y-2">
                        {snapshot.files.length > 0 ? (
                            snapshot.files.map((file) => (
                                <li key={`${file.name}-${file.when}`} className="text-sm text-[#5A6E88] flex items-start gap-2">
                                    <FileText className="h-4 w-4 mt-0.5 text-[#3C74D8]" />
                                    <span>
                                        {file.name} <span className="text-[#8495AB]">({file.when})</span>
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-[#8A99AC]">No recent file metadata in tasks.</li>
                        )}
                    </ul>
                </div>

                <div className="rounded-xl border border-[#E4EAF4] p-4">
                    <p className="text-sm font-semibold text-[#2A3D57] mb-2">Activity</p>
                    <ul className="space-y-2">
                        {snapshot.activity.length > 0 ? (
                            snapshot.activity.map((item) => (
                                <li key={item} className="text-sm text-[#5A6E88] flex items-start gap-2">
                                    <Clock3 className="h-4 w-4 mt-0.5 text-[#3C74D8]" />
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-[#8A99AC]">No recent activity yet.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};
