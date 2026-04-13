"use client";
import React from "react";

interface ScoreRingProps {
  percentage: number;
  color: string;
  label: string;
  time: string;
}

function ScoreRing({ percentage, color, label, time }: ScoreRingProps) {
  const radius = 17;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3 ">
      <svg width={70} height={70} className="-rotate-90">
        <circle
          cx={35}
          cy={35}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={stroke}
        />
        <circle
          cx={35}
          cy={35}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{time}</p>
      </div>
    </div>
  );
}

export function ProductivityScores() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 pt-4 shadow-xl shadow-gray-100 pb-2 ">
      <h3 className="text-sm font-semibold text-slate-800 text-center mb-">
        Productivity Scores
      </h3>
      <div className="flex items-center justify-center gap-6">
        <ScoreRing
          percentage={65}
          color="#3b82f6"
          label="Focus"
          time="3 hr 12 min"
        />
        <div className="h-10 w-px bg-slate-100" />
        <ScoreRing
          percentage={35}
          color="#86efac"
          label="Breaks"
          time="1 hr 24 min"
        />
      </div>
    </div>
  );
}
