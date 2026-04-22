import React from "react";
import type { WorkspaceSnapshot } from "./SmartProjectWorkspace.types";
import { DashboardTasks } from "./DashboardTasks";
import { DashboardDrive } from "./DashboardDrive";
import ProjectGraph from "./ProjectGraph";

interface LiveDashboardProps {
    snapshot: WorkspaceSnapshot;
    projectId: string;
    onTaskUpdate?: () => void;
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({ snapshot, projectId, onTaskUpdate }) => {
    return (
        <div className="my-5 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardTasks
                    projectId={projectId}
                    onTaskUpdate={onTaskUpdate}
                />
                <ProjectGraph projectId={projectId} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <DashboardDrive
                    files={snapshot.files}
                    newFilesCount={snapshot.newFilesToday}
                />
            </div>
        </div>
    );
};
