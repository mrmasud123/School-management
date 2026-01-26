import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarProps {
    selected?: Date;
    onSelect?: (date: Date) => void;
    className?: string;
}

export function Calendar({ selected, onSelect,className }: CalendarProps) {
    return (
        <div className="border rounded-lg p-2">
            <DayPicker className={className} mode="single" selected={selected} onSelect={onSelect} />
        </div>
    );
}
