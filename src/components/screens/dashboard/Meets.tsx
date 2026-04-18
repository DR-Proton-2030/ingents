"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock1, Clock3, MoreVertical, Video } from "lucide-react";
import {
	useWeekInfo,
	useMeetings,
} from "@/components/shared/upcomingEvent";
import { Meeting } from "@/utils/api/meeting/meeting.api";
import MeetingDrawer from "./MeetingDrawer";
import { DashboardHeader } from "./DashboardHeader";

const sameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

const getInitial = (name?: string | null, email?: string | null) => {
	if (name?.trim()) return name.trim().charAt(0).toUpperCase();
	if (email?.trim()) return email.trim().charAt(0).toUpperCase();
	return "U";
};

const formatTime = (iso: string) =>
	new Date(iso).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

export const Meets = () => {
	const [weekOffset, setWeekOffset] = useState(0);
	const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const weekInfo = useWeekInfo(weekOffset);
	const { meetings, isLoading } = useMeetings(weekInfo.fromDate, weekInfo.toDate);

	const weekdays = useMemo(() => weekInfo.days.slice(0, 5), [weekInfo.days]);
	const defaultIndex = Math.max(
		0,
		weekdays.findIndex((d) => d.isToday)
	);
	const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

	const selectedDay = weekdays[selectedIndex] || weekdays[0];

	const meetingsForDay = useMemo(() => {
		if (!selectedDay) return [] as Meeting[];
		return meetings
			.filter((m) => sameDay(new Date(m.scheduled_start_time), selectedDay.fullDate))
			.sort(
				(a, b) =>
					new Date(a.scheduled_start_time).getTime() -
					new Date(b.scheduled_start_time).getTime()
			);
	}, [meetings, selectedDay]);

	const quickMeeting = meetingsForDay[0];
	const participantPreview = quickMeeting?.participants?.slice(0, 2) || [];
	const extraCount = Math.max((quickMeeting?.participants?.length || 0) - 2, 0);

	const openMeetingDetails = () => {
		if (!quickMeeting?._id) return;
		setSelectedMeetingId(quickMeeting._id);
		setIsDrawerOpen(true);
	};

	return (
		<div className="rounded-[24px] bg-white px-4 py-3">
			{/* <h3 className="text-2xl leading-none tracking-tight text-slate-900 font-medium">
				Schedule list
			</h3> */}

			<div className="mt-5 flex items-center justify-between gap-3">
				<button
					onClick={() => {
						setWeekOffset((v) => v - 1);
						setSelectedIndex(0);
					}}
					className="p-2 rounded-full  bg-[#f0f1f4] text-slate-700 flex items-center justify-center"
				>
					<ChevronLeft className="h-4 w-4" />
				</button>

				<div className="flex flex-1 items-center justify-center gap-2 sm:gap-3">
					{weekdays.map((day, idx) => {
						const active = idx === selectedIndex;
						return (
							<button
								key={day.fullDate.toISOString()}
								onClick={() => setSelectedIndex(idx)}
								className="flex flex-col items-center gap-1 "
							>
								<span
									className={`text-sm ${active ? "text-[#f48c52] font-semibold" : "text-slate-600"
										}`}
								>
									{day.name}
								</span>
								<span
									className={`p-3 rounded-full flex items-center justify-center text-sm leading-none ${active
										? "bg-[#f48c52] text-white"
										: "bg-[#eaebef] text-slate-800"
										}`}
								>
									{day.date}
								</span>
							</button>
						);
					})}
				</div>

				<button
					onClick={() => {
						setWeekOffset((v) => v + 1);
						setSelectedIndex(0);
					}}
					className="p-2 rounded-full  bg-[#f0f1f4] text-slate-700 flex items-center justify-center"
				>
					<ChevronRight className="h-4 w-4" />
				</button>
			</div>

			<div className="mt-5 bg-gray-50 rounded-2xl  p-4">
				{isLoading ? (
					<div className="h-[170px] flex items-center justify-center text-slate-500 text-sm">
						Loading meetings...
					</div>
				) : quickMeeting ? (
					<>
						<div className="flex  items-start justify-between gap-3 cursor-pointer" onClick={openMeetingDetails}>
							<div>
								<p className="text-xs leading-none text-slate-500">{"Meeting"}</p>
								<h4 className="mt-1 text-xl leading-none  text-slate-900">
									{quickMeeting.title}
								</h4>
							</div>
							<button className="text-slate-500 ">
								<MoreVertical className="h-5 w-5" />
							</button>
						</div>

						<div className="mt-2 flex items-center justify-between gap-4 flex-wrap">
							<div className="flex items-center gap-1 text-black/50 text-xs leading-none font-medium">
								<Clock1 className="h-4 w-4" />
								{formatTime(quickMeeting.scheduled_start_time)} - {formatTime(quickMeeting.scheduled_end_time)}
							</div>

							<div className="flex items-center gap-2">
								<div className="flex -space-x-2">
									{participantPreview.map((p) => {
										const name = p.user_details?.full_name || p.external_name;
										const email = p.user_details?.email || p.external_email;
										const image = p.user_details?.profile_picture;
										return (
											<div
												key={p._id}
												className="h-7 w-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden flex items-center justify-center text-xs font-semibold text-slate-700"
											>
												{image ? (
													// eslint-disable-next-line @next/next/no-img-element
													<img src={image} alt={name || "participant"} className="h-full w-full object-cover" />
												) : (
													getInitial(name, email)
												)}
											</div>
										);
									})}
									{extraCount > 0 ? (
										<div className="h-9 w-9 rounded-full border-2 border-white bg-[#0f172a] text-white text-xs font-semibold flex items-center justify-center">
											+{extraCount}
										</div>
									) : null}
								</div>
								<span className="text-sm leading-none text-black text-xs font-medium">
									{quickMeeting.participants.length} participants
								</span>
							</div>
						</div>

						<button
							onClick={() => {
								if (quickMeeting.meeting_link) {
									window.open(quickMeeting.meeting_link, "_blank", "noopener,noreferrer");
								}
							}}
							className="mt-4 w-full rounded-2xl bg-[#f0f1f3] py-2.5 text-slate-900 text-sm leading-none font-medium flex items-center justify-center gap-2 hover:bg-[#e8eaee] disabled:opacity-60 disabled:cursor-not-allowed"
							disabled={!quickMeeting.meeting_link}
						>
							<div className="p-1 rounded-md bg-green-500 text-white">

								<Video className="h-5 w-5 text-white/70 " />
							</div>
							Go to meeting link
						</button>
					</>
				) : (
					<div className="h-[170px] rounded-2xl bg-[#f8f9fb] border border-slate-100 flex flex-col gap-2 items-center justify-center text-slate-500">
						No meetings for this day
						<div className="">
							<DashboardHeader />

						</div>
					</div>
				)}
			</div>

			<MeetingDrawer
				meetingId={selectedMeetingId}
				isOpen={isDrawerOpen}
				onClose={() => {
					setIsDrawerOpen(false);
					setSelectedMeetingId(null);
				}}
			/>
		</div>
	);
};

export default Meets;
