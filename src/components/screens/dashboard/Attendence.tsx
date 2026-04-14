import React from "react";
import { ArrowUpRight } from "lucide-react";

const Attendence = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const times = ["11:00", "10:00", "09:00", "08:00"];

    // Heatmap Data (4 rows x 7 cols)
    // 0: Gray, 1: Lightest Blue, 2: Light Blue, 3: Medium Blue, 4: Dark Blue
    const gridData = [
        [0, 1, 1, 3, 2, 0, 0], // 11:00
        [0, 2, 2, 2, 1, 0, 0], // 10:00
        [0, 2, 3, 1, 2, 0, 0], // 09:00
        [0, 0, 4, 2, 3, 4, 0], // 08:00
    ];

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

    return (
        <div className="bg-white  rounded-[24px] pt-4 px-6  w-full transition-all duration-300">
            {/* Header Section */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Attendence</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                    20% From last month
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
                    {gridData.map((row) =>
                        row.map((intensity, colIdx) => (
                            <div
                                key={colIdx}
                                className={`w-full aspect-square rounded-xl  transition-all duration-300 ${getIntensityClass(
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