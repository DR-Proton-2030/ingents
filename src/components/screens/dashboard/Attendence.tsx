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

    // Build a 5×7 grid of date numbers for the current month
    // Row 0 = W1 (earliest), Row 4 = W5 (latest) — then we reverse for display
    const getMonthDateGrid = (): (number | null)[][] => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Build a flat 35-slot grid (5 weeks × 7 days)
        const flat: (number | null)[] = Array(35).fill(null);
        for (let d = 1; d <= daysInMonth; d++) {
            flat[firstDayOfMonth + d - 1] = d;
        }

        // Split into 5 rows of 7
        const grid: (number | null)[][] = [];
        for (let w = 0; w < 5; w++) {
            grid.push(flat.slice(w * 7, w * 7 + 7));
        }
        return grid;
    };

    // dateGrid[0] = W1, dateGrid[4] = W5
    // gridData (after reverse) = [W5, W4, W3, W2, W1] — index 0 is W5
    // So we reverse dateGrid too for display alignment
    const dateGrid = [...getMonthDateGrid()].reverse();

    const getIntensityClass = (intensity: number) => {
        switch (intensity) {
            case 4:
                return "bg-[#0b5cd5]";
            case 3:
                return "bg-[#1d76ea]";
            case 2:
                return "bg-[#7db3fe]";
            case 1:
                return "bg-[#c4deff]";
            default:
                return "bg-[#f3f4f6]";
        }
    };

    // Watermark text color — light on colored cells, very faint on gray
    const getDateTextClass = (intensity: number) => {
        return intensity > 0
            ? "text-white/30"
            : "text-zinc-400/40";
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
                        row.map((cell, colIdx) => {
                            const dateNum = dateGrid[rowIdx]?.[colIdx];
                            return (
                                <div
                                    key={`${rowIdx}-${colIdx}`}
                                    className={`group relative w-full aspect-square rounded-xl transition-all duration-300 flex items-end justify-end ${getIntensityClass(cell.intensity)} ${cell.intensity > 0 ? 'shadow-[inset_0_0_8px_rgba(255,255,255,0.15)]' : ''}`}
                                >
                                    {/* Date watermark */}
                                    {dateNum !== null && (
                                        <span
                                            className={`absolute inset-0 flex items-center justify-center text-[11px] font-normal select-none pointer-events-none ${getDateTextClass(cell.intensity)}`}
                                        >
                                            {dateNum}
                                        </span>
                                    )}

                                    {/* Tooltip */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                                        {cell.count} {cell.count === 1 ? 'employee' : 'employees'} present
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
                                    </div>
                                </div>
                            );
                        })
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