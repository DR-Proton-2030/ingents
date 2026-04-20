import type {
    AppConnectionKey,
    AutomationKey,
    WorkspaceSnapshot,
} from "./SmartProjectWorkspace.types";

export const APP_LABELS: Record<AppConnectionKey, { title: string; subtitle: string }> = {
    drive: { title: "Google Drive", subtitle: "manage files" },
    slack: { title: "Slack", subtitle: "team updates" },
    notion: { title: "Notion", subtitle: "documentation sync" },
    github: { title: "GitHub", subtitle: "repos and pull requests" },
    trello: { title: "Trello", subtitle: "cards and boards" },
    jira: { title: "Jira", subtitle: "issues and workflows" },
    asana: { title: "Asana", subtitle: "projects and tasks" },
    todoist: { title: "Todoist", subtitle: "personal task lists" },
};

export const APP_TOOLKIT_SLUG: Record<AppConnectionKey, string> = {
    drive: "googledrive",
    slack: "slack",
    notion: "notion",
    github: "github",
    trello: "trello",
    jira: "jira",
    asana: "asana",
    todoist: "todoist",
};

export const APP_TOOLKIT_ALIASES: Record<AppConnectionKey, string[]> = {
    drive: ["googledrive", "google_drive", "drive"],
    slack: ["slack"],
    notion: ["notion"],
    github: ["github"],
    trello: ["trello"],
    jira: ["jira", "atlassian"],
    asana: ["asana"],
    todoist: ["todoist"],
};

export const AUTOMATION_PRESETS: Array<{
    key: AutomationKey;
    title: string;
    description: string;
    trigger: string;
}> = [
    {
        key: "slackOnFile",
        title: "Notify Slack when new file added",
        description: "Posts update to your team channel instantly.",
        trigger: "drive.file_added -> slack.send_message",
    },
    {
        key: "taskOnPr",
        title: "Create task when GitHub PR opened",
        description: "Auto-creates follow-up tasks for reviewers.",
        trigger: "github.pr_opened -> task.create",
    },
    {
        key: "dailySummary",
        title: "Daily summary at 9 PM",
        description: "Sends project digest without manual check-ins.",
        trigger: "scheduler.daily_21_00 -> summary.send",
    },
];

export const NON_EXECUTION_TOOL_PREFIXES = ["COMPOSIO_SEARCH_", "COMPOSIO_MANAGE_"];

export const TASK_TOOL_KEYS: AppConnectionKey[] = ["trello", "jira", "asana", "todoist"];
export const DRIVE_LIST_ACTIONS = ["GOOGLEDRIVE_FIND_FILE", "GOOGLEDRIVE_LIST_FILES"];

export const EMPTY_SNAPSHOT: WorkspaceSnapshot = {
    pendingTasks: 0,
    newFilesToday: 0,
    prNeedsReview: 0,
    tasks: [],
    files: [],
    activity: [],
};
