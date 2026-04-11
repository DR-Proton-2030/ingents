import React from "react";
import { MoreVertical } from "lucide-react";
import { CircularProgress } from "./CircularProgress";

interface StatisticCardProps {
  profilePic?: string;
  fullName?: string;
  greeting: { text: string; emoji: string };
  completionPercent: number;
}

const getFirstName = (fullName?: string) => fullName?.split(" ")[0] || "User";

export function StatisticCard({
  profilePic,
  fullName,
  greeting,
  completionPercent,
}: StatisticCardProps) {
  return (
    <div className="px-2 pb-">
     

      <div className="flex flex-col items-center">
        <CircularProgress
          percent={completionPercent || 57}
          size={120}
          strokeWidth={8}
        >
          <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200">
            {profilePic ? (
              <img
                src={profilePic}
                alt={fullName || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                {getFirstName(fullName)?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        </CircularProgress>

        <h2 className="mt-4 text-xl font-bold text-gray-900 flex items-center gap-2">
          {greeting.text} {getFirstName(fullName)}{" "}
          <span className="text-xl">{greeting.emoji}</span>
        </h2>
        <p className="text-sm text-[#94a3b8] mt-1 text-center">
          Continue your work to achieve your target!
        </p>
      </div>
    </div>
  );
}
