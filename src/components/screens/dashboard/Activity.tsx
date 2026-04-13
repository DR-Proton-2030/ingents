import React from "react";
import { Check, RefreshCw, X } from "lucide-react";

type ActivityItem = {
	id: string;
	name: string;
	message: string;
	subject?: string;
	time: string;
	avatar: string;
	actionable?: boolean;
};

const todayItems: ActivityItem[] = [
	{
		id: "1",
		name: "Sarah Connor",
		message: "is requesting a meeting with the",
		subject: "HR Team",
		time: "Today, 04:00 PM",
		avatar: "SC",
		actionable: true,
	},
	{
		id: "2",
		name: "John Smith",
		message: "is scheduling a Tech Talk on",
		subject: "AI in Cybersecurity",
		time: "Today, 12:00 PM",
		avatar: "JS",
	},
	{
		id: "3",
		name: "Jessica Brown",
		message: "is setting up a brainstorming session",
		subject: "Adabor Project",
		time: "Today, 12:00 PM",
		avatar: "JB",
		actionable: true,
	},
];

const yesterdayItems: ActivityItem[] = [
	{
		id: "4",
		name: "Mark Lee",
		message: "is organizing a workshop on",
		subject: "coding best practices.",
		time: "Yesterday, 09:00 AM",
		avatar: "ML",
	},
	{
		id: "5",
		name: "Emily Wright",
		message: "is requesting a meeting with the",
		subject: "All Department",
		time: "Yesterday, 02:50 PM",
		avatar: "EW",
	},
];

function Row({ item }: { item: ActivityItem }) {
	return (
		<div className=" bg-gray-50 rounded-xl px-3 py-2">
			<div className="flex items-start gap-3">
				<div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
					{item.avatar}
				</div>

				<div className="flex-1 min-w-0">
					<p className="text-sm text-slate-500">
						<span className="font-semibold text-slate-900">{item.name}</span> {item.message}{" "}
					</p>
					<p className="mt-1 text-xs text-slate-500">{item.time}</p>
				</div>

				
			</div>
		</div>
	);
}

export const Activity = () => {
	return (
		<div className="rounded-[24px] bg-white p-4 sm:p-6">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-xl leading-none tracking-tight text-slate-900 font-medium">Activities</h3>
				<div className="flex items-center gap-2 text-slate-500 text-xs">
					<RefreshCw className="h-3 w-3" />
					Updated a second ago
				</div>
			</div>

			<div className="">
				{todayItems.map((item, i) => (
					<div key={item.id} className={i !== todayItems.length - 1 ? " mb-3" : ""}>
						<Row item={item} />
					</div>
				))}
			</div>

			

			{/* <button className="mt-4 w-full rounded-full border border-slate-300 bg-white py-3 text-sm text-slate-800 hover:bg-slate-50">
				Show all activities
			</button> */}
		</div>
	);
};

export default Activity;
