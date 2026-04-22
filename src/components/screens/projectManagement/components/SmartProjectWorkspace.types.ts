import { Task } from "@/types/interface/task.interface";
export type { Task };

export type AppConnectionKey =
    | "drive"
    | "slack"
    | "notion"
    | "github"
    | "trello"
    | "jira"
    | "asana"
    | "todoist";

export type AutomationKey = "slackOnFile" | "taskOnPr" | "dailySummary";

export interface ProjectLite {
    _id: string;
    name: string;
    detail?: string;
}

export interface SmartProjectWorkspaceProps {
    project: ProjectLite;
    userName?: string;
}

export interface WorkspaceTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export interface WorkspaceSnapshot {
    pendingTasks: number;
    newFilesToday: number;
    prNeedsReview: number;
    tasks: WorkspaceTask[];
    files: Array<{ name: string; when: string; webViewLink?: string }>;
    activity: string[];
}

export interface DriveFileRecord {
    id?: string;
    name: string;
    modifiedTime?: string;
    createdTime?: string;
    webViewLink?: string;
}



export interface ActivityRecord {
    message?: string;
    activity_type?: string;
}

export interface IntegrationRecord {
    name: string;
    isConnected?: boolean;
    status?: string;
}

export interface WorkspaceSuggestion {
    id: string;
    title: string;
    detail: string;
    actionText: string;
    action: () => void | Promise<void>;
}
