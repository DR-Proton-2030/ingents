"use client";

import React from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, UserPlus, Users } from "lucide-react";
import { formatCompactNumber } from "@/utils/commonFunction/formatNumber";

interface InstagramStatsDeckProps {
    overview: any;
}

export default function InstagramStatsDeck({ overview }: InstagramStatsDeckProps) {
    const statsDeck = [
        {
            label: "Followers",
            value: overview?.followersCount ?? overview?.followers ?? 0,
            icon: Users,
            color: "text-pink-700",
            bg: "bg-pink-50",
        },
        {
            label: "Following",
            value: overview?.followsCount ?? 0,
            icon: UserPlus,
            color: "text-purple-700",
            bg: "bg-purple-50",
        },
        {
            label: "Posts",
            value: overview?.mediaCount ?? 0,
            icon: ImageIcon,
            color: "text-slate-800",
            bg: "bg-slate-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {statsDeck.map((stat, idx) => (
                <motion.div
                    key={stat.label}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.06 }}
                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-w-[140px] group hover:border-slate-300 transition-all"
                >
                    <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-2xl mb-3`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {formatCompactNumber(stat.value)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {stat.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
