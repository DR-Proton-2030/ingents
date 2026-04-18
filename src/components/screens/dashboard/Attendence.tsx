"use client";
import React, { useEffect, useState } from "react";
import { getAttendanceStats } from "@/utils/api/user/user.api";

const Attendence = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeks = ["W 5", "W 4", "W 3", "W 2", "W 1"];

    // Default empty data (5 weeks x 7 days)
    const [gridData, setGridData] = useState<{ count: number; intensity: number }[][]>(
        Array.from({ length: 5 }, () => Array(7).fill({ count: 0, intensity: 0 }))
    );
    const [overallPercentage, setOverallPercentage] = useState(0);

    const getIntensityClass = (intensity: number) => {
        switch (intensity) {
            case 4:
                return "bg-[#0b5cd5]"; // Deepest Blue
            case 3:
                return "bg-[#1d76ea]"; // Dark Blue
            case 2:
                return "bg-[#7db3fe]"; // Medium Blue
            case 1:
                return "bg-[#c4deff]"; // Lightest Blue
            default:
                return "bg-[#f3f4f6] "; // Very Light Gray
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAttendanceStats();
                if (res?.data) {
                    // Backend returns [Week 1, Week 2 ... Week 5]
                    // We want to show from newest to oldest in the grid (Week 5 at top)
                    setGridData([...res.data.gridData].reverse());
                    setOverallPercentage(res.data.overallPercentage);
                }
            } catch (err) {
                console.error("Error fetching stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="bg-white rounded-[24px] pt-4 px-6 w-full transition-all duration-300">
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
                <div className="flex flex-col gap-[22px] text-right pb-1">
                    {weeks.map((week) => (
                        <span
                            key={week}
                            className="text-[13px] font-semibold text-zinc-400 min-w-8"
                        >
                            {week}
                        </span>
                    ))}
                </div>

                {/* Heatmap Squares */}
                <div className="grid grid-rows-5 grid-cols-7 gap-1.5">
                    {gridData.map((row, rowIdx) =>
                        row.map((cell, colIdx) => (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className={`group relative w-full aspect-square rounded-xl transition-all duration-300 ${getIntensityClass(
                                    cell.intensity
                                )} ${cell.intensity > 0 ? 'shadow-[inset_0_0_8px_rgba(255,255,255,0.15)]' : ''}`}
                            >
                                {/* Tooltip */}
                                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                                    {cell.count} {cell.count === 1 ? 'employee' : 'employees'} present
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* X-axis Labels */}
                <div /> {/* Spacer for Y-axis column */}
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
        </div>
    );
};

export default Attendence;