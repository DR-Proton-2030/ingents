"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

interface UserUsage {
  userId: string;
  tokens: number;
  full_name: string;
  profile_picture: string | null;
}

interface TokenData {
  totalTokens: number;
  tokenLimit: number;
  usageByUser: UserUsage[];
}

function CircularProgress({ used, total }: { used: number; total: number }) {
  const percentage = Math.min((used / total) * 100, 100);
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color logic: green < 60%, yellow 60-85%, red > 85%
  let progressColor = "#8b5cf6"; // purple default
  if (percentage >= 85) progressColor = "#ef4444";
  else if (percentage >= 60) progressColor = "#f59e0b";

  const remaining = Math.max(total - used, 0);

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: 108, height: 108 }}>
        <svg width="108" height="108" viewBox="0 0 108 108">
          {/* Background circle */}
          <circle
            stroke="#f1f5f9"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={54}
            cy={54}
          />
          {/* Progress circle */}
          <circle
            stroke={progressColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
            r={normalizedRadius}
            cx={54}
            cy={54}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-slate-800">{percentage.toFixed(0)}%</span>
          <span className="text-[9px] text-slate-400 font-medium">used</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: progressColor }}
          />
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Used</p>
            <p className="text-sm font-bold text-slate-800">
              {used.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Remaining</p>
            <p className="text-sm font-bold text-slate-800">
              {remaining.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserAvatar({
  name,
  profilePicture,
}: {
  name: string;
  profilePicture: string | null;
}) {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";

  // Generate a consistent color from the name
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = colors[Math.abs(hash) % colors.length];

  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={name}
        className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
        onError={(e) => {
          // Fallback to letter avatar if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          target.nextElementSibling?.classList.remove("hidden");
        }}
      />
    );
  }

  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm ${colorClass}`}
      title={name}
    >
      {firstLetter}
    </div>
  );
}

export function ProductivityScores() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await api.aiTokenUsage.getUsage();
        if (res?.data) {
          setTokenData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch token usage", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  return (
    <div className="rounded-2xl bg-white border border-slate-100 pt-4 shadow-xl shadow-gray-100 pb-4 px-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">
          AI Rate Limit Gateway
        </h3>
        <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-md">Live</span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Circular Progress Section */}
          <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 p-4 rounded-xl border border-slate-100 flex justify-center">
            <CircularProgress
              used={tokenData?.totalTokens || 0}
              total={tokenData?.tokenLimit || 5000}
            />
          </div>

          {/* Usage by User */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Usage by Member
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {tokenData?.usageByUser && tokenData.usageByUser.length > 0 ? (
                tokenData.usageByUser.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between text-xs group hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors -mx-2"
                    onMouseEnter={() => setHoveredUser(user.userId)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <UserAvatar
                        name={user.full_name}
                        profilePicture={user.profile_picture}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-700 font-semibold truncate text-xs">
                          {user.full_name}
                        </p>
                        {hoveredUser === user.userId && (
                          <p className="text-[10px] text-slate-400 truncate" style={{ animation: "animate-in 0.2s ease-out" }}>
                            {user.userId.slice(0, 12)}...
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ml-2">
                      {user.tokens.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic text-center py-2">
                  No AI usage recorded yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
