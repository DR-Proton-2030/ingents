import React from "react";
import { Bell, Sparkles } from "lucide-react";
import type { WorkspaceSuggestion } from "./SmartProjectWorkspace.types";

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
