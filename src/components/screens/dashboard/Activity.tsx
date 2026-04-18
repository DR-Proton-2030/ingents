"use client";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { api } from "@/utils/api";
import { ActivityItem } from "@/utils/api/activity/activity.api";

const ACTIVITY_ICONS: Record<string, string> = {
	TASK_CREATED: "📝",
	TASK_COMPLETED: "✅",
	TASK_ASSIGNED: "👤",
	TASK_DELETED: "🗑️",
	MEETING_CREATED: "📅",
	MEETING_RSVP: "✉️",
	MEETING_DELETED: "❌",
	POST_SCHEDULED: "📤",
	POST_PUBLISHED: "🚀",
	SOCIAL_POSTED: "📱",
};

function timeAgo(dateStr: string): string {
	const now = new Date();
	const date = new Date(dateStr);
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	if (diffMin < 1) return "Just now";
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	const diffDay = Math.floor(diffHr / 24);
	if (diffDay === 1) return "Yesterday";
	return `${diffDay}d ago`;
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function Row({ item }: { item: ActivityItem }) {
	return (
		<div className="bg-gray-50 rounded-xl px-3 py-2">
			<div className="flex items-start gap-3">
				<div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
					{getInitials(item.actor_name)}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm text-slate-500">
						<span className="font-semibold text-slate-900">{item.actor_name}</span>{" "}
						{item.message}
					</p>
					<p className="mt-1 text-xs text-slate-400">{timeAgo(item.createdAt)}</p>
				</div>
				<span className="text-base flex-shrink-0" title={item.activity_type}>
					{ACTIVITY_ICONS[item.activity_type] || "📌"}
				</span>
			</div>
		</div>
	);
}

export const Activity = () => {
	const [activities, setActivities] = useState<ActivityItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [showAll, setShowAll] = useState(false);

	const fetchActivities = useCallback(async (isRefresh = false) => {
		try {
			if (isRefresh) setRefreshing(true);
			else setLoading(true);
			// Fetch up to 20 activities for now
			const response = await api.activity.getActivities(20);
			setActivities(response.data || []);
		} catch (error) {
			console.error("Failed to fetch activities:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchActivities();
	}, [fetchActivities]);

	const displayedActivities = showAll ? activities : activities.slice(0, 4);

	return (
		<div className="rounded-[24px] bg-white p-4 sm:p-6 transition-all duration-300">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-xl leading-none tracking-tight text-slate-900 font-medium">Activities</h3>
				<button
					onClick={() => fetchActivities(true)}
					disabled={refreshing}
					className="flex items-center gap-2 text-slate-500 text-xs hover:text-slate-700 transition-colors cursor-pointer"
				>
					<RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
					{refreshing ? "Refreshing…" : "Refresh"}
				</button>
			</div>

			<div className="flex flex-col gap-3">
				{loading ? (
					<p className="text-xs text-gray-400 text-center py-4">Loading activities…</p>
				) : activities.length === 0 ? (
					<p className="text-xs text-gray-400 text-center py-4">
						No recent activities yet. Actions like creating tasks, scheduling meetings, or posting on social media will appear here.
					</p>
				) : (
					<>
						{displayedActivities.map((item) => (
							<Row key={item._id} item={item} />
						))}

						{!showAll && activities.length > 5 && (
							<button
								onClick={() => setShowAll(true)}
								className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors py-2 rounded-xl bg-blue-50/50 hover:bg-blue-50 text-center cursor-pointer"
							>
								View All
							</button>
						)}
						{showAll && activities.length > 5 && (
							<button
								onClick={() => setShowAll(false)}
								className="mt-2 text-sm font-semibold text-slate-500 hover:text-slate-600 transition-colors py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-center cursor-pointer"
							>
								Show Less
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Activity;
