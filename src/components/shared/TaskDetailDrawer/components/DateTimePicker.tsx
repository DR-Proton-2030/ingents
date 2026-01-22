"use client";
import React from "react";
import { CloseCircle, AltArrowRight } from "@solar-icons/react";
import { cn } from "@/lib/utils";

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
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = new Date(year, month + 1, 0).getDate();
        return { firstDay, days };
    };

    const calendarData = getDaysInMonth(viewDate);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-800">Select Due Time</h4>
                <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-full">
                    <CloseCircle className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Month Header */}
                <div className="flex items-center justify-between px-1">
                    <h5 className="text-xs font-black text-gray-800">
                        {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h5>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                const newDate = new Date(viewDate);
                                newDate.setMonth(newDate.getMonth() - 1);
                                onViewDateChange(newDate);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <AltArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const newDate = new Date(viewDate);
                                newDate.setMonth(newDate.getMonth() + 1);
                                onViewDateChange(newDate);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <AltArrowRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-[10px] font-bold text-gray-300 text-center py-1">{d}</div>
                    ))}
                    {[...Array(calendarData.firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
                    {[...Array(calendarData.days)].map((_, i) => {
                        const day = i + 1;
                        const isSelected = selDate.getDate() === day && selDate.getMonth() === viewDate.getMonth() && selDate.getFullYear() === viewDate.getFullYear();
                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => onSelDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                                className={cn(
                                    "h-8 w-8 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center",
                                    isSelected ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                )}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>

                {/* Time Picker Section */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 rounded-2xl">
                        <div className="flex-1 flex flex-col gap-1 items-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Hour</span>
                            <div className="flex gap-1 flex-wrap justify-center">
                                {["09", "10", "11", "12", "01", "02", "03", "04", "05", "06", "07", "08"].map(h => (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() => onSelHourChange(h)}
                                        className={cn(
                                            "w-7 h-7 rounded-lg text-[10px] font-bold transition-all",
                                            selHour === h ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-200"
                                        )}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="w-px h-12 bg-gray-200" />
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => onSelAmPmChange("AM")}
                                className={cn("px-2 py-1.5 rounded-lg text-[9px] font-black transition-all", selAmPm === "AM" ? "bg-orange-500 text-white" : "bg-white text-gray-400")}
                            >AM</button>
                            <button
                                type="button"
                                onClick={() => onSelAmPmChange("PM")}
                                className={cn("px-2 py-1.5 rounded-lg text-[9px] font-black transition-all", selAmPm === "PM" ? "bg-orange-500 text-white" : "bg-white text-gray-400")}
                            >PM</button>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        {["00", "15", "30", "45"].map(m => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => onSelMinuteChange(m)}
                                className={cn(
                                    "flex-1 py-2 rounded-xl text-xs font-bold transition-all border",
                                    selMinute === m ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-white border-gray-100 text-gray-400 hover:border-orange-200"
                                )}
                            >
                                :{m}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onSave}
                    className="w-full h-12 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200 mt-4"
                >
                    Done Selecting
                </button>
            </div>
        </div>
    );
};

export default DateTimePicker;
