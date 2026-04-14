"use client";
import React, { useEffect, useState } from "react";
import { getAttendanceStats } from "@/utils/api/user/user.api";

const Attendence = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const times = ["11:00", "10:00", "09:00", "08:00"];

    // Default empty data
    const [gridData, setGridData] = useState<number[][]>([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ]);
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
                return "bg-[#e5e7eb] "; // Gray
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAttendanceStats();
                if (res?.data) {
                    setGridData(res.data.gridData);
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
                <h2 className="text-2xl font-semibold text-gray-800">Attendence</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                    {overallPercentage}% From last month
                </p>
            </div>

            {/* Grid Table */}
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 items-center mt-5">
                {/* Y-axis Labels */}
                <div className="flex flex-col gap-6 text-right pb-1">
                    {times.map((time) => (
                        <span
                            key={time}
                            className="text-[15px] font-semibold text-zinc-500 dark:text-zinc-400 min-w-12"
                        >
                            {time}
                        </span>
                    ))}
                </div>

                {/* Heatmap Squares */}
                <div className="grid grid-rows-4 grid-cols-7 gap-1.5">
                    {gridData.map((row, rowIdx) =>
                        row.map((intensity, colIdx) => (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className={`w-full aspect-square rounded-xl transition-all duration-300 ${getIntensityClass(
                                    intensity
                                )} ${intensity > 0 ? 'shadow-[inset_0_0_8px_rgba(255,255,255,0.15)]' : ''}`}
                            />
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