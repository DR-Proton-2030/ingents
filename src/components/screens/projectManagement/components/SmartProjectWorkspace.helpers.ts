import {
    APP_TOOLKIT_ALIASES,
    NON_EXECUTION_TOOL_PREFIXES,
} from "./SmartProjectWorkspace.constants";
import type {
    ActivityRecord,
    AppConnectionKey,
    DriveFileRecord,
    IntegrationRecord,
    Task,
    WorkspaceSnapshot,
    WorkspaceTask,
} from "./SmartProjectWorkspace.types";

export const isActionableTool = (toolName: string) =>
    !NON_EXECUTION_TOOL_PREFIXES.some((prefix) => toolName.startsWith(prefix));

export const timeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

export const extractFirstName = (fullName?: string) => {
    if (!fullName || !fullName.trim()) return "there";
    return fullName.trim().split(" ")[0];
};

const filenameFromUrl = (url: string) => {
    try {
        const parsed = new URL(url);
        const fileName = decodeURIComponent(parsed.pathname.split("/").pop() || "");
        return fileName || "file";
    } catch {
        const fallback = decodeURIComponent(url.split("/").pop() || "");
        return fallback || "file";
    }
};

const formatWhen = (dateLike?: string | Date) => {
    if (!dateLike) return "recently";
    const parsed = new Date(dateLike);
    if (Number.isNaN(parsed.getTime())) return "recently";

    return parsed.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const parseJsonIfString = (value: unknown): unknown => {
    if (typeof value !== "string") return value;

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

export const toDriveFiles = (candidate: unknown): DriveFileRecord[] => {
    const value = parseJsonIfString(candidate) as any;
    if (!value) return [];

    if (Array.isArray(value)) {
        return value
            .map((item) => ({
                id: item?.id || item?.fileId || item?.file_id,
                name: item?.name || item?.title || item?.filename || item?.file_name,
                modifiedTime:
                    item?.modifiedTime || item?.modifiedDate || item?.modified_time || item?.updatedAt,
                createdTime:
                    item?.createdTime || item?.created_date || item?.createdAt || item?.created_at,
                webViewLink: item?.webViewLink || item?.alternateLink || item?.url,
            }))
            .filter((file) => typeof file.name === "string" && file.name.trim().length > 0) as DriveFileRecord[];
    }

    if (typeof value !== "object") return [];

    const objectValue = value as Record<string, unknown>;
    const nextCandidates = [
        objectValue["files"],
        objectValue["items"],
        objectValue["data"],
        (objectValue["data"] as any)?.files,
        (objectValue["data"] as any)?.items,
        (objectValue["data"] as any)?.data,
    ];

    for (const nextCandidate of nextCandidates) {
        const files = toDriveFiles(nextCandidate);
        if (files.length > 0) return files;
    }

    return [];
};

export const toWorkspaceTask = (task: Task): WorkspaceTask => ({
    id: task._id || Math.random().toString(36).substr(2, 9),
    title: task.title?.trim() || "Untitled Task",
    description: task.phase_info?.name || task.status || "Pending",
    completed: !!task.completed,
});

export const buildSnapshotFromLiveData = (
    allTasks: Task[],
    allActivities: ActivityRecord[],
    driveFiles: DriveFileRecord[] = []
): WorkspaceSnapshot => {
    const parentTasks = allTasks.filter((task) => !task.parent_task_object_id);
    
    // Filter for tasks that are not completed
    const pendingTasksList = parentTasks.filter((task) => {
        const isCompleted = !!task.completed || task.status === "completed" || task.phase_info?.name?.toLowerCase() === "completed";
        return !isCompleted;
    });

    const tasks: WorkspaceTask[] = pendingTasksList
        .map(toWorkspaceTask)
        .slice(0, 5); 

    const attachments = parentTasks.flatMap((task) => {
        const timestamp = (task as any).completed_at || (task as any).updatedAt || (task as any).createdAt;
        return (task.attachments || [])
            .filter((attachment) => typeof attachment.url === "string" && attachment.url.length > 0)
            .map((attachment) => ({
                name: filenameFromUrl(attachment.url as string),
                whenRaw: timestamp,
            }));
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const driveFilesSorted = [...driveFiles].sort((a, b) => {
        const aTs = new Date(a.modifiedTime || a.createdTime || 0).getTime();
        const bTs = new Date(b.modifiedTime || b.createdTime || 0).getTime();
        return bTs - aTs;
    });

    const attachmentFilesToday = attachments.filter((attachment: any) => {
        if (!attachment.whenRaw) return false;
        const date = new Date(attachment.whenRaw);
        if (Number.isNaN(date.getTime())) return false;
        return date >= todayStart;
    }).length;

    const driveFilesToday = driveFilesSorted.filter((file) => {
        const rawDate = file.modifiedTime || file.createdTime;
        if (!rawDate) return false;
        const date = new Date(rawDate);
        if (Number.isNaN(date.getTime())) return false;
        return date >= todayStart;
    }).length;

    const files =
        driveFilesSorted.length > 0
            ? driveFilesSorted.slice(0, 3).map((file) => ({
                name: file.name,
                when: formatWhen(file.modifiedTime || file.createdTime),
            }))
            : attachments.slice(0, 3).map((attachment: any) => ({
                name: attachment.name,
                when: formatWhen(attachment.whenRaw),
            }));

    const newFilesToday = driveFilesSorted.length > 0 ? driveFilesToday : attachmentFilesToday;

    const activity = allActivities
        .map((item) => item.message?.trim())
        .filter((message): message is string => Boolean(message))
        .slice(0, 3);

    const prNeedsReview = allActivities.filter((item) => {
        const row = `${item.activity_type || ""} ${item.message || ""}`.toLowerCase();
        return row.includes("pull request") || row.includes(" github ") || /\bpr\b/.test(row);
    }).length;

    return {
        pendingTasks: pendingTasksList.length,
        newFilesToday,
        prNeedsReview,
        tasks,
        files,
        activity,
    };
};

export const deriveConnectionState = (
    integrations: IntegrationRecord[]
): Record<AppConnectionKey, boolean> => {
    const isConnected = (aliases: string[]) =>
        integrations.some((integration) => {
            const name = integration.name?.toLowerCase();
            if (!name || !aliases.includes(name)) return false;

            if (integration.isConnected) return true;
            return (integration.status || "").toUpperCase() === "ACTIVE";
        });

    return {
        drive: isConnected(APP_TOOLKIT_ALIASES.drive),
        slack: isConnected(APP_TOOLKIT_ALIASES.slack),
        notion: isConnected(APP_TOOLKIT_ALIASES.notion),
        github: isConnected(APP_TOOLKIT_ALIASES.github),
        trello: isConnected(APP_TOOLKIT_ALIASES.trello),
        jira: isConnected(APP_TOOLKIT_ALIASES.jira),
        asana: isConnected(APP_TOOLKIT_ALIASES.asana),
        todoist: isConnected(APP_TOOLKIT_ALIASES.todoist),
    };
};
