"use client";

import { TimeRange } from "@/lib/types/chart.types";
import { TIME_RANGES } from "@/lib/config/constants";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

export default function TimeRangeSelector({
  value,
  onChange,
  className = "",
}: TimeRangeSelectorProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value as TimeRange)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            value === range.value
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}