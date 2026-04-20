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

export interface WorkspaceSnapshot {
    pendingTasks: number;
    newFilesToday: number;
    prNeedsReview: number;
    tasks: string[];
    files: Array<{ name: string; when: string }>;
    activity: string[];
}

export interface DriveFileRecord {
    id?: string;
    name: string;
    modifiedTime?: string;
    createdTime?: string;
    webViewLink?: string;
}

export interface TaskRecord {
    _id?: string;
    title?: string;
    completed?: boolean;
    parent_task_object_id?: string | null;
    attachments?: Array<{ url?: string; description?: string }>;
    createdAt?: string;
    updatedAt?: string;
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
