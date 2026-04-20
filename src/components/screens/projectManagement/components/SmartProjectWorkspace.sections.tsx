import React from "react";
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
import { APP_LABELS, AUTOMATION_PRESETS } from "./SmartProjectWorkspace.constants";
import { extractFirstName, timeGreeting } from "./SmartProjectWorkspace.helpers";
import type {
    AppConnectionKey,
    AutomationKey,
    WorkspaceSnapshot,
    WorkspaceSuggestion,
} from "./SmartProjectWorkspace.types";

const CONNECT_APP_LOGOS: Record<AppConnectionKey, string> = {
    drive: "https://cdn.simpleicons.org/googledrive/4285F4",
    slack: "https://cdn.simpleicons.org/slack/4A154B",
    notion: "https://cdn.simpleicons.org/notion/111111",
    github: "https://cdn.simpleicons.org/github/181717",
    trello: "https://cdn.simpleicons.org/trello/0052CC",
    jira: "https://cdn.simpleicons.org/jira/0052CC",
    asana: "https://cdn.simpleicons.org/asana/F06A6A",
    todoist: "https://cdn.simpleicons.org/todoist/E44332",
};

const CONNECT_APP_ICON_STYLE: Record<AppConnectionKey, string> = {
    drive: "bg-[#EAF1FF]",
    slack: "bg-[#F3ECFF]",
    notion: "bg-[#EEF1F5]",
    github: "bg-[#EEF2F7]",
    trello: "bg-[#E8F4FF]",
    jira: "bg-[#EEF3FF]",
    asana: "bg-[#FFEFF4]",
    todoist: "bg-[#FFF1EE]",
};

interface WorkspaceTopBarProps {
    projectName: string;
    connectedAppsCount: number;
    automationCount: number;
}

export const WorkspaceTopBar: React.FC<WorkspaceTopBarProps> = ({
    projectName,
    connectedAppsCount,
    automationCount,
}) => {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#5E738F]">
                    Project Workspace
                </p>
                <h2 className="text-2xl font-semibold text-[#1B2B44] mt-1">Project: {projectName}</h2>
            </div>

            <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#254A7A] border border-[#CFE0F7]">
                    <PlugZap className="h-4 w-4" />
                    {connectedAppsCount} app{connectedAppsCount === 1 ? "" : "s"} connected
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#3E4B5E] border border-[#DAE2EE]">
                    <Zap className="h-4 w-4" />
                    {automationCount} automation{automationCount === 1 ? "" : "s"} live
                </div>
            </div>
        </div>
    );
};

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

interface SuggestionsAndNotificationsProps {
    suggestions: WorkspaceSuggestion[];
    notifications: string[];
}

export const SuggestionsAndNotifications: React.FC<SuggestionsAndNotificationsProps> = ({
    suggestions,
    notifications,
}) => {
    return (
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
    );
};

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

interface ConnectAppsPanelProps {
    connections: Record<AppConnectionKey, boolean>;
    isIntegrationsLoading: boolean;
    onConnectApp: (appKey: AppConnectionKey) => void;
}

export const ConnectAppsPanel: React.FC<ConnectAppsPanelProps> = ({
    connections,
    isIntegrationsLoading,
    onConnectApp,
}) => {
    return (
        <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3]">
            <div className="flex items-center gap-2 mb-4">
                <PlugZap className="h-4 w-4 text-[#335C98]" />
                <h3 className="text-base font-semibold text-[#1E324E]">Connect Apps</h3>
            </div>
            <div className="space-y-3">
                {(Object.keys(APP_LABELS) as AppConnectionKey[]).map((appKey) => {
                    const logoUrl = CONNECT_APP_LOGOS[appKey];
                    const appTitle = APP_LABELS[appKey].title;

                    return (
                        <div
                            key={appKey}
                            className="flex items-center justify-between rounded-xl border border-[#E4EAF4] p-3"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${CONNECT_APP_ICON_STYLE[appKey]}`}
                                >
                                    <img
                                        src={logoUrl}
                                        alt={`${appTitle} logo`}
                                        className="h-4 w-4 object-contain"
                                        loading="lazy"
                                    />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-[#223752]">{appTitle}</p>
                                    <p className="text-sm text-[#60748F]">{APP_LABELS[appKey].subtitle}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (!connections[appKey]) {
                                        onConnectApp(appKey);
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
                    );
                })}
            </div>

            {isIntegrationsLoading && (
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#5C728C]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Syncing integration status...
                </div>
            )}
        </div>
    );
};

interface AssistantPanelProps {
    assistantPrompt: string;
    assistantReply: string;
    isAssistantLoading: boolean;
    onSubmitAssistant: (event: React.FormEvent) => void;
    onPromptChange: (value: string) => void;
    onQuickPrompt: (prompt: string) => void;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({
    assistantPrompt,
    assistantReply,
    isAssistantLoading,
    onSubmitAssistant,
    onPromptChange,
    onQuickPrompt,
}) => {
    return (
        <div className="rounded-2xl bg-white p-5 border border-[#DFE7F3] space-y-4">
            <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-[#335C98]" />
                <h3 className="text-base font-semibold text-[#1E324E]">AI Project Assistant</h3>
            </div>

            <form onSubmit={onSubmitAssistant} className="flex flex-col gap-3 md:flex-row">
                <input
                    value={assistantPrompt}
                    onChange={(event) => onPromptChange(event.target.value)}
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
                        onClick={() => onQuickPrompt(prompt)}
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
    );
};
