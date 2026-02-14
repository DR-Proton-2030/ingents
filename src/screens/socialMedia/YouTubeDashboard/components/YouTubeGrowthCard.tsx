"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award } from "lucide-react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";

interface YouTubeGrowthCardProps {
  data: any;
  activeTab: string;
}

const YouTubeGrowthCard: React.FC<YouTubeGrowthCardProps> = ({
  data,
  activeTab,
}) => {
  const subscribersGained = data?.analytics?.overview?.subscribersGained || 0;
  const subscribersLost = data?.analytics?.overview?.subscribersLost || 0;
  const totalChange = subscribersGained + subscribersLost || 1;

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              Growth Breakdown
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Channel Expansion Metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 rounded-[30px] bg-green-50/30 border border-green-50 flex justify-between items-center group/item hover:bg-green-50/50 transition-colors">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">
                Gained
              </span>
              <span className="text-3xl font-black text-green-600">
                + {formatCompactNumber(Math.round(subscribersGained))}
              </span>
            </div>
            <div className="w-20 h-2 bg-green-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${(subscribersGained / totalChange) * 100}%`,
                }}
                className="h-full bg-green-500"
              />
            </div>
          </div>

          <div className="p-6 rounded-[30px] bg-red-50/30 border border-red-50 flex justify-between items-center group/item hover:bg-red-50/50 transition-colors">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">
                Lost
              </span>
              <span className="text-3xl font-black text-red-600">
                - {formatCompactNumber(Math.round(subscribersLost))}
              </span>
            </div>
            <div className="w-20 h-2 bg-red-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${(subscribersLost / totalChange) * 100}%`,
                }}
                className="h-full bg-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest mb-1">
              Net Subscriber Flow
            </p>
            <h4 className="text-5xl font-black text-orange-600 tracking-tighter">
              {formatCompactNumber(
                Math.round(data?.analytics?.overview?.netSubscribers || 0),
              )}
            </h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 uppercase">
                Growth Insight
              </p>
              <p className="text-[10px] font-bold text-slate-400">
                {activeTab === "overview"
                  ? "Real-time channel expansion"
                  : "Audience retention metrics"}
              </p>
            </div>
            <div className="p-5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-[30px] shadow-2xl shadow-orange-200 group-hover:rotate-12 transition-transform">
              <Award className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeGrowthCard;
