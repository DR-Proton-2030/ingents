/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

function parseMobileScore(val: any) {
  if (!val) return 0;
  if (typeof val === "number") return Math.max(0, Math.min(100, val));
  if (typeof val === "string") {
    const m = val.match(/(\d{1,3})/);
    return m ? Math.max(0, Math.min(100, Number(m[1]))) : 0;
  }
  return 0;
}

export default function Performance({ performance }: { performance?: any }) {
  return (
    <div className=" border border-[#444444] bg-[#1F2023] px-3 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.24)] rounded-xl">
      <h3 className="text-lg text-white font-semibold mb-3">⚡ Performance</h3>
      {performance ? (
        <div>
          <div className="mb-3">
            <div className="text-xs text-white/70">Mobile score</div>
            {/* improved progress bar */}
            {(() => {
              const score = parseMobileScore(performance.mobile_speed_score);
              const colorClass =
                score < 50
                  ? "bg-rose-500"
                  : score < 75
                  ? "bg-green-400"
                  : "bg-emerald-500";
              const showInside = score >= 12; // if too small, show label outside
              return (
                <div className="relative mt-2">
                  <div className="w-full bg-black/70 rounded h-4 overflow-hidden">
                    <div
                      role="progressbar"
                      aria-valuenow={score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className={`h-4 ${colorClass} transition-all duration-500 ease-out`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  <span className="text-xs mt-4 font-medium text-white">
                    {score}/100
                  </span>
                </div>
              );
            })()}
          </div>

          <div className="mt-4">
            <div className="font-medium text-white mb-1">Recommendations:</div>
            <ul className="list-disc ml-5 space-y-1 text-white/80 text-xs">
              {performance.recommendations?.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-white/60">No performance data</p>
      )}
    </div>
  );
}
