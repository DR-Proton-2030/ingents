"use client";
import React from "react";
import { WeekInfo } from "./types";

interface WeekNavigationProps {
    weekInfo: WeekInfo;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onCurrentWeek: () => void;
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
    weekInfo,
    onPrevWeek,
    onNextWeek,
    onCurrentWeek,
}) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <button
                onClick={onPrevWeek}
                className="rounded-full shadow bg-white px-3 py-1.5 text-xs font-medium text-black/80 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev Week
            </button>

            <div className="text-center">
                <h2 className="text-base font-semibold text-gray-800">
                    {weekInfo.monthName === weekInfo.endMonthName
                        ? `${weekInfo.monthName} ${weekInfo.year}`
                        : `${weekInfo.monthName} - ${weekInfo.endMonthName} ${weekInfo.year}`}
                </h2>
                {!weekInfo.isCurrentWeek && (
                    <button
                        onClick={onCurrentWeek}
                        className="text-[10px] text-orange-500 hover:text-orange-600 font-medium"
                    >
                        Go to current week
                    </button>
                )}
            </div>

            <button
                onClick={onNextWeek}
                className="rounded-full shadow bg-white px-3 py-1.5 text-xs font-medium text-black/80 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
                Next Week
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default WeekNavigation;
