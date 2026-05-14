"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

export function ProductivityScores() {
  const [tokenData, setTokenData] = useState<{ totalTokens: number, usageByUser: Record<string, number> } | null>(null);
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
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Org Total Tokens</span>
            <span className="text-lg font-bold text-slate-800">{tokenData?.totalTokens?.toLocaleString() || 0}</span>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Usage by User ID</p>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {tokenData?.usageByUser && Object.keys(tokenData.usageByUser).length > 0 ? (
                Object.entries(tokenData.usageByUser).map(([userId, tokens]) => (
                  <div key={userId} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium truncate w-32" title={userId}>{userId.slice(0, 8)}...</span>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{tokens.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic text-center py-2">No AI usage recorded yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
