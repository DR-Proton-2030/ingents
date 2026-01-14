import { useMemo } from "react";
import { WeekInfo, DAY_NAMES, formatDate } from "../types";

export const useWeekInfo = (weekOffset: number): WeekInfo => {
  return useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() + diff);

    // Apply week offset
    const startOfWeek = new Date(startOfCurrentWeek);
    startOfWeek.setDate(startOfCurrentWeek.getDate() + weekOffset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({
        name: DAY_NAMES[i],
        date: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === now.toDateString(),
      });
    }

    const monthName = startOfWeek.toLocaleString("default", { month: "long" });
    const year = startOfWeek.getFullYear();

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endMonthName = endOfWeek.toLocaleString("default", { month: "long" });
    const endYear = endOfWeek.getFullYear();

    return {
      days,
      monthName,
      year,
      endMonthName,
      endYear,
      fromDate: formatDate(startOfWeek),
      toDate: formatDate(endOfWeek),
      isCurrentWeek: weekOffset === 0,
    };
  }, [weekOffset]);
};

export default useWeekInfo;
