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

function CircularProgress({
  used,
  total,
}: {
  used: number;
  total: number;
}) {
  const percentage = Math.min((used / total) * 100, 100);

  const radius = 42;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  let progressColor = "#8b5cf6";
  if (percentage >= 85) progressColor = "#ef4444";
  else if (percentage >= 60) progressColor = "#f59e0b";

  return (
    <div className="relative shrink-0">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle
          stroke="#eef2ff"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={42}
          cy={42}
        />

        <circle
          stroke={progressColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "all .6s ease",
          }}
          r={normalizedRadius}
          cx={42}
          cy={42}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-slate-900 leading-none">
          {percentage.toFixed(0)}%
        </span>
        <span className="text-[10px] text-slate-400 font-medium mt-1">
          usage
        </span>
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

  const colors = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-cyan-500",
    "bg-pink-500",
    "bg-emerald-500",
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
        className="w-9 h-9 rounded-xl object-cover"
      />
    );
  }

  return (
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold ${colorClass}`}
    >
      {firstLetter}
    </div>
  );
}

export function ProductivityScores() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const used = tokenData?.totalTokens || 0;
  const total = tokenData?.tokenLimit || 50000;
  const remaining = total - used;

  return (
    <div className="rounded-3xl  bg-white p-5 ">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            Token Usage
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Team token consumption
          </p>
        </div>

        <div className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
          Live
        </div>
      </div>

      {loading ? (
        <div className="h-[180px] flex items-center justify-center">
          <div className="w-7 h-7 border-[3px] border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Compact Stats */}
          <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 to-violet-50 p-4">
            <div className="flex items-center gap-5">
              <CircularProgress used={used} total={total} />

              <div className="grid grid-cols-2 gap-3 flex-1">
                <div className="rounded-2xl bg-white border border-slate-100 p-3">
                  <p className="text-[11px] text-slate-400 font-medium mb-1">
                    Used
                  </p>

                  <h4 className="text-xl font-bold text-slate-900">
                    {used.toLocaleString()}
                  </h4>
                </div>

                <div className="rounded-2xl bg-white border border-slate-100 p-3">
                  <p className="text-[11px] text-slate-400 font-medium mb-1">
                    Remaining
                  </p>

                  <h4 className="text-xl font-bold text-slate-900">
                    {remaining.toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Users */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold  text-slate-400">
                Team Usage
              </p>

              <p className="text-xs text-slate-400">
                {tokenData?.usageByUser?.length || 0} members
              </p>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {tokenData?.usageByUser?.length ? (
                tokenData.usageByUser.map((user) => {
                  const width =
                    (user.tokens / Math.max(used, 1)) * 100;

                  return (
                    <div
                      key={user.userId}
                      className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <UserAvatar
                            name={user.full_name}
                            profilePicture={user.profile_picture}
                          />

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {user.full_name}
                            </p>

                            <p className="text-[11px] text-slate-400 truncate">
                              {user.userId.slice(0, 12)}...
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-slate-900">
                            {user.tokens.toLocaleString()}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            tokens
                          </p>
                        </div>
                      </div>


                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-sm text-slate-400">
                  No usage recorded yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}