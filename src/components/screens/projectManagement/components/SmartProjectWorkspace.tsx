import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    Bot,
    CheckCircle2,
    Clock3,
    FileText,
    GitPullRequest,
    LayoutGrid,
    Loader2,
    PlugZap,
    Sparkles,
    Zap,
} from "lucide-react";
import { api } from "@/utils/api";

type AppConnectionKey = "drive" | "slack" | "notion" | "github";
type AutomationKey = "slackOnFile" | "taskOnPr" | "dailySummary";

interface ProjectLite {
    _id: string;
    name: string;
    detail?: string;
}

interface SmartProjectWorkspaceProps {
    project: ProjectLite;
    userName?: string;
}

interface WorkspaceSnapshot {
    pendingTasks: number;
    newFilesToday: number;
    prNeedsReview: number;
    tasks: string[];
    files: Array<{ name: string; when: string }>;
    activity: string[];
}

interface TaskRecord {
    _id?: string;
    title?: string;
    completed?: boolean;
    parent_task_object_id?: string | null;
    attachments?: Array<{ url?: string; description?: string }>;
    createdAt?: string;
    updatedAt?: string;
}

interface ActivityRecord {
    message?: string;
    activity_type?: string;
}

interface IntegrationRecord {
    name: string;
    isConnected?: boolean;
    status?: string;
}

const APP_LABELS: Record<AppConnectionKey, { title: string; subtitle: string }> = {
    drive: { title: "Google Drive", subtitle: "manage files" },
    slack: { title: "Slack", subtitle: "team updates" },
    notion: { title: "Notion", subtitle: "documentation sync" },
    github: { title: "GitHub", subtitle: "repos and pull requests" },
};

const APP_TOOLKIT_SLUG: Record<AppConnectionKey, string> = {
    drive: "googledrive",
    slack: "slack",
    notion: "notion",
    github: "github",
};

const APP_TOOLKIT_ALIASES: Record<AppConnectionKey, string[]> = {
    drive: ["googledrive", "google_drive", "drive"],
    slack: ["slack"],
    notion: ["notion"],
    github: ["github"],
};

const AUTOMATION_PRESETS: Array<{
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

const EMPTY_SNAPSHOT: WorkspaceSnapshot = {
    pendingTasks: 0,
    newFilesToday: 0,
    prNeedsReview: 0,
    tasks: [],
    files: [],
    activity: [],
};

const timeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const extractFirstName = (fullName?: string) => {
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

const formatWhen = (dateLike?: string) => {
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

const buildSnapshotFromLiveData = (
    allTasks: TaskRecord[],
    allActivities: ActivityRecord[]
): WorkspaceSnapshot => {
    const parentTasks = allTasks.filter((task) => !task.parent_task_object_id);
    const pendingTasksList = parentTasks.filter((task) => !task.completed);

    const tasks = pendingTasksList
        .map((task) => task.title?.trim())
        .filter((title): title is string => Boolean(title))
        .slice(0, 4);

    const attachments = parentTasks.flatMap((task) => {
        const timestamp = task.updatedAt || task.createdAt;
        return (task.attachments || [])
            .filter((attachment) => typeof attachment.url === "string" && attachment.url.length > 0)
            .map((attachment) => ({
                name: filenameFromUrl(attachment.url as string),
                whenRaw: timestamp,
            }));
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newFilesToday = attachments.filter((attachment) => {
        if (!attachment.whenRaw) return false;
        const date = new Date(attachment.whenRaw);
        if (Number.isNaN(date.getTime())) return false;
        return date >= todayStart;
    }).length;

    const files = attachments.slice(0, 3).map((attachment) => ({
        name: attachment.name,
        when: formatWhen(attachment.whenRaw),
    }));

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

const deriveConnectionState = (
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
    };
};

export const SmartProjectWorkspace: React.FC<SmartProjectWorkspaceProps> = ({
    project,
    userName,
}) => {
    const [connections, setConnections] = useState<Record<AppConnectionKey, boolean>>({
        drive: false,
        slack: false,
        notion: false,
        github: false,
    });
    const [automations, setAutomations] = useState<Record<AutomationKey, boolean>>({
        slackOnFile: false,
        taskOnPr: false,
        dailySummary: false,
    });
    const [assistantPrompt, setAssistantPrompt] = useState("");
    const [assistantReply, setAssistantReply] = useState(
        "Ask your project anything: pending items, today's summary, or urgent blockers."
    );
    const [isIntegrationsLoading, setIsIntegrationsLoading] = useState(false);
    const [isSnapshotLoading, setIsSnapshotLoading] = useState(false);
    const [isAssistantLoading, setIsAssistantLoading] = useState(false);
    const [integrationError, setIntegrationError] = useState<string | null>(null);
    const [snapshotError, setSnapshotError] = useState<string | null>(null);
    const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>(EMPTY_SNAPSHOT);

    useEffect(() => {
        setConnections({
            drive: false,
            slack: false,
            notion: false,
            github: false,
        });
        setAutomations({
            slackOnFile: false,
            taskOnPr: false,
            dailySummary: false,
        });
        setSnapshot(EMPTY_SNAPSHOT);
        setIntegrationError(null);
        setSnapshotError(null);
        setAssistantPrompt("");
        setAssistantReply(
            `Workspace ready for ${project.name}. I can summarize progress or surface urgent issues.`
        );

        let isCancelled = false;

        const fetchIntegrations = async () => {
            setIsIntegrationsLoading(true);
            try {
                const response = await api.integration.getIntegrations(project._id);
                const items = Array.isArray(response) ? response : [];

                if (!isCancelled) {
                    setConnections(deriveConnectionState(items));
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error("Failed to sync integrations:", error);
                    setIntegrationError("Could not refresh integration status.");
                    setConnections({ drive: false, slack: false, notion: false, github: false });
                }
            } finally {
                if (!isCancelled) {
                    setIsIntegrationsLoading(false);
                }
            }
        };

        const fetchWorkspaceSnapshot = async () => {
            setIsSnapshotLoading(true);
            try {
                const [tasksResult, activitiesResult] = await Promise.allSettled([
                    api.task.getTasks({ project_object_id: project._id, limit: 100 }),
                    api.activity.getActivities(30),
                ]);

                if (isCancelled) return;

                const tasksData =
                    tasksResult.status === "fulfilled"
                        ? Array.isArray(tasksResult.value?.data)
                            ? (tasksResult.value.data as TaskRecord[])
                            : []
                        : [];

                const activityData =
                    activitiesResult.status === "fulfilled"
                        ? Array.isArray(activitiesResult.value?.data)
                            ? (activitiesResult.value.data as ActivityRecord[])
                            : []
                        : [];

                if (tasksResult.status === "rejected" && activitiesResult.status === "rejected") {
                    setSnapshotError("Could not load project metrics right now.");
                    setSnapshot(EMPTY_SNAPSHOT);
                    return;
                }

                setSnapshot(buildSnapshotFromLiveData(tasksData, activityData));
            } catch (error) {
                if (!isCancelled) {
                    console.error("Failed to load project workspace snapshot:", error);
                    setSnapshotError("Could not load project metrics right now.");
                    setSnapshot(EMPTY_SNAPSHOT);
                }
            } finally {
                if (!isCancelled) {
                    setIsSnapshotLoading(false);
                }
            }
        };

        void fetchIntegrations();
        void fetchWorkspaceSnapshot();

        return () => {
            isCancelled = true;
        };
    }, [project._id, project.name]);

    const automationCount = useMemo(
        () => Object.values(automations).filter(Boolean).length,
        [automations]
    );

    const requestAssistant = useCallback(
        async (prompt: string) => {
            setIsAssistantLoading(true);
            try {
                const response = await api.virtualAssistant.chatWithAssistant(
                    [{ role: "user", content: prompt }],
                    project._id
                );
                const reply = response?.message;
                const usedTools = Array.isArray(response?.usedTools) ? response.usedTools : [];

                setAssistantReply(
                    typeof reply === "string" && reply.trim()
                        ? reply
                        : "I could not generate a response. Please try again."
                );
                return {
                    ok: true,
                    usedToolCount: usedTools.length,
                };
            } catch (error) {
                console.error("Assistant request failed:", error);
                setAssistantReply(
                    "I could not complete that action right now. Please check your integrations and try again."
                );
                return {
                    ok: false,
                    usedToolCount: 0,
                };
            } finally {
                setIsAssistantLoading(false);
            }
        },
        [project._id]
    );

    const handleConnectApp = useCallback(async (key: AppConnectionKey) => {
        if (connections[key]) return;

        try {
            const redirectUrl = typeof window !== "undefined" ? window.location.href : undefined;
            const response = await api.integration.initiateConnection(
                APP_TOOLKIT_SLUG[key],
                redirectUrl,
                project._id
            );

            const authUrl = response?.authUrl;
            if (typeof authUrl === "string" && authUrl) {
                window.location.href = authUrl;
                return;
            }

            setAssistantReply(
                `${APP_LABELS[key].title} did not return an authorization URL. Please try again.`
            );
        } catch (error) {
            console.error(`Failed to connect ${key}:`, error);
            setAssistantReply(
                `Could not start ${APP_LABELS[key].title} connection. Please try again.`
            );
        }
    }, [connections, project._id]);

    const runAutomationPreset = useCallback(
        async (preset: { key: AutomationKey; title: string; trigger: string }) => {
            const result = await requestAssistant(
                `Run this quick automation for project ${project.name}: ${preset.title}. Trigger definition: ${preset.trigger}. If any connection is missing, tell me exactly which app to connect.`
            );

            if (result.ok && result.usedToolCount > 0) {
                setAutomations((prev) => ({ ...prev, [preset.key]: true }));
            } else if (result.ok) {
                setAssistantReply(
                    "No external tool action was executed for this preset yet. Connect required apps and try again."
                );
            }
        },
        [project.name, requestAssistant]
    );

    const suggestions = useMemo(() => {
        const list: Array<{
            id: string;
            title: string;
            detail: string;
            actionText: string;
            action: () => void | Promise<void>;
        }> = [];

        if (!connections.drive) {
            list.push({
                id: "connect-drive",
                title: "Connect Google Drive",
                detail: "Auto-manage files and detect uploads.",
                actionText: "Connect",
                action: () => handleConnectApp("drive"),
            });
        }

        if (!connections.slack) {
            list.push({
                id: "connect-slack",
                title: "Connect Slack",
                detail: "Push team updates where collaboration already happens.",
                actionText: "Connect",
                action: () => handleConnectApp("slack"),
            });
        }

        if (automationCount === 0) {
            list.push({
                id: "create-workflow",
                title: "Create task workflow",
                detail: "Start with one-click automation templates.",
                actionText: "Enable",
                action: () =>
                    runAutomationPreset({
                        key: "taskOnPr",
                        title: "Create task when GitHub PR opened",
                        trigger: "github.pr_opened -> task.create",
                    }),
            });
        }

        if (snapshot.pendingTasks > 3 && !automations.dailySummary) {
            list.push({
                id: "daily-summary",
                title: "Enable daily summary",
                detail: "Get one digest at 9 PM so nothing slips.",
                actionText: "Activate",
                action: () =>
                    runAutomationPreset({
                        key: "dailySummary",
                        title: "Daily summary at 9 PM",
                        trigger: "scheduler.daily_21_00 -> summary.send",
                    }),
            });
        }

        return list.slice(0, 3);
    }, [
        automationCount,
        automations.dailySummary,
        connections.drive,
        connections.slack,
        handleConnectApp,
        runAutomationPreset,
        snapshot.pendingTasks,
    ]);

    const notifications = useMemo(() => {
        const result = [
            snapshot.newFilesToday > 0
                ? `${snapshot.newFilesToday} new file${snapshot.newFilesToday > 1 ? "s" : ""} uploaded`
                : "No files uploaded today",
            snapshot.pendingTasks > 2
                ? `${snapshot.pendingTasks} tasks pending review`
                : "Task flow looks healthy",
        ];

        if (snapshot.prNeedsReview > 0) {
            result.push("A GitHub PR is waiting for review");
        }

        if (automationCount === 0) {
            result.push("No automation active yet");
        }

        if (isIntegrationsLoading) {
            result.push("Refreshing app connections...");
        }

        if (integrationError) {
            result.push(integrationError);
        }

        if (isSnapshotLoading) {
            result.push("Refreshing project metrics...");
        }

        if (snapshotError) {
            result.push(snapshotError);
        }

        return result;
    }, [
        automationCount,
        integrationError,
        isIntegrationsLoading,
        isSnapshotLoading,
        snapshotError,
        snapshot.newFilesToday,
        snapshot.pendingTasks,
        snapshot.prNeedsReview,
    ]);

    const onSubmitAssistant = async (event: React.FormEvent) => {
        event.preventDefault();
        const prompt = assistantPrompt.trim();
        if (!prompt) return;

        setAssistantPrompt("");
        await requestAssistant(prompt);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-[#D8DFEA] bg-gradient-to-b from-[#FBFDFF] to-[#F5F8FE] p-6 md:p-8 space-y-6"
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5E738F]">
                        Project Workspace
                    </p>
                    <h2 className="text-2xl font-semibold text-[#1B2B44] mt-1">
                        Project: {project.name}
                    </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#254A7A] border border-[#CFE0F7]">
                        <PlugZap className="h-4 w-4" />
                        {Object.values(connections).filter(Boolean).length} app
                        {Object.values(connections).filter(Boolean).length === 1 ? "" : "s"} connected
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#3E4B5E] border border-[#DAE2EE]">
                        <Zap className="h-4 w-4" />
                        {automationCount} automation{automationCount === 1 ? "" : "s"} live
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3]">
                <p className="text-lg font-semibold text-[#1E324E]">
                    {timeGreeting()}, {extractFirstName(userName)}
                    <span className="ml-1">Here is what is happening in "{project.name}":</span>
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 rounded-2xl bg-white p-5 border border-[#DFE7F3]">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-4 w-4 text-[#335C98]" />
                        <h3 className="text-base font-semibold text-[#1E324E]">Suggested for you</h3>
                    </div>
                    <div className="space-y-3">
                        {suggestions.length > 0 ? (
                            suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    className="flex flex-col gap-2 rounded-xl border border-[#E4EAF4] p-3 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-[#223752]">{suggestion.title}</p>
                                        <p className="text-sm text-[#60748F]">{suggestion.detail}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            void suggestion.action();
                                        }}
                                        className="self-start rounded-lg bg-[#1F5FDB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A4FB7] transition-colors"
                                    >
                                        {suggestion.actionText}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-[#5A6E88]">Everything is connected and optimized for now.</p>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3]">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="h-4 w-4 text-[#335C98]" />
                        <h3 className="text-base font-semibold text-[#1E324E]">Auto Notifications</h3>
                    </div>
                    <ul className="space-y-2">
                        {notifications.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-[#536980]">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3478F6]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
                                                void runAutomationPreset(automation);
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

                <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3]">
                    <div className="flex items-center gap-2 mb-4">
                        <PlugZap className="h-4 w-4 text-[#335C98]" />
                        <h3 className="text-base font-semibold text-[#1E324E]">Connect Apps</h3>
                    </div>
                    <div className="space-y-3">
                        {(Object.keys(APP_LABELS) as AppConnectionKey[]).map((appKey) => (
                            <div
                                key={appKey}
                                className="flex items-center justify-between rounded-xl border border-[#E4EAF4] p-3"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-[#223752]">{APP_LABELS[appKey].title}</p>
                                    <p className="text-sm text-[#60748F]">{APP_LABELS[appKey].subtitle}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!connections[appKey]) {
                                            void handleConnectApp(appKey);
                                        }
                                    }}
                                    disabled={connections[appKey]}
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-default ${
                                        connections[appKey]
                                            ? "bg-[#E7F6ED] text-[#1D6D3D]"
                                            : "bg-[#1F5FDB] text-white hover:bg-[#1A4FB7]"
                                    }`}
                                >
                                    {connections[appKey] ? "Connected" : "Connect"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {isIntegrationsLoading && (
                        <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#5C728C]">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Syncing integration status...
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3] space-y-4">
                <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-[#335C98]" />
                    <h3 className="text-base font-semibold text-[#1E324E]">AI Project Assistant</h3>
                </div>

                <form onSubmit={onSubmitAssistant} className="flex flex-col gap-3 md:flex-row">
                    <input
                        value={assistantPrompt}
                        onChange={(event) => setAssistantPrompt(event.target.value)}
                        placeholder='Ask your project... "What is pending?"'
                        className="flex-1 rounded-xl border border-[#D2DCEC] px-4 py-3 text-sm text-[#223752] outline-none focus:ring-2 focus:ring-[#BFD6FF]"
                    />
                    <button
                        type="submit"
                        disabled={isAssistantLoading}
                        className="rounded-xl bg-[#1F5FDB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1A4FB7] transition-colors disabled:opacity-70"
                    >
                        {isAssistantLoading ? "Thinking..." : "Ask Assistant"}
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {[
                        "What's pending?",
                        "Summarize today's work",
                        "Any urgent issues?",
                    ].map((prompt) => (
                        <button
                            key={prompt}
                            onClick={() => {
                                setAssistantPrompt(prompt);
                                void requestAssistant(prompt);
                            }}
                            className="rounded-full border border-[#D8E3F6] bg-[#F6F9FF] px-3 py-1.5 text-xs font-medium text-[#335C98] hover:bg-[#EAF1FF]"
                            type="button"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl bg-[#F7FAFF] border border-[#DCE7F8] p-4 text-sm text-[#2F4766]">
                    <div className="flex items-center gap-2 text-[#335C98] font-semibold mb-1">
                        <GitPullRequest className="h-4 w-4" />
                        Assistant response
                    </div>
                    {assistantReply}
                </div>
            </div>
        </motion.section>
    );
};
