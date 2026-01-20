import { useMemo } from "react";
import { WeekInfo, DAY_NAMES, formatDate } from "../types";

export const useWeekInfo = (weekOffset: number): WeekInfo => {
  return useMemo(() => {
    const now = new Date();
    // Start 1 day before today, and shift by weekOffset * 7 days
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 1 + weekOffset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        name: date.toLocaleDateString("default", { weekday: "short" }),
        date: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === now.toDateString(),
      });
    }

    const monthName = startDate.toLocaleString("default", { month: "long" });
    const year = startDate.getFullYear();

    const endOfPeriod = new Date(startDate);
    endOfPeriod.setDate(startDate.getDate() + 6);
    const endMonthName = endOfPeriod.toLocaleString("default", { month: "long" });
    const endYear = endOfPeriod.getFullYear();

    return {
      days,
      monthName,
      year,
      endMonthName,
      endYear,
      fromDate: formatDate(startDate),
      toDate: formatDate(endOfPeriod),
      isCurrentWeek: weekOffset === 0,
    };
  }, [weekOffset]);
};

export default useWeekInfo;
