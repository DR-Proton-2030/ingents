import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/utils/api";
import {
    APP_LABELS,
    APP_TOOLKIT_SLUG,
    AUTOMATION_PRESETS,
    DRIVE_LIST_ACTIONS,
    EMPTY_SNAPSHOT,
    TASK_TOOL_KEYS,
} from "./SmartProjectWorkspace.constants";
import {
    buildSnapshotFromLiveData,
    deriveConnectionState,
    extractFirstName,
    isActionableTool,
    timeGreeting,
    toDriveFiles,
} from "./SmartProjectWorkspace.helpers";
import {
    AssistantPanel,
    ConnectAppsPanel,
    LiveDashboard,
    QuickAutomationsPanel,
    SuggestionsAndNotifications,
    WorkspaceOverview,
    WorkspaceTopBar,
} from "./SmartProjectWorkspace.sections";
import type {
    ActivityRecord,
    AppConnectionKey,
    AutomationKey,
    DriveFileRecord,
    SmartProjectWorkspaceProps,
    TaskRecord,
    WorkspaceSuggestion,
    WorkspaceSnapshot,
} from "./SmartProjectWorkspace.types";

export const SmartProjectWorkspace: React.FC<SmartProjectWorkspaceProps> = ({
    project,
    userName,
}) => {
    const [connections, setConnections] = useState<Record<AppConnectionKey, boolean>>({
        drive: false,
        slack: false,
        notion: false,
        github: false,
        trello: false,
        jira: false,
        asana: false,
        todoist: false,
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

    const fetchRecentDriveFiles = useCallback(async (): Promise<DriveFileRecord[]> => {
        for (const actionName of DRIVE_LIST_ACTIONS) {
            try {
                const raw = await api.integration.executeAction(
                    actionName,
                    {
                        q: "trashed = false",
                        orderBy: "modifiedTime desc",
                        pageSize: 10,
                        supportsAllDrives: true,
                        includeItemsFromAllDrives: true,
                    },
                    project._id
                );

                const files = toDriveFiles(raw);
                if (files.length > 0) {
                    const unique = new Map<string, DriveFileRecord>();
                    files.forEach((file) => {
                        const key = file.id || `${file.name}-${file.modifiedTime || file.createdTime || ""}`;
                        if (!unique.has(key)) {
                            unique.set(key, file);
                        }
                    });
                    return Array.from(unique.values());
                }
            } catch (error) {
                console.error(`Drive action ${actionName} failed:`, error);
            }
        }

        return [];
    }, [project._id]);

    useEffect(() => {
        setConnections({
            drive: false,
            slack: false,
            notion: false,
            github: false,
            trello: false,
            jira: false,
            asana: false,
            todoist: false,
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
        let refreshTimer: ReturnType<typeof setInterval> | null = null;

        const refreshWorkspace = async () => {
            let currentConnections: Record<AppConnectionKey, boolean> = {
                drive: false,
                slack: false,
                notion: false,
                github: false,
                trello: false,
                jira: false,
                asana: false,
                todoist: false,
            };

            setIsIntegrationsLoading(true);
            try {
                const response = await api.integration.getIntegrations(project._id);
                const items = Array.isArray(response) ? response : [];
                currentConnections = deriveConnectionState(items);

                if (!isCancelled) {
                    setConnections(currentConnections);
                    setIntegrationError(null);
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error("Failed to sync integrations:", error);
                    setIntegrationError("Could not refresh integration status.");
                    setConnections(currentConnections);
                }
            } finally {
                if (!isCancelled) {
                    setIsIntegrationsLoading(false);
                }
            }

            setIsSnapshotLoading(true);
            try {
                const snapshotPromises: Array<Promise<any>> = [
                    api.task.getTasks({ project_object_id: project._id, limit: 100 }),
                    api.activity.getActivities(30),
                    currentConnections.drive ? fetchRecentDriveFiles() : Promise.resolve([]),
                ];

                const [tasksResult, activitiesResult, driveResult] = await Promise.allSettled(snapshotPromises);

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

                const driveFiles =
                    driveResult.status === "fulfilled" && Array.isArray(driveResult.value)
                        ? (driveResult.value as DriveFileRecord[])
                        : [];

                if (
                    tasksResult.status === "rejected" &&
                    activitiesResult.status === "rejected" &&
                    driveFiles.length === 0
                ) {
                    setSnapshotError("Could not load project metrics right now.");
                    setSnapshot(EMPTY_SNAPSHOT);
                    return;
                }

                setSnapshot(buildSnapshotFromLiveData(tasksData, activityData, driveFiles));
                setSnapshotError(null);
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

        void refreshWorkspace();
        refreshTimer = setInterval(() => {
            void refreshWorkspace();
        }, 30000);

        return () => {
            isCancelled = true;
            if (refreshTimer) {
                clearInterval(refreshTimer);
            }
        };
    }, [fetchRecentDriveFiles, project._id, project.name]);

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
                    usedTools,
                };
            } catch (error) {
                console.error("Assistant request failed:", error);
                setAssistantReply(
                    "I could not complete that action right now. Please check your integrations and try again."
                );
                return {
                    ok: false,
                    usedTools: [] as string[],
                };
            } finally {
                setIsAssistantLoading(false);
            }
        },
        [project._id]
    );

    const setupGithubPrToTrelloAutomation = useCallback(async () => {
        if (typeof window === "undefined") {
            setAssistantReply("Cannot configure webhook outside browser context.");
            return false;
        }

        const githubRepoOwner = window.prompt(
            "Enter GitHub repository owner (example: octocat):"
        );
        if (!githubRepoOwner || !githubRepoOwner.trim()) {
            setAssistantReply("Automation setup cancelled: GitHub owner is required.");
            return false;
        }

        const githubRepoName = window.prompt(
            "Enter GitHub repository name (example: awesome-repo):"
        );
        if (!githubRepoName || !githubRepoName.trim()) {
            setAssistantReply("Automation setup cancelled: GitHub repository name is required.");
            return false;
        }

        const trelloListId = window.prompt(
            "Enter Trello list ID where PR tasks should be created:"
        );
        if (!trelloListId || !trelloListId.trim()) {
            setAssistantReply("Automation setup cancelled: Trello list ID is required.");
            return false;
        }

        try {
            const setupResult = await api.automation.setupGithubPrToTrelloAutomation({
                projectId: project._id,
                githubRepoOwner: githubRepoOwner.trim(),
                githubRepoName: githubRepoName.trim(),
                trelloListId: trelloListId.trim(),
            });

            setAssistantReply(
                `Automation setup created. In GitHub repo settings, add a webhook with this URL: ${setupResult.webhookUrl}. Use this secret: ${setupResult.webhookSecret}. Select pull_request events and JSON content type.`
            );
            return true;
        } catch (error) {
            console.error("Failed to configure GitHub PR to Trello automation:", error);
            setAssistantReply(
                "Automation setup failed. Verify repo owner/name and Trello list ID, then try again."
            );
            return false;
        }
    }, [project._id]);

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
            if (preset.key === "taskOnPr") {
                const connectedTaskTool = TASK_TOOL_KEYS.find((tool) => connections[tool]);

                if (connectedTaskTool === "trello") {
                    if (!connections.github) {
                        setAssistantReply(
                            "Connect GitHub first, then enable PR -> Trello automation."
                        );
                        return;
                    }

                    const configured = await setupGithubPrToTrelloAutomation();
                    if (configured) {
                        setAutomations((prev) => ({ ...prev, [preset.key]: true }));
                    }
                    return;
                }

                if (!connectedTaskTool) {
                    setAssistantReply(
                        "To enable PR -> task automation, connect a task tool first (Trello, Jira, Asana, or Todoist)."
                    );
                }
            }

            const connectedApps = (Object.keys(connections) as AppConnectionKey[])
                .filter((app) => connections[app])
                .map((app) => APP_LABELS[app].title)
                .join(", ");

            const result = await requestAssistant(
                `Create and execute setup for this project automation in ${project.name}: ${preset.title}. Trigger definition: ${preset.trigger}. Use actionable tools only if available. Connected apps: ${connectedApps || "none"}. If setup cannot be completed, clearly state missing apps and do not pretend it is enabled.`
            );

            const actionableTools = result.usedTools.filter(isActionableTool);

            if (result.ok && actionableTools.length > 0) {
                setAutomations((prev) => ({ ...prev, [preset.key]: true }));
            } else if (result.ok) {
                setAssistantReply(
                    "Automation was not enabled because no executable tool action ran. Connect the required app mentioned above and try again."
                );
            }
        },
        [connections, project.name, requestAssistant, setupGithubPrToTrelloAutomation]
    );

    const suggestions = useMemo(() => {
        const list: WorkspaceSuggestion[] = [];

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
            <WorkspaceTopBar
                projectName={project.name}
                connectedAppsCount={Object.values(connections).filter(Boolean).length}
                automationCount={automationCount}
            />

            <WorkspaceOverview
                projectName={project.name}
                userName={userName}
                snapshot={snapshot}
                automationCount={automationCount}
            />

            <SuggestionsAndNotifications suggestions={suggestions} notifications={notifications} />

            <LiveDashboard snapshot={snapshot} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <QuickAutomationsPanel
                    automations={automations}
                    isAssistantLoading={isAssistantLoading}
                    onRunAutomation={(automation) => {
                        void runAutomationPreset(automation);
                    }}
                />

                <ConnectAppsPanel
                    connections={connections}
                    isIntegrationsLoading={isIntegrationsLoading}
                    onConnectApp={(appKey) => {
                        void handleConnectApp(appKey);
                    }}
                />
            </div>

            <AssistantPanel
                assistantPrompt={assistantPrompt}
                assistantReply={assistantReply}
                isAssistantLoading={isAssistantLoading}
                onSubmitAssistant={onSubmitAssistant}
                onPromptChange={setAssistantPrompt}
                onQuickPrompt={(prompt) => {
                    setAssistantPrompt(prompt);
                    void requestAssistant(prompt);
                }}
            />
        </motion.section>
    );
};
