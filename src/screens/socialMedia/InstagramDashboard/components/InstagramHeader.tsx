"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, TrendingUp } from "lucide-react";
import InstagramStatsDeck from "./InstagramStatsDeck";

interface InstagramHeaderProps {
    profile?: any;
    overview?: any;
}

function getProfilePicture(profile: any): string | undefined {
    return (
        profile?.profile_picture_url ||
        profile?.profile_picture ||
        profile?.profilePictureUrl ||
        profile?.profilePicture ||
        profile?.picture ||
        profile?.avatar_url ||
        profile?.avatar
    );
}

function getDisplayName(profile: any): string {
    return profile?.name || profile?.full_name || profile?.username || "Instagram";
}

function getHandle(profile: any): string | undefined {
    const handle = profile?.username || profile?.handle;
    if (!handle) return undefined;
    return handle.startsWith("@") ? handle : `@${handle}`;
}

export default function InstagramHeader({ profile, overview }: InstagramHeaderProps) {
    const resolvedProfile = profile ?? overview;
    const photo = getProfilePicture(resolvedProfile);
    const name = getDisplayName(resolvedProfile);
    const handle = getHandle(resolvedProfile);

    return (
        <section className="relative pt-6 pb-2">
            <div className="absolute inset-0 -mt-24 -mx-10 rounded-b-[40px] bg-gradient-to-b from-white/80 via-pink-50/40 to-transparent pointer-events-none border-b border-white/50 backdrop-blur-sm" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                    >
                        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100 bg-white">
                            {photo ? (
                                <img src={photo} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200" />
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </motion.div>

                    <div className="space-y-4 text-center md:text-left">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                                {name}
                            </h1>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                            {handle && (
                                <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group">
                                    <span className="text-sm font-semibold">{handle}</span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <InstagramStatsDeck overview={overview} />
                </div>
            </div>
        </section>
    );
}
