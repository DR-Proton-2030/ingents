"use client";
import React, { useEffect, useRef } from "react";
import { AltArrowRight } from "@solar-icons/react";

interface DateTimePickerProps {
    viewDate: Date;
    selDate: Date;
    selHour: string;
    selMinute: string;
    selAmPm: string;
    onViewDateChange: (date: Date) => void;
    onSelDateChange: (date: Date) => void;
    onSelHourChange: (hour: string) => void;
    onSelMinuteChange: (minute: string) => void;
    onSelAmPmChange: (ampm: string) => void;
    onSave: () => void;
    onClose: () => void;
}

const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"
];

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    viewDate,
    selDate,
    selHour,
    selMinute,
    selAmPm,
    onViewDateChange,
    onSelDateChange,
    onSelHourChange,
    onSelMinuteChange,
    onSelAmPmChange,
    onSave,
    onClose,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLButtonElement>(null);

    // Scroll active time slot into view when loaded or active time changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeRef.current) {
                activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }, 120);
        return () => clearTimeout(timer);
    }, [selHour, selMinute, selAmPm]);

    const getDaysInMonthMondayBased = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayIndex = new Date(year, month, 1).getDay();
        const firstDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        return { firstDayOffset, daysInMonth, daysInPrevMonth };
    };

    const { firstDayOffset, daysInMonth, daysInPrevMonth } = getDaysInMonthMondayBased(viewDate);
    const cells: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();

    // 1. Previous month padding days
    for (let i = firstDayOffset - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        cells.push({
            day: d,
            isCurrentMonth: false,
            date: new Date(viewYear, viewMonth - 1, d)
        });
    }

    // 2. Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({
            day: d,
            isCurrentMonth: true,
            date: new Date(viewYear, viewMonth, d)
        });
    }

    // 3. Next month padding days
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
        cells.push({
            day: d,
            isCurrentMonth: false,
            date: new Date(viewYear, viewMonth + 1, d)
        });
    }

    const handleSelectTime = (slot: string) => {
        const [timePart, ampm] = slot.split(" ");
        const [h, m] = timePart.split(":");
        onSelHourChange(h.padStart(2, "0"));
        onSelMinuteChange(m);
        onSelAmPmChange(ampm);
    };

    const formatSelectedDateTime = () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mStr = monthNames[selDate.getMonth()];
        const dStr = selDate.getDate();
        const yStr = selDate.getFullYear();

        const formattedSelHour = parseInt(selHour);
        const timeStr = `${formattedSelHour}:${selMinute} ${selAmPm}`;

        return `${mStr} ${dStr}, ${yStr} ${timeStr}`;
    };

    const roundedMin = parseInt(selMinute) >= 45 ? "00" : parseInt(selMinute) >= 15 ? "30" : "00";
    const activeSlotStr = `${parseInt(selHour)}:${roundedMin} ${selAmPm}`;

    const prevMonth = () => {
        onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    return (
        <div className="relative w-full flex flex-col overflow-hidden">
            {/* Split Picker Columns */}
            <div className="flex flex-col sm:flex-row p-6 gap-6">

                {/* Left Column: Monday-based Calendar */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-2.5 border border-gray-200 hover:bg-gray-50 rounded-full transition flex items-center justify-center text-gray-500 hover:text-gray-800"
                        >
                            <AltArrowRight className="w-4 h-4 rotate-180" />
                        </button>
                        <h5 className="text-base text-gray-800 font-semibold">
                            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h5>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-2.5 border border-gray-200 hover:bg-gray-50 rounded-full transition flex items-center justify-center text-gray-500 hover:text-gray-800"
                        >
                            <AltArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-y-0.5 gap-x- justify-items-center">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, idx) => (
                            <div key={`${d}-${idx}`} className="text-[11px] font-semibold text-gray-400 text-center py-1 w-10">{d}</div>
                        ))}
                        {cells.map((cell, idx) => {
                            const { day, isCurrentMonth } = cell;

                            if (!isCurrentMonth) {
                                return (
                                    <div
                                        key={`pad-${idx}`}
                                        className="h-10 w-10 flex items-center justify-center text-gray-300 font-medium text-sm select-none"
                                    >
                                        {day}
                                    </div>
                                );
                            }

                            const isSelected = selDate.getDate() === day &&
                                selDate.getMonth() === viewMonth &&
                                selDate.getFullYear() === viewYear;

                            const today = new Date();
                            const isToday = today.getDate() === day &&
                                today.getMonth() === viewMonth &&
                                today.getFullYear() === viewYear;

                            const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            const isPast = cell.date < todayDateOnly;

                            return (
                                <div key={day} className="flex justify-center items-center h-10 w-10">
                                    <button
                                        type="button"
                                        disabled={isPast}
                                        onClick={() => {
                                            onSelDateChange(new Date(viewYear, viewMonth, day));
                                        }}
                                        className={`h-10 w-10 rounded-full text-sm font-semibold transition-all flex flex-col items-center justify-center relative ${isPast
                                            ? "text-gray-200 cursor-not-allowed"
                                            : isSelected
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        <span>{day}</span>
                                        {isToday && (
                                            <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isSelected ? "bg-white" : "bg-blue-500"
                                                }`} />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Divider on Desktop */}
                <div className="hidden sm:block border-r border-gray-200/60" />

                {/* Right Column: Time Slot List */}
                <div className="w-full sm:w-[120px] flex flex-col">
                    <div
                        ref={scrollContainerRef}
                        className="overflow-y-auto max-h-[290px] flex flex-col gap-1"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#e5e7eb transparent'
                        }}
                    >
                        {timeSlots.map(slot => {
                            const isSelected = activeSlotStr === slot;
                            return (
                                <button
                                    key={slot}
                                    ref={isSelected ? activeRef : null}
                                    type="button"
                                    onClick={() => handleSelectTime(slot)}
                                    className={`w-full text-left px-4 py-2 text-sm font-bold transition-all rounded-xl ${isSelected
                                        ? "bg-gray-100 text-[#1e1e24]"
                                        : "text-gray-400 hover:text-gray-800 hover:bg-gray-50"
                                        }`}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Divider before Bottom Bar */}
            <div className="border-t border-gray-100" />

            {/* Bottom Action Bar */}
            <div className="p-4 bg-white flex items-center justify-between px-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-rose-500 hover:text-gray-800 font-bold text-sm transition-colors py-2 px-3 rounded-xl hover:bg-gray-50"
                >
                    Cancel
                </button>

                <div className="border border-gray-200 bg-white rounded-full px-4 py-2 font-bold text-sm text-gray-700 select-none tracking-tight">
                    {formatSelectedDateTime()}
                </div>

                <button
                    type="button"
                    onClick={onSave}
                    className="border border-gray-300 bg-white text-gray-800 font-bold text-sm rounded-full px-5 py-2 transition-all 
                    hover:bg-blue-500 hover:text-white flex items-center justify-center"
                >
                    Schedule
                </button>
            </div>
        </div>
    );
};

export default DateTimePicker;
