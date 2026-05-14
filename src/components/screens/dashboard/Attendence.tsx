"use client";
import React, { useEffect, useState, useRef } from "react";
import { getAttendanceStats } from "@/utils/api/user/user.api";

interface Attendee {
    _id: string;
    full_name: string;
    profile_picture: string | null;
}

interface GridCell {
    count: number;
    intensity: number;
    attendees?: Attendee[];
}

const UserAvatar = ({ name, profilePicture }: { name: string; profilePicture: string | null }) => {
    const firstLetter = name?.charAt(0)?.toUpperCase() || "?";
    const colors = [
        "bg-violet-500",
        "bg-blue-500",
        "bg-cyan-500",
        "bg-pink-500",
        "bg-emerald-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorClass = colors[Math.abs(hash) % colors.length];

    if (profilePicture) {
        return (
            <img
                src={profilePicture}
                alt={name}
                className="w-8 h-8 rounded-lg object-cover"
            />
        );
    }

    return (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold ${colorClass}`}>
            {firstLetter}
        </div>
    );
};

const Attendence = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeks = ["W 5", "W 4", "W 3", "W 2", "W 1"];

    const [gridData, setGridData] = useState<GridCell[][]>(
        Array.from({ length: 5 }, () => Array(7).fill({ count: 0, intensity: 0, attendees: [] }))
    );
    const [overallPercentage, setOverallPercentage] = useState(0);
    const [selectedDay, setSelectedDay] = useState<{ day: number; attendees: Attendee[]; x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const getMonthDateGrid = (): (number | null)[][] => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const flat: (number | null)[] = Array(35).fill(null);
        for (let d = 1; d <= daysInMonth; d++) {
            flat[firstDayOfMonth + d - 1] = d;
        }

        const grid: (number | null)[][] = [];
        for (let w = 0; w < 5; w++) {
            grid.push(flat.slice(w * 7, w * 7 + 7));
        }
        return grid;
    };

    const dateGrid = [...getMonthDateGrid()].reverse();

    const getIntensityClass = (intensity: number) => {
        switch (intensity) {
            case 4: return "bg-[#0b5cd5]";
            case 3: return "bg-[#1d76ea]";
            case 2: return "bg-[#7db3fe]";
            case 1: return "bg-[#c4deff]";
            default: return "bg-[#f3f4f6]";
        }
    };

    const getDateTextClass = (intensity: number) => {
        return intensity > 0 ? "text-white/30" : "text-zinc-400/40";
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAttendanceStats();
                if (res?.data) {
                    setGridData([...res.data.gridData].reverse());
                    setOverallPercentage(res.data.overallPercentage);
                }
            } catch (err) {
                console.error("Error fetching stats", err);
            }
        };
        fetchStats();

        const handleClickOutside = (e: MouseEvent) => {
            if (selectedDay && !(e.target as HTMLElement).closest(".attendance-modal")) {
                setSelectedDay(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedDay]);

    const handleSquareClick = (e: React.MouseEvent, dateNum: number | null, cell: GridCell) => {
        if (dateNum === null || cell.count === 0) {
            setSelectedDay(null);
            return;
        }

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (containerRect) {
            setSelectedDay({
                day: dateNum,
                attendees: cell.attendees || [],
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top
            });
        }
    };

    return (
        <div ref={containerRef} className="bg-white rounded-[24px] pt-4 px-6 w-full transition-all duration-300 relative">
            {/* Header Section */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Month Attendence</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                    {overallPercentage > 0 ? `+${overallPercentage}` : overallPercentage}% From last month
                </p>
            </div>

            {/* Grid Table */}
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 items-center mt-5">
                {/* Y-axis Labels */}
                <div className="flex flex-col gap-[28px] text-center pb-1">
                    {weeks.map((week) => (
                        <span key={week} className="text-[13px] font-semibold text-zinc-400 min-w-8">
                            {week}
                        </span>
                    ))}
                </div>

                {/* Heatmap Squares */}
                <div className="grid grid-rows-5 grid-cols-7 gap-1.5">
                    {gridData.map((row, rowIdx) =>
                        row.map((cell, colIdx) => {
                            const dateNum = dateGrid[rowIdx]?.[colIdx];
                            return (
                                <div
                                    key={`${rowIdx}-${colIdx}`}
                                    onClick={(e) => handleSquareClick(e, dateNum, cell)}
                                    className={`group relative w-full aspect-square rounded-xl transition-all duration-300 flex items-end justify-end cursor-pointer ${getIntensityClass(cell.intensity)} ${cell.intensity > 0 ? 'shadow-[inset_0_0_8px_rgba(255,255,255,0.15)]' : ''}`}
                                >
                                    {dateNum !== null && (
                                        <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-normal select-none pointer-events-none ${getDateTextClass(cell.intensity)}`}>
                                            {dateNum}
                                        </span>
                                    )}

                                    {/* Tooltip (only show if not selected) */}
                                    {!selectedDay && (
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                                            {cell.count} {cell.count === 1 ? 'employee' : 'employees'} present
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* X-axis Labels */}
                <div />
                <div className="grid grid-cols-7 gap-3.5 pt-2 mb-4">
                    {days.map((day, idx) => (
                        <span
                            key={day}
                            className={`text-center text-[13px] font-bold tracking-wide ${idx >= 1 && idx <= 5
                                ? "text-zinc-800 dark:text-zinc-300 font-bold"
                                : "text-zinc-400 dark:text-zinc-500 font-semibold"
                                }`}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            </div>

            {/* Attendance Detail Modal */}
            {selectedDay && (
                <div
                    className="attendance-modal absolute z-50 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 w-64 animate-in fade-in zoom-in duration-200"
                    style={{
                        left: `${selectedDay.x}px`,
                        top: `${selectedDay.y - 10}px`,
                        transform: "translate(-50%, -100%)",
                    }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-slate-800">
                            Attendees - Day {selectedDay.day}
                        </h4>
                        <button
                            onClick={() => setSelectedDay(null)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {selectedDay.attendees.map((attendee) => (
                            <div key={attendee._id} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                                <UserAvatar name={attendee.full_name} profilePicture={attendee.profile_picture} />
                                <span className="text-xs font-semibold text-slate-700 truncate">
                                    {attendee.full_name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Arrow down */}
                    <div
                        className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45 -mt-1.5 shadow-[2px_2px_2px_rgba(0,0,0,0.02)]"
                    ></div>
                </div>
            )}
        </div>
    );
};

export default Attendence;